import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

const profileData = [
  { id: "1", title: "Thông tin cá nhân", icon: "person-circle-outline" },
  { id: "2", title: "Quản lý khuôn mặt", icon: "happy-outline" },
  { id: "3", title: "Lịch sử truy cập", icon: "time-outline" },
  { id: "4", title: "Thiết bị liên kết", icon: "hardware-chip-outline" },
  { id: "5", title: "Cài đặt", icon: "settings-outline" },
  { id: "6", title: "Đăng xuất", icon: "log-out-outline" },
];

const ProfileScreen = () => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.itemContent}>
        <Ionicons name={item.icon} size={22} color="#fff" style={styles.icon} />
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar + Name */}
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=8" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Nguyễn Văn A</Text>
        <Text style={styles.email}>nguyenvana@example.com</Text>
      </View>

      {/* List */}
      <FlatList
        data={profileData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  profileInfo: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "600", color: "#fff" },
  email: { fontSize: 14, color: "#aaa" },
  list: { paddingHorizontal: 15 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  itemContent: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 15 },
  itemText: { fontSize: 16, color: "#fff" },
});
