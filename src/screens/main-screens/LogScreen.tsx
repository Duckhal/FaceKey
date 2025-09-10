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
import Lucide from "@react-native-vector-icons/lucide";

const users = [
  { id: "1", name: "Nguyen Van A" },
  { id: "2", name: "Tran Thi B" },
  { id: "3", name: "Le Van C" },
  { id: "4", name: "Pham Van D" },
];

const LogScreen = () => {
  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.userItem}>
      <Lucide name="door-open" size={40} color="#7b5cff" />
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log</Text>
        <TouchableOpacity style={styles.addBtn}>
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
            <View style={{ height: 1, backgroundColor: "#333" }} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default LogScreen;

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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
});
