// MemberScreen.tsx
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
import { users } from "../../constants/users";

const MemberScreen = () => {
  const renderItem = ({ item }: { item: { id: string; name: string; avatar: string } }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => console.log("Pressed user:", item.name)} // sau này sẽ mở màn hình edit
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <Text style={styles.userName}>{item.name}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="#aaa" style={styles.arrow} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => console.log("Add new user")}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333", marginLeft: 60 }} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  addBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent:'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  arrow: {
    marginLeft: "auto",
  },
});
