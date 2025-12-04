import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";

// Device Type Definition
interface Device {
  id: string;
  name: string;
  mac: string;
  type: "CAM" | "LOCK";
  isOnline: boolean;
}

const DeviceScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [deviceName, setDeviceName] = useState("");
  const [deviceMac, setDeviceMac] = useState("");
  const [deviceType, setDeviceType] = useState<"CAM" | "LOCK">("CAM");

  // Mock Data
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Front Gate Camera",
      mac: "24:6F:28:A1:B2:C3",
      type: "CAM",
      isOnline: true,
    },
    {
      id: "2",
      name: "Main Door Lock",
      mac: "A1:B2:C3:D4:E5:F6",
      type: "LOCK",
      isOnline: false,
    },
  ]);

  // Handle Add Device
  const handleAddDevice = () => {
    if (!deviceName || !deviceMac) {
      Alert.alert("Error", "Please fill in all fields (Name and MAC Address)");
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      name: deviceName,
      mac: deviceMac,
      type: deviceType,
      isOnline: true, // Default to true for demo
    };

    setDevices([...devices, newDevice]);
    setModalVisible(false);
    resetForm();
    Alert.alert("Success", "Device linked successfully");
  };

  // Handle Delete Device
  const handleDeleteDevice = (id: string) => {
    Alert.alert(
      "Unlink Device",
      "Are you sure you want to remove this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setDevices(devices.filter((dev) => dev.id !== id));
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setDeviceName("");
    setDeviceMac("");
    setDeviceType("CAM");
  };

  // Render Item for FlatList
  const renderDeviceItem = ({ item }: { item: Device }) => (
    <View style={styles.deviceItem}>
      {/* Icon based on Type */}
      <View style={[styles.iconContainer, item.isOnline ? styles.onlineBorder : styles.offlineBorder]}>
        <Ionicons
          name={item.type === "CAM" ? "videocam-outline" : "lock-closed-outline"}
          size={24}
          color="#fff"
        />
      </View>

      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceMac}>MAC: {item.mac}</Text>
        <View style={styles.statusContainer}>
            <View style={[styles.dot, { backgroundColor: item.isOnline ? '#4CAF50' : '#F44336' }]} />
            <Text style={styles.statusText}>{item.isOnline ? "Online" : "Offline"}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleDeleteDevice(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Devices</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Device List */}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No devices linked yet.</Text>
        }
      />

      {/* Add Device Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Link New Device</Text>

            <TextInput
              style={styles.input}
              placeholder="Device Name (e.g. Living Room Cam)"
              placeholderTextColor="#666"
              value={deviceName}
              onChangeText={setDeviceName}
            />

            <TextInput
              style={styles.input}
              placeholder="MAC Address (e.g. 24:6F:28...)"
              placeholderTextColor="#666"
              value={deviceMac}
              onChangeText={setDeviceMac}
              autoCapitalize="characters"
            />

            {/* Type Selector */}
            <View style={styles.typeSelector}>
                <Text style={styles.label}>Device Type:</Text>
                <View style={styles.radioGroup}>
                    <TouchableOpacity 
                        style={[styles.radioButton, deviceType === 'CAM' && styles.radioSelected]}
                        onPress={() => setDeviceType('CAM')}
                    >
                        <Ionicons name="videocam" size={16} color={deviceType === 'CAM' ? "#fff" : "#888"} />
                        <Text style={[styles.radioText, deviceType === 'CAM' && styles.textSelected]}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.radioButton, deviceType === 'LOCK' && styles.radioSelected]}
                        onPress={() => setDeviceType('LOCK')}
                    >
                        <Ionicons name="lock-closed" size={16} color={deviceType === 'LOCK' ? "#fff" : "#888"} />
                        <Text style={[styles.radioText, deviceType === 'LOCK' && styles.textSelected]}>Lock</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => {
                    setModalVisible(false);
                    resetForm();
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={handleAddDevice}
              >
                <Text style={styles.btnText}>Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeviceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  backBtn: { padding: 5 },
  
  listContent: { padding: 20 },
  emptyText: { color: "#666", textAlign: "center", marginTop: 50 },

  // Device Item Styles
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 2,
  },
  onlineBorder: { borderColor: "#4CAF50" },
  offlineBorder: { borderColor: "#F44336" },
  
  deviceInfo: { flex: 1 },
  deviceName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deviceMac: { color: "#aaa", fontSize: 12, marginTop: 2 },
  
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { color: "#ccc", fontSize: 12 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2C2C2C",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  label: { color: "#aaa", marginBottom: 10 },
  typeSelector: { marginBottom: 20 },
  radioGroup: { flexDirection: 'row', gap: 10 },
  radioButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
      backgroundColor: '#2C2C2C',
      gap: 5
  },
  radioSelected: {
      backgroundColor: '#7b5cff',
      borderColor: '#7b5cff'
  },
  radioText: { color: '#888', fontWeight: '600' },
  textSelected: { color: '#fff' },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancel: { backgroundColor: "#444" },
  btnSave: { backgroundColor: "#7b5cff" },
  btnText: { color: "#fff", fontWeight: "bold" },
});