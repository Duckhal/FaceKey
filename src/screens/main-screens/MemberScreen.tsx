import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { launchCamera } from "react-native-image-picker";
import axios from "axios";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const MemberScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userList, setUserList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.145.16:3000/members`);

      if (Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        console.error("API /members không trả về một mảng!");
        setUserList([]);
      }

    } catch (err) {
      console.error("Error loading member list", err);
      Alert.alert("Error","Unable to load member list");

      setUserList([]);
    }
    setLoading(false);
  }

  // Yêu cầu quyền Camera cho Android
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permissions",
            message: "The app needs Camera access to take photos",
            buttonNeutral: "Ask again later",
            buttonNegative: "Cancel",
            buttonPositive: "Agree",
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
  const openCamera = async (isForUpdate: boolean = false) => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permissions",
            message: "The app needs Camera access to take photos",
            buttonNeutral: "Ask again later",
            buttonNegative: "Cancel",
            buttonPositive: "Agree",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Notification", "You have not granted Camera permission");
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
          console.log("User cancelled taking photo");
        } else if (response.errorCode) {
          console.error("Camera error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          
          if (isForUpdate && selectedUser) {
            // 1. NẾU LÀ UPDATE: Chỉ cập nhật avatar của user đang chọn
            setSelectedUser({
              ...selectedUser,
              avatar: uri,
            });
          } else {
            // 2. NẾU LÀ THÊM MỚI: Tạo user mới và mở modal
            setSelectedUser({
              id: Date.now().toString(),
              name: "",
              role: "",
              avatar: uri,
            });
            setModalVisible(true);
          }
        }
      }
    );
  };

  // Hàm mở popup
  const openPopup = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleAddMember = async () => {
    if(!selectedUser || !selectedUser.name || !selectedUser.avatar) {
      Alert.alert("Please enter your name and take a photo");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append('name', selectedUser.name);
    formData.append('role', selectedUser.role || 'Member');
    formData.append('file',{
      uri: selectedUser.avatar,
      type: 'image/jpeg',
      name: `face-${Date.now()}.jpg`,
    });

    try {
      const response = await axios.post(`http://192.168.145.16:3000/members/register-face`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      fetchMembers();
      Alert.alert("Success", "Registered Successfully");
    } catch (err) {
      console.error("Unable to register, please try again", err);
      Alert.alert("Error", "Unable to register, please try again");
    }

    setLoading(false);
    setModalVisible(false);
  }

const handleUpdateMember = async () => {
    if (!selectedUser || !selectedUser.id) {
        Alert.alert("Error", "user's ID is not identified");
        return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('name', selectedUser.name);
    formData.append('role', selectedUser.role);

    if (selectedUser.avatar && selectedUser.avatar.startsWith('file://')) {
        formData.append('file', {
            uri: selectedUser.avatar,
            type: 'image/jpeg',
            name: `face-${Date.now()}.jpg`,
        });
    }

    try {
        const response = await axios.patch(
            `http://192.168.145.16:3000/members/update/${selectedUser.id}`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        await fetchMembers();
        Alert.alert("Success", "Changed Successfully");
        
        setLoading(false);
        setModalVisible(false);

    } catch (err) {
        console.error("Unable to change, please try again", err);
        Alert.alert("Error", "Unable to change, please try again");
        setLoading(false);
    }
  }

  const handleDeleteMember = async (userId : string) => {
    Alert.alert(
      "You are about to remove this member's permission",
      "Do you wish to continue?",
      [
        { text: "Cancel"},
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`http://192.168.145.16:3000/members/delete/${userId}`);

              setUserList(userList.filter((user) => user.id !== userId));
              Alert.alert("Success", "Removed Successfully");
            } catch (err) {
              console.error("Error", "Falied to remove");
              Alert.alert("Error", "Falied to remove");
            }
            setLoading(false);
            setModalVisible(false);
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Member }) => (
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
        <TouchableOpacity style={styles.addBtn} onPress={() => openCamera(false)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 50 }} />
        ): (
        <FlatList
          data={userList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333", marginLeft: 60 }} />
          )}
        />
        )}
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
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: selectedUser.avatar }} style={styles.modalAvatar} />
                  <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={() => openCamera(true)} 
                  >
                    <Ionicons name="camera-outline" size={24} color="#222" />
                  </TouchableOpacity>
                </View>
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
                  onPress={() => {
                    handleDeleteMember(selectedUser.id);
                  }}
                  >
                    <Text style={styles.closeText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => {
                    if (userList.find(user => user.id === selectedUser.id)) {
                      handleUpdateMember();
                    } else {
                      handleAddMember();
                    }
                  }}
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
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  cameraIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#bbb',
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
