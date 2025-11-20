// HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { doors } from "../../constants/doors";
import { API_URL } from "../../constants/Config";

const HomeScreen = () => {
  const handleOpenDoor = (doorId: string) => {
    console.log(`Open door ${doorId}`);
    // TODO: call API để mở cửa
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.doorItem}>
      <Ionicons name="home-outline" size={40} color="#7b5cff" />
      <Text style={styles.doorName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => handleOpenDoor(item.id)}
      >
        <Text style={styles.openText}>Open</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={doors}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333" }} />
          )}
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
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
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
