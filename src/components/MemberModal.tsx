import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { Member } from './MemberItem';

interface MemberModalProps {
  visible: boolean;
  user: any; // Hoặc dùng Partial<Member>
  onClose: () => void;
  onChangeName: (text: string) => void;
  onChangeRole: (text: string) => void;
  onTakePhoto: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}

const MemberModal: React.FC<MemberModalProps> = ({
  visible,
  user,
  onClose,
  onChangeName,
  onChangeRole,
  onTakePhoto,
  onSave,
  onDelete,
}) => {
  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          
          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="#333" />
          </TouchableOpacity>

          {/* Avatar & Camera */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.modalAvatar} />
            <TouchableOpacity style={styles.cameraIcon} onPress={onTakePhoto}>
              <Ionicons name="camera-outline" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <TextInput
            style={styles.modalInput}
            value={user.name}
            placeholder="Name"
            onChangeText={onChangeName}
          />
          <TextInput
            style={styles.modalInput}
            value={user.role}
            placeholder="Role"
            onChangeText={onChangeRole}
          />

          {/* Buttons Action */}
          <View style={styles.modalOption}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(user.id)}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    color: '#000'
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  btnText: {
    color: '#222',
    fontWeight: '600',
  },
});

export default MemberModal;