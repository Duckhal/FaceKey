import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

// Định nghĩa kiểu dữ liệu cho 1 cánh cửa
export interface Door {
  id: string;
  name: string;
  //  status: 'locked' | 'unlocked'
}

interface DoorItemProps {
  item: Door;
  onOpen: (id: string) => void;
}

const DoorItem: React.FC<DoorItemProps> = ({ item, onOpen }) => {
  return (
    <View style={styles.doorItem}>
      {/* Icon cửa */}
      <Ionicons name="home-outline" size={40} color="#7b5cff" />
      
      {/* Tên cửa */}
      <Text style={styles.doorName}>{item.name}</Text>
      
      {/* Nút mở cửa */}
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => onOpen(item.id)}
      >
        <Text style={styles.openText}>Open</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoorItem;

const styles = StyleSheet.create({
  doorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  doorName: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  openButton: {
    backgroundColor: "#7b5cff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  openText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});