import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingItem from "../../components/SettingItem";

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    isDestructive?: boolean;
}

const profileData: MenuItem[] = [
  { id: "1", title: "Thông tin cá nhân", icon: "person-circle-outline" },
  { id: "2", title: "Thiết bị liên kết", icon: "hardware-chip-outline" },
  { id: "3", title: "Cài đặt", icon: "settings-outline" },
  { id: "4", title: "Đăng xuất", icon: "log-out-outline", isDestructive: true },
];

const ProfileScreen = () => {

  const handlePressItem = (item: MenuItem) => {
      if (item.id === "4") {
          handleLogout();
      } else {
          console.log(`Maps to ${item.title}`);
          // navigation.navigate(item.route);
      }
  };

  const handleLogout = () => {
      Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
          { text: "Hủy", style: "cancel" },
          { text: "Đồng ý", style: "destructive", onPress: () => console.log("Logged out") }
      ]);
  };

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
            <SettingItem 
                title={item.title}
                icon={item.icon}
                onPress={() => handlePressItem(item)}
                color={item.isDestructive ? "#ff4444" : "#fff"}
                showChevron={!item.isDestructive}
            />
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  profileInfo: { alignItems: "center", marginVertical: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, borderWidth: 2, borderColor: '#333' },
  name: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 5 },
  email: { fontSize: 14, color: "#aaa" },
  list: { paddingHorizontal: 15 },
});