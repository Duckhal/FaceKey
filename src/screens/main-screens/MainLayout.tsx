import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

import HomeScreen from "./HomeScreen";
import MemberScreen from "./MemberScreen";
import LogScreen from "./LogScreen";
import ProfileScreen from "./ProfileScreen";

type MainTabParamList = {
  Home: undefined,
  Member: undefined,
  Log: undefined,
  Profile: undefined,
}

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainLayout = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "home";

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Member") {
              iconName = focused ? "happy" : "happy-outline";
            } else if (route.name === "Log") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Member" component={MemberScreen} />
        <Tab.Screen name="Log" component={LogScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
};

export default MainLayout;
