import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { launchCamera } from "react-native-image-picker";
import api from "../../services/api";
import MemberItem, { Member } from "../../components/MemberItem";
import MemberModal from "../../components/MemberModal";

const MemberScreen = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userList, setUserList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/members`);
      if (Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        setUserList([]);
      }
      console.log("Avatar URL:", response.data.map((item: Member) => item.avatar));
    } catch (err) {
      Alert.alert("Error", "Unable to load member list");
      setUserList([]);
    }
    setLoading(false);
  };

  // LOGIC CAMERA
  const openCamera = async (isForUpdate: boolean = false) => {
    if (Platform.OS === "android") {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
        } catch (err) { return; }
    }

    launchCamera(
      { mediaType: "photo", cameraType: "back", saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (isForUpdate && selectedUser) {
            setSelectedUser({ ...selectedUser, avatar: uri });
          } else {
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

  // LOGIC CRUD
  const handleSaveUser = () => {
      const isExisting = userList.find(u => u.id === selectedUser.id);
      if (isExisting) {
          handleUpdateMember();
      } else {
          handleAddMember();
      }
  }

  const handleAddMember = async () => {
    if(!selectedUser?.name || !selectedUser?.avatar) {
      Alert.alert("Please enter name and take photo");
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
      await api.post(`/members/register-face`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchMembers();
      Alert.alert("Success", "Registered Successfully");
    } catch (err) {
      console.error("Chi tiết lỗi:", err.response?.data || err.message);
      Alert.alert("Error", "Unable to register");
    }
    setLoading(false);
    setModalVisible(false);
  }

  const handleUpdateMember = async () => {
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
        await api.patch(`/members/update/${selectedUser.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        await fetchMembers();
        Alert.alert("Success", "Changed Successfully");
        setModalVisible(false);
    } catch (err) {
        Alert.alert("Error", "Unable to update");
    }
    setLoading(false);
  }

  const handleDeleteMember = async (userId : string) => {
    Alert.alert("Confirm", "Do you wish to remove this member?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/members/delete/${userId}`);
            setUserList(userList.filter((user) => user.id !== userId));
            Alert.alert("Success", "Removed Successfully");
          } catch (err) {
            Alert.alert("Error", "Failed to remove");
          }
          setLoading(false);
          setModalVisible(false);
        },
        style: "destructive"
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Member</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openCamera(false)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={userList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <MemberItem 
                    item={item} 
                    onPress={(user) => {
                        setSelectedUser(user);
                        setModalVisible(true);
                    }} 
                />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
            }
            ListEmptyComponent={
                <Text style={{color: 'gray', textAlign: 'center', marginTop: 20}}>
                    No Member
                </Text>
            }
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#333", marginLeft: 60 }} />
            )}
          />
        )}
      </View>

      {/* Modal Component */}
      <MemberModal 
        visible={modalVisible}
        user={selectedUser}
        onClose={() => setModalVisible(false)}
        onChangeName={(text) => setSelectedUser({...selectedUser, name: text})}
        onChangeRole={(text) => setSelectedUser({...selectedUser, role: text})}
        onTakePhoto={() => openCamera(true)}
        onSave={handleSaveUser}
        onDelete={handleDeleteMember}
      />
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
});