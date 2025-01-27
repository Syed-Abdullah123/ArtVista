import React from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import StackNavigator from "./src/navigation/StackNavigator";
import { ArtProvider } from "./src/contexts/ArtContext";

export default function App() {
  const [loaded] = useFonts({
    Recia_Bold: require("./assets/fonts/Recia-Bold.otf"),
    Recia_Medium: require("./assets/fonts/Recia-Medium.otf"),
    Recia_Regular: require("./assets/fonts/Recia-Regular.otf"),
    Erode_Bold: require("./assets/fonts/Erode-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ArtProvider>
      <StackNavigator />
      <StatusBar style="light" backgroundColor="#302C28" />
    </ArtProvider>
  );
}
