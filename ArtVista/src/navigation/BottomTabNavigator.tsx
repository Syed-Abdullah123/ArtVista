import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GalleryScreen from "../screens/GalleryScreen";
import LikeScreen from "../screens/LikeScreen";
import ProfileScreen from "../screens/ProfileScreen";

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Gallery")
            iconName = focused ? "image" : "image-outline";
          else if (route.name === "Likes")
            iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: { fontFamily: "Recia_Medium" },
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "#808080",
      })}
    >
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          headerStyle: { backgroundColor: "#302C28" },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Erode_Bold",
            fontSize: 22,
            color: "#fff",
          },
          headerRight: () => (
            <Ionicons
              name="search" // Search icon
              size={24}
              color="#fff" // White color to match the header theme
              style={{ marginRight: 16 }} // Spacing from the edge
              onPress={() => console.log("Search pressed")} // Add your onPress logic here
            />
          ),
        }}
      />
      <Tab.Screen
        name="Likes"
        component={LikeScreen}
        options={{
          headerStyle: { backgroundColor: "#302C28" },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Erode_Bold",
            fontSize: 22,
            color: "#fff",
          },
          headerTintColor: "#fff",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: { backgroundColor: "#302C28" },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Erode_Bold",
            fontSize: 22,
            color: "#fff",
          },
          headerTintColor: "#fff",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#302C28",
    height: 60, // Adjusted height for alignment
    borderTopWidth: 1,
    borderTopColor: "#fff",
    paddingBottom: 5, // Ensure equal vertical padding
    paddingTop: 5,
  },
});

export default BottomTabNavigator;
