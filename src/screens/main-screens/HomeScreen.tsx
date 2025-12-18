import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoorItem, { Door } from "../../components/DoorItem"; 
import api from "../../services/api";

interface DeviceResponse {
  device_uid: string;
  device_name: string;
  device_type: string;
}

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userInitial, setUserInitial] = useState("?");
  const [doorList, setDoorList] = useState<Door[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadUserInitial(), fetchDevices()]);
    setLoading(false);
  };

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

  const fetchDevices = async () => {
    try {
      const response = await api.get<DeviceResponse[]>('/devices');

      if (response.data) {
        const cameras = response.data
          .filter((d) => d.device_type === 'CAM')
          .map((d) => ({
            id: d.device_uid,
            name: d.device_name || `Camera ${d.device_uid}`,
          }));
        setDoorList(cameras);
      }
    } catch (error: any) {
      console.error("Error fetching devices:", error);
      if (error.response?.status === 401) {
         console.log("Token expired or invalid");
      }
    }
  };

  const handleOpenDoor = async (doorId: string) => {
    console.log(`Request Open door: ${doorId}`);
    Alert.alert("Info", `Opening door ${doorId}...`);
    // Code gọi API mở cửa ở đây...
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={doorList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoorItem item={item} onOpen={handleOpenDoor} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333" }} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={
            <Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>
                {loading ? "Updating..." : "No Cameras Found"}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#121212" 
  },
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
  headerTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  avatarContainer: { 
    width: 35, 
    height: 35, 
    borderRadius: 17.5, 
    backgroundColor: '#7b5cff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
});