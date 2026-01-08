import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  RefreshControl, Alert, Modal, TextInput, Switch, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoorItem, { Door } from "../../components/DoorItem"; 
import api from "../../services/api";
import Ionicons from "@react-native-vector-icons/ionicons"; 

interface DoorPayload {
  name: string;
  lock_device_id: number;
  camera_device_id?: number | null;
  gpio_pin: number;
}

interface RawDevice {
    device_id: number;
    device_name: string;
    device_uid: string;
    device_type: 'LOCK' | 'CAM';
}

const HomeScreen = () => {
  const [doorList, setDoorList] = useState<Door[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Lists để chọn trong Dropdown
  const [availableLocks, setAvailableLocks] = useState<RawDevice[]>([]);
  const [availableCams, setAvailableCams] = useState<RawDevice[]>([]);

  // Dropdown States
  const [showLockDropdown, setShowLockDropdown] = useState(false);
  const [showCamDropdown, setShowCamDropdown] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Form State
  const [newDoorName, setNewDoorName] = useState("");
  const [selectedLock, setSelectedLock] = useState<RawDevice | null>(null);
  const [selectedCam, setSelectedCam] = useState<RawDevice | null>(null);
  const [newDoorPin, setNewDoorPin] = useState("");
  const [hasCamera, setHasCamera] = useState(false);

  const [userInitial, setUserInitial] = useState("?");

  useEffect(() => { loadData(); loadUserInitial(); }, []);

  const loadUserInitial = async () => {};

  const loadData = async () => {
    try {
        // 1. Lấy danh sách DOORS để hiển thị
        const doorRes = await api.get('/doors');
        if(doorRes.data) {
            const doors: Door[] = doorRes.data.map((d: any) => ({
                id: d.id,
                name: d.name,
                uid: d.lockDevice?.device_uid || 'N/A',
                hasCamera: !!d.cameraDevice,
                cameraUid: d.cameraDevice?.device_uid,
                gpioPin: d.gpio_pin,
                lockDeviceId: d.lock_device_id,
                cameraDeviceId: d.camera_device_id
            }));
            setDoorList(doors);
        }

        const deviceRes = await api.get('/devices');
        if(deviceRes.data) {
            const allDevices: RawDevice[] = deviceRes.data;
            setAvailableLocks(allDevices.filter(d => d.device_type === 'LOCK'));
            setAvailableCams(allDevices.filter(d => d.device_type === 'CAM'));
        }
    } catch(e) { console.error("Load Data Error:", e); }
  };

  const openAddModal = () => {
      resetForm();
      setIsEditing(false);
      setCurrentEditId(null);
      setModalVisible(true);
  }

  const handleEditDoor = (item: Door) => {
      setNewDoorName(item.name);
      setNewDoorPin(item.gpioPin.toString());
      setHasCamera(item.hasCamera);
      
      const lockObj = availableLocks.find(l => l.device_id === item.lockDeviceId);
      setSelectedLock(lockObj || null);

      if (item.hasCamera && item.cameraDeviceId) {
          const camObj = availableCams.find(c => c.device_id === item.cameraDeviceId);
          setSelectedCam(camObj || null);
      } else {
          setSelectedCam(null);
      }
      
      setIsEditing(true);
      setCurrentEditId(item.id);
      setModalVisible(true);
  }

  const handleSave = async () => {
    if(!newDoorName || !selectedLock || !newDoorPin) {
        Alert.alert("Error", "Please select a Lock Device and enter Name/Pin");
        return;
    }

    const payload: DoorPayload = {
        name: newDoorName,
        lock_device_id: selectedLock.device_id,
        camera_device_id: hasCamera && selectedCam ? selectedCam.device_id : null,
        gpio_pin: parseInt(newDoorPin)
    };

    try {
        if (isEditing && currentEditId) {
            await api.patch(`/doors/${currentEditId}`, payload);
            Alert.alert("Success", "Door updated successfully");
        } else {
            await api.post('/doors', payload);
            Alert.alert("Success", "Door added successfully");
        }
        
        setModalVisible(false);
        loadData();
    } catch (e: any) {
        Alert.alert("Error", e.response?.data?.message || "Action failed");
    }
  };

  const handleDeleteDoor = (id: number) => {
      Alert.alert(
          "Delete Door",
          "Are you sure you want to delete this door?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive",
                  onPress: async () => {
                      try {
                          await api.delete(`/doors/${id}`);
                          loadData();
                      } catch (e) { Alert.alert("Error", "Failed to delete door"); }
                  }
              }
          ]
      );
  }

  const resetForm = () => {
      setNewDoorName("");
      setSelectedLock(null);
      setSelectedCam(null);
      setNewDoorPin("");
      setHasCamera(false);
      setShowLockDropdown(false);
      setShowCamDropdown(false);
  }

  const handleOpenDoor = async (doorId: number) => {
     try {
         await api.post('/recognition/open', { door_id: doorId });
         Alert.alert("Success", "Open command sent");
     } catch(e) { Alert.alert("Error", "Failed to open"); }
  };

  const renderDropdownItem = (item: RawDevice, onSelect: (d: RawDevice) => void) => (
      <TouchableOpacity 
        style={styles.dropdownItem} 
        onPress={() => onSelect(item)}
        key={item.device_id}
      >
          <Text style={styles.dropdownItemText}>{item.device_name} ({item.device_uid})</Text>
      </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Doors</Text>
        <TouchableOpacity onPress={openAddModal}>
          <View style={styles.addButton}><Ionicons name="add" size={24} color="#fff" /></View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={doorList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DoorItem item={item} onOpen={handleOpenDoor} onEdit={handleEditDoor} onDelete={handleDeleteDoor} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#fff"/>}
          ListEmptyComponent={<Text style={styles.emptyText}>No doors setup yet</Text>}
        />
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Door" : "Configure Door"}</Text>

            <Text style={styles.label}>Door Name</Text>
            <TextInput 
                style={styles.input} placeholder="e.g. Front Door" placeholderTextColor="#666"
                value={newDoorName} onChangeText={setNewDoorName}
            />

            <Text style={styles.label}>Select ESP32 Controller</Text>
            <TouchableOpacity 
                style={styles.dropdownBtn} 
                onPress={() => { setShowLockDropdown(!showLockDropdown); setShowCamDropdown(false); }}
            >
                <Text style={styles.dropdownBtnText}>
                    {selectedLock ? `${selectedLock.device_name}` : "Select a Device..."}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
            
            {showLockDropdown && (
                <View style={styles.dropdownList}>
                    <ScrollView style={{maxHeight: 150}}>
                        {availableLocks.length > 0 ? (
                            availableLocks.map(d => renderDropdownItem(d, (item) => {
                                setSelectedLock(item);
                                setShowLockDropdown(false);
                            }))
                        ) : (
                            <Text style={styles.dropdownEmptyText}>No LOCK devices registered.</Text>
                        )}
                    </ScrollView>
                </View>
            )}

            <Text style={styles.label}>GPIO Pin</Text>
            <TextInput 
                style={styles.input} placeholder="e.g. 13" placeholderTextColor="#666"
                keyboardType="numeric" value={newDoorPin} onChangeText={setNewDoorPin}
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Link a Camera?</Text>
                <Switch value={hasCamera} onValueChange={setHasCamera} trackColor={{false: '#767577', true: '#7b5cff'}}/>
            </View>

            {hasCamera && (
                <>
                    <Text style={styles.label}>Select Camera</Text>
                    <TouchableOpacity 
                        style={styles.dropdownBtn} 
                        onPress={() => { setShowCamDropdown(!showCamDropdown); setShowLockDropdown(false); }}
                    >
                        <Text style={styles.dropdownBtnText}>
                            {selectedCam ? `${selectedCam.device_name}` : "Select a Camera..."}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#fff" />
                    </TouchableOpacity>

                    {showCamDropdown && (
                        <View style={styles.dropdownList}>
                            <ScrollView style={{maxHeight: 150}}>
                                {availableCams.length > 0 ? (
                                    availableCams.map(d => renderDropdownItem(d, (item) => {
                                        setSelectedCam(item);
                                        setShowCamDropdown(false);
                                    }))
                                ) : (
                                    <Text style={styles.dropdownEmptyText}>No CAM devices registered.</Text>
                                )}
                            </ScrollView>
                        </View>
                    )}
                </>
            )}

            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  addButton: {    
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center", 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  emptyText: { 
    color: '#888', 
    textAlign: 'center', 
    marginTop: 50 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    justifyContent: 'center', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#1e1e1e', 
    borderRadius: 10, 
    padding: 20 
  },
  modalTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  label: { 
    color: '#aaa', 
    marginBottom: 5, 
    fontSize: 12, 
    marginTop: 10 
  },
  input: { 
    backgroundColor: '#333', 
    color: '#fff', 
    borderRadius: 8, 
    padding: 12 
  },
  dropdownBtn: { 
    backgroundColor: '#333', 
    borderRadius: 8, 
    padding: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  dropdownBtnText: { color: '#fff' },
  dropdownList: { 
    backgroundColor: '#2a2a2a', 
    borderRadius: 8, 
    marginTop: 5, 
    borderWidth: 1, 
    borderColor: '#444', 
    maxHeight: 150 
  },
  dropdownItem: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  dropdownItemText: { color: '#ddd' },
  dropdownEmptyText: { 
    color: '#888', 
    padding: 10, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
  switchContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15, 
    marginBottom: 5 
  },
  switchLabel: { 
    color: '#fff', 
    fontSize: 16 
  },
  modalButtons: { 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: 25 
  },
  cancelBtn: { 
    flex: 1, 
    backgroundColor: '#444',
    padding: 12, 
    borderRadius: 8, 
    marginRight: 10, 
    alignItems: 'center' 
  },
  saveBtn: { 
    flex: 1, 
    backgroundColor: '#7b5cff', 
    padding: 12, 
    borderRadius: 8, 
    marginLeft: 10, 
    alignItems: 'center' 
  },
  btnText: { color: '#fff', fontWeight: 'bold' }
});