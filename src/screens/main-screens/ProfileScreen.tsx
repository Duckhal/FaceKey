import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import SettingItem from "../../components/SettingItem";

// Menu data
const profileData = [
  { id: "1", title: "Personal Info", icon: "person-circle-outline" },
  { id: "2", title: "Linked Devices", icon: "hardware-chip-outline" },
  { id: "3", title: "Settings", icon: "settings-outline" },
  { id: "4", title: "Logout", icon: "log-out-outline", isDestructive: true },
];

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load user info");
    }
  };

  // Function to get the first letter of the username
  const getAvatarLetter = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : "?";
  };

  const handleLogout = async () => {
    Alert.alert("Log out", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Agree", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {getAvatarLetter(userInfo?.username)}
          </Text>
        </View>

        <Text style={styles.name}>{userInfo?.username || "Loading..."}</Text>
        <Text style={styles.email}>{userInfo?.email || "..."}</Text>
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
                onPress={() => item.isDestructive ? handleLogout() : console.log(item.title)}
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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  profileInfo: { alignItems: "center", marginVertical: 30 },

  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 15,
    backgroundColor: '#7b5cff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  name: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 5 },
  email: { fontSize: 14, color: "#aaa" },
  list: { paddingHorizontal: 15 },
});