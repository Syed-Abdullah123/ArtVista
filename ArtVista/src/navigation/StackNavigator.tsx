import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../auth/WelcomeScreen";
import SignupScreen from "../auth/SignupScreen";
import LoginScreen from "../auth/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import ArtworkDetailsScreen from "../screens/ArtworkDetailsScreen";
import UploadArtScreen from "../screens/UploadArtScreen";

export default function StackNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ArtDetails"
          component={ArtworkDetailsScreen}
          options={{
            headerStyle: { backgroundColor: "#302C28" },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Erode_Bold",
              fontSize: 22,
              color: "#fff",
            },
            headerTintColor: "#fff",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="UploadArt"
          component={UploadArtScreen}
          options={{
            headerStyle: { backgroundColor: "#302C28" },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Erode_Bold",
              fontSize: 22,
              color: "#fff",
            },
            headerTintColor: "#fff",
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
