import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Pressable,
} from "react-native";

// Dummy data for liked artworks
const DUMMY_ARTWORKS = [
  {
    id: "1",
    title: "Mountains in Background",
    medium: "Brush Paint",
    date: "18 January 2025",
    author: "Anonymous",
    location: "Palestine",
    imageUrl: require("../../assets/images/art2.jpg"), // Replace with your asset image path
  },
  {
    id: "2",
    title: "Sunset Over Mountains",
    medium: "Oil on Canvas",
    date: "12 March 2024",
    author: "John Doe",
    location: "Switzerland",
    imageUrl: require("../../assets/images/art3.jpg"), // Replace with your asset image path
  },
  {
    id: "3",
    title: "Abstract Chaos",
    medium: "Acrylic",
    date: "25 July 2023",
    author: "Jane Smith",
    location: "New York",
    imageUrl: require("../../assets/images/art4.jpg"), // Replace with your asset image path
  },
];

export default function LikeScreen({ navigation }) {
  const handleArtPress = (art) => {
    ToastAndroid.show(`Selected: ${art.title}`, ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>Liked Artworks</Text> */}

      <FlatList
        data={DUMMY_ARTWORKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.outerContainer}
            onPress={() => handleArtPress(item)}
          >
            <View style={styles.innerContainer}>
              <ImageBackground source={item.imageUrl} style={styles.artImage}>
                <View style={styles.overlay}>
                  <Text style={styles.artTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.artInfo}>
                    {item.medium} • {item.date}
                  </Text>
                  <Text style={styles.artInfo}>By: {item.author}</Text>
                </View>
              </ImageBackground>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#302C28",
  },
  headerText: {
    fontFamily: "Erode_Bold",
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  outerContainer: {
    borderWidth: 1,
    width: "98%",
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "#fff",
    margin: 10,
    borderRadius: 3,
  },
  innerContainer: {
    borderWidth: 1,
    width: "100%",
    padding: 7,
    bottom: 6,
    right: 6,
    backgroundColor: "white",
    borderRadius: 3,
  },
  artImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  artTitle: {
    fontFamily: "Recia_Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  artInfo: {
    fontFamily: "Recia_Regular",
    fontSize: 13,
    color: "#ccc",
  },
});
