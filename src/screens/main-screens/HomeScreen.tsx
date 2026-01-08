import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  RefreshControl, Alert, Modal, TextInput, Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoorItem, { Door } from "../../components/DoorItem"; 
import api from "../../services/api";
import Ionicons from "@react-native-vector-icons/ionicons"; 

interface DoorPayload {
  device_name: string;
  device_uid: string;
  device_type: 'LOCK';
  camera_uid?: string | null;
  gpio_pin: number;
}

const HomeScreen = () => {
  const [doorList, setDoorList] = useState<Door[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  const [newDoorName, setNewDoorName] = useState("");
  const [newDoorMac, setNewDoorMac] = useState("");
  const [newDoorPin, setNewDoorPin] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [newCamMac, setNewCamMac] = useState("");

  const [userInitial, setUserInitial] = useState("?");

  useEffect(() => { loadData(); loadUserInitial(); }, []);

  const loadUserInitial = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username) {
          setUserInitial(user.username.charAt(0).toUpperCase());
        }
      }
    } catch (e) {
      console.error("Failed to load user info", e);
    }
  };

  const loadData = async () => {
    try {
        const res = await api.get('/devices');
        if(res.data) {
            const doors: Door[] = res.data
              .filter((d:any) => d.device_type === 'LOCK')
              .map((d: any) => ({
                id: d.device_id,
                uid: d.device_uid,
                name: d.device_name,
                hasCamera: !!d.camera_uid,
                cameraUid: d.camera_uid,
                gpioPin: d.gpio_pin
            }));
            setDoorList(doors);
        }
    } catch(e) { console.error(e); }
  };

  const openAddModal = () => {
      resetForm();
      setIsEditing(false);
      setCurrentEditId(null);
      setModalVisible(true);
  }

  const handleEditDoor = (item: Door) => {
      setNewDoorName(item.name);
      setNewDoorMac(item.uid);
      setNewDoorPin(item.gpioPin.toString());
      setHasCamera(item.hasCamera);
      setNewCamMac(item.cameraUid || "");
      
      setIsEditing(true);
      setCurrentEditId(item.id);
      setModalVisible(true);
  }

  const handleSave = async () => {
    if(!newDoorName || !newDoorMac || !newDoorPin) {
        Alert.alert("Error", "Please enter required fields");
        return;
    }

    const payload: DoorPayload = {
        device_name: newDoorName,
        device_uid: newDoorMac,
        device_type: 'LOCK',
        camera_uid: hasCamera ? newCamMac : null,
        gpio_pin: parseInt(newDoorPin)
    };

    try {
        if (isEditing && currentEditId) {
            await api.patch(`/devices/${currentEditId}`, payload);
            Alert.alert("Success", "Door updated successfully");
        } else {
            await api.post('/devices', payload);
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
                          await api.delete(`/devices/${id}`);
                          loadData();
                      } catch (e) {
                          Alert.alert("Error", "Failed to delete door");
                      }
                  }
              }
          ]
      );
  }

  const resetForm = () => {
      setNewDoorName("");
      setNewDoorMac("");
      setNewDoorPin("");
      setHasCamera(false);
      setNewCamMac("");
  }

  const handleOpenDoor = async (doorUid: string) => {
     try {
         await api.post('/recognition/open', { device_uid: doorUid });
         Alert.alert("Success", "Open command sent");
     } catch(e) { Alert.alert("Error", "Failed to open"); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Doors</Text>
        <TouchableOpacity onPress={openAddModal}>
          <View style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={doorList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DoorItem 
                item={item} 
                onOpen={handleOpenDoor} 
                onEdit={handleEditDoor}
                onDelete={handleDeleteDoor}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#fff"/>}
          ListEmptyComponent={<Text style={styles.emptyText}>No doors registered</Text>}
        />
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Door" : "Add New Door"}</Text>

            <TextInput 
                style={styles.input} placeholder="Door Name" placeholderTextColor="#888"
                value={newDoorName} onChangeText={setNewDoorName}
            />
            <TextInput 
                style={styles.input} placeholder="Servo MAC Address" placeholderTextColor="#888"
                value={newDoorMac} onChangeText={setNewDoorMac}
            />
            <TextInput 
                style={styles.input} placeholder="GPIO Pin" placeholderTextColor="#888"
                keyboardType="numeric" value={newDoorPin} onChangeText={setNewDoorPin}
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Has Camera?</Text>
                <Switch value={hasCamera} onValueChange={setHasCamera} trackColor={{false: '#767577', true: '#7b5cff'}}/>
            </View>

            {hasCamera && (
                <TextInput 
                    style={styles.input} placeholder="Camera MAC Address" placeholderTextColor="#888"
                    value={newCamMac} onChangeText={setNewCamMac}
                />
            )}

            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.btnText}>{isEditing ? "Update" : "Save"}</Text>
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
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center", borderBottomWidth: 1, borderColor: '#333' },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7b5cff', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e1e1e', borderRadius: 10, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 15 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  switchLabel: { color: '#fff', fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#444', padding: 12, borderRadius: 8, marginRight: 10, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#7b5cff', padding: 12, borderRadius: 8, marginLeft: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});