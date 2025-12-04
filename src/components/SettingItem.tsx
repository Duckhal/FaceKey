import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface SettingItemProps {
  title: string;
  icon: string;
  onPress?: () => void;
  color?: string;      
  showChevron?: boolean; 
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  title, 
  icon, 
  onPress, 
  color = '#fff', 
  showChevron = true 
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemContent}>
        {/* Icon bên trái */}
        <Ionicons name={icon} size={22} color={color} style={styles.icon} />
        
        {/* Text */}
        <Text style={[styles.itemText, { color: color }]}>{title}</Text>
      </View>
      
      {/* Icon mũi tên bên phải */}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#aaa" />
      )}
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center'
  },
  itemText: {
    fontSize: 16,
  },
});