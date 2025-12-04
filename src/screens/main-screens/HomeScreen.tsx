import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doors } from "../../constants/doors";
import DoorItem from "../../components/DoorItem";

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Hàm xử lý logic mở cửa
  const handleOpenDoor = (doorId: string) => {
    console.log(`Request Open door: ${doorId}`);
    // Code gọi API service sẽ đặt ở đây
    // await doorService.openDoor(doorId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
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
});