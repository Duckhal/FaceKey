import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

export interface Door {
  id: number;
  uid: string; 
  name: string;
  hasCamera: boolean;
  cameraUid?: string;
  gpioPin: number;
  lockDeviceId: number;
  cameraDeviceId?: number;
}

interface DoorItemProps {
  item: Door;
  onOpen: (id: number) => void;
  onEdit: (item: Door) => void;
  onDelete: (id: number) => void;
}

const DoorItem: React.FC<DoorItemProps> = ({ item, onOpen, onEdit, onDelete }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = async () => {
    setIsOpening(true);
    try {
      await onOpen(item.id);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <View style={styles.doorItem}>
      <Ionicons name="home-outline" size={32} color="#7b5cff" />
      
      <View style={styles.infoContainer}>
        <Text style={styles.doorName}>{item.name}</Text>
        <Text style={styles.doorDetail}>MAC: {item.uid} (Pin {item.gpioPin})</Text>
        {item.hasCamera && <Text style={styles.doorDetail}>Cam: {item.cameraUid}</Text>}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
            style={[styles.actionBtn, styles.openBtn]} 
            onPress={handleOpen} 
            disabled={isOpening}
        >
            {isOpening ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.openText}>Open</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
            <Ionicons name="create-outline" size={22} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#ff5c5c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DoorItem;

const styles = StyleSheet.create({
  doorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  doorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600'
  },
  doorDetail: {
    color: "#888",
    fontSize: 12,
    marginTop: 2
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8
  },
  openBtn: {
    backgroundColor: "#7b5cff",
  },
  openText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  iconBtn: {
    padding: 8,
  }
});