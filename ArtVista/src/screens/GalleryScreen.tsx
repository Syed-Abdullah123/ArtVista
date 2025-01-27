import React, { useState, useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ArtworkCard from "../components/ArtworkCard";

import { collection, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import { useArt } from "../contexts/ArtContext";

export default function GalleryScreen({ navigation }: any) {
  const { arts, loading } = useArt();
  // const [arts, setArts] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up listener when component unmounts
  }, []);

  if (loading) {
    return (
      <>
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {arts.length === 0 ? (
        // Fallback UI when no arts are available
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No artworks added yet. Tap the "+" button to upload your first
            artwork!
          </Text>
        </View>
      ) : (
        // Display the list of arts when available
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {arts.map((item) => (
            <ArtworkCard item={item} key={item.id} navigation={navigation} />
          ))}
        </ScrollView>
        // <FlatList
        //   data={arts}
        //   keyExtractor={(item) => item.id}
        //   renderItem={({ item }) => (
        //     <ArtworkCard item={item} navigation={navigation} />
        //   )}
        //   showsVerticalScrollIndicator={false}
        //   contentContainerStyle={styles.container}
        // />
      )}
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("UploadArt")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#302C28",
  },
  emptyText: {
    fontFamily: "Recia_Regular",
    fontSize: 20,
    color: "#FFF",
  },
  fab: {
    position: "absolute", // Ensures it floats above content
    bottom: 20,
    right: 20,
    backgroundColor: "#302C28", // Eye-catching color
    width: 60,
    height: 60,
    borderRadius: 30, // Perfect circle
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5, // For Android shadow
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#302C28",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Recia_Bold",
    fontSize: 20,
    color: "#FFF",
  },
});
