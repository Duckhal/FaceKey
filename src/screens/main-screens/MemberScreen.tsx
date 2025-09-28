import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { users } from "../../constants/users";
import { launchCamera } from "react-native-image-picker";

const MemberScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Yêu cầu quyền Camera cho Android
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Quyền Camera",
            message: "Ứng dụng cần quyền truy cập Camera để chụp ảnh.",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Hủy",
            buttonPositive: "Đồng ý",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Hàm mở Camera
  const openCamera = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Quyền Camera",
            message: "Ứng dụng cần quyền truy cập Camera để chụp ảnh.",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Hủy",
            buttonPositive: "Đồng ý",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Thông báo", "Bạn chưa cấp quyền Camera!");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log("Người dùng hủy chụp ảnh");
        } else if (response.errorCode) {
          console.error("Lỗi camera: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0].uri || null);
        }
      }
    );
  };

  // Hàm mở popup
  const openPopup = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: { id: string; name: string; role: string, avatar: string } }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => openPopup(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.roles}>{item.role}</Text>
      </View>
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
        <TouchableOpacity style={styles.addBtn} onPress={openCamera}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nếu có ảnh chụp thì hiển thị */}
      {photo && (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Image source={{ uri: photo }} style={{ width: 200, height: 200, borderRadius: 10 }} />
        </View>
      )}

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

      {/* Modal popup */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedUser && (
              <>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Image source={{ uri: selectedUser.avatar }} style={styles.modalAvatar} />
                <TextInput
                  style={styles.modalInput}
                  value={selectedUser.name}
                  onChangeText={(text) =>
                    setSelectedUser({ ...selectedUser, name: text })
                  }
                />
                <TextInput
                  style={styles.modalInput}
                  value={selectedUser.role}
                  onChangeText={(text) =>
                    setSelectedUser({ ...selectedUser, role: text })
                  }
                />
                <View style={styles.modalOption}>
                  <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: "center",
    alignItems: "center",
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
  userInfo: {
    flexDirection: "column",
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
  roles: {
    flex: 1,
    color: "#aaa",
    fontSize: 12,
  },
  arrow: {
    marginLeft: "auto",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalOption:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", 
    marginTop: 10,
  },
  closeBtn:{
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  closeIcon:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeText: {
    color: "#222",
    fontWeight: "600",
  },
});
