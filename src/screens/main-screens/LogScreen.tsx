import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import axios from "axios";
import { API_URL } from "../../constants/Config"; 

interface AccessLog {
  id: number;
  member_name_snapshot: string;
  action: 'granted' | 'denied_unrecognized';
  snapshot_url: string;
  timestamp: string;
}

const LogScreen = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/accesslogs`);
      setLogs(response.data);
    } catch (error) {
      console.error("Error when getting logs:", error);
    }
  };

  const handleClearLogs = () => {
    if (logs.length === 0) return;

    Alert.alert(
      "Confirm",
      "Are you sure you want to delete ALL browsing history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_URL}/accesslogs/clear`);
              
              setLogs([]);
              Alert.alert("Success", "Cleared history");
            } catch (error) {
              console.error("Error when deleting:", error);
              Alert.alert("Error", "Unable to delete logs.");
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  const renderItem = ({ item }: { item: AccessLog }) => {
    const isGranted = item.action === 'granted';
    const statusColor = isGranted ? "#4CAF50" : "#F44336";
    const statusText = isGranted ? "Access granted" : "Intruder Alert";

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Logs</Text>
        <TouchableOpacity onPress={() => handleClearLogs()}>
             <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
            <ActivityIndicator size="large" color="#fff" />
        ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
              }
              ListEmptyComponent={
                  <Text style={{color: 'gray', textAlign: 'center', marginTop: 20}}>No History</Text>
              }
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "#333", marginVertical: 5 }} />
              )}
            />
        )}
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
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
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