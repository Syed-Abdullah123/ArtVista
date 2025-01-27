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
  ActivityIndicator,
} from "react-native";
import { useArt } from "../contexts/ArtContext";

export default function LikeScreen({ navigation }) {
  const { arts, isLiked, loading } = useArt();

  const handleArtPress = (art) => {
    navigation.navigate("ArtDetails", { item: art });
  };

  // Filter only the liked artworks
  const likedArts = arts.filter((art) => isLiked(art.id));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (likedArts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No liked artworks yet!</Text>
      </View>
    );
  }

  const renderArtwork = ({ item }) => (
    <Pressable
      style={styles.outerContainer}
      onPress={() => handleArtPress(item)}
    >
      <View style={styles.innerContainer}>
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.artImage}
        >
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={likedArts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderArtwork}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#302C28",
  },
  loadingText: {
    fontFamily: "Recia_Regular",
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#302C28",
  },
  emptyText: {
    fontFamily: "Recia_Regular",
    fontSize: 18,
  },
});
