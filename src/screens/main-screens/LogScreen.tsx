import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import axios from "axios";
import { API_URL } from "../../constants/Config";
import LogItem, { AccessLog } from "../../components/LogItem";

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
        {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
        ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <LogItem item={item} />}
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
});