import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doors } from "../../constants/doors";
import DoorItem from "../../components/DoorItem";

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userInitial, setUserInitial] = useState("?");
  useEffect(() => {
    loadUserInitial();
  }, []);

  const loadUserInitial = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username) {
          // Uppercase the first letter of the username
          setUserInitial(user.username.charAt(0).toUpperCase());
        }
      }
    } catch (e) {
      console.error("Failed to load user info in Home", e);
    }
  };

  const handleOpenDoor = (doorId: string) => {
    console.log(`Request Open door: ${doorId}`);
    // Code to call API service
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserInitial();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={doors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoorItem 
                item={item} 
                onOpen={handleOpenDoor} 
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333" }} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={
            <Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>
                No Doors
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
    backgroundColor: "#121212",
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
    fontWeight: "600",
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
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});