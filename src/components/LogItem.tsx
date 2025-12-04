import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";

export interface AccessLog {
  id: number;
  member_name_snapshot: string;
  action: 'granted' | 'denied_unrecognized';
  snapshot_url: string;
  timestamp: string;
}

interface LogItemProps {
  item: AccessLog;
}

const LogItem: React.FC<LogItemProps> = ({ item }) => {
  const isGranted = item.action === 'granted';
  const statusColor = isGranted ? "#4CAF50" : "#F44336";
  const statusText = isGranted ? "Access granted" : "Intruder Alert";

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <View style={styles.logItem}>
      <Image 
        source={item.snapshot_url ? { uri: item.snapshot_url } : { uri: "https://via.placeholder.com/50" }} 
        style={styles.logImage} 
      />
      
      <View style={styles.logInfo}>
        <Text style={styles.logName}>{item.member_name_snapshot || "Undefined"}</Text>
        <Text style={[styles.logStatus, { color: statusColor }]}>
          {statusText}
        </Text>
        <Text style={styles.logTime}>{formatTime(item.timestamp)}</Text>
      </View>

      <Ionicons 
        name={isGranted ? "checkmark-circle" : "alert-circle"} 
        size={24} 
        color={statusColor} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5
  },
  logImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
      backgroundColor: '#333'
  },
  logInfo: {
      flex: 1,
      justifyContent: 'center'
  },
  logName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logStatus: {
      fontSize: 14,
      fontWeight: "500",
      marginTop: 2
  },
  logTime: {
      color: "#888",
      fontSize: 12,
      marginTop: 2
  }
});

export default LogItem;