import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface MemberItemProps {
  item: Member;
  onPress: (item: Member) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.userItem} onPress={() => onPress(item)}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.roles}>{item.role}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#aaa" style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
  },
  roles: {
    color: '#aaa',
    fontSize: 12,
  },
  arrow: {
    marginLeft: 'auto',
  },
});

export default MemberItem;