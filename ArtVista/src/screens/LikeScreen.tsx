import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { doc, getDocs, query, collection, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig"; // Adjust the path as per your project
import { getAuth } from "firebase/auth";

export default function LikeScreen() {
  const [likedArts, setLikedArts] = useState([]);
  const [filteredArts, setFilteredArts] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      fetchLikedArts();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedHashtag) {
      setFilteredArts(
        likedArts.filter(
          (art) => art.hashtags && art.hashtags.includes(selectedHashtag)
        )
      );
    } else {
      setFilteredArts(likedArts);
    }
  }, [selectedHashtag, likedArts]);

  const fetchLikedArts = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(FIREBASE_DB, "artworks"),
        where("likesArray", "array-contains", userId)
      );
      const querySnapshot = await getDocs(q);

      const arts = [];
      const tags = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const artWithId = {
          id: doc.id,
          ...data,
          hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        };
        arts.push(artWithId);

        // Safely add hashtags
        if (Array.isArray(artWithId.hashtags)) {
          artWithId.hashtags.forEach((tag) => tags.add(tag));
        }
      });

      setLikedArts(arts);
      setHashtags([...tags]);
      setError(null);
    } catch (error) {
      console.error("Error fetching liked arts:", error);
      setError("Failed to load liked arts");
    } finally {
      setLoading(false);
    }
  };

  const renderArtCard = ({ item }) => (
    <TouchableOpacity style={styles.artCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.artImage} />
      <Text style={styles.artTitle}>{item.title}</Text>
      <Text style={styles.artLikes}>{item.likes} Likes</Text>
      <View style={styles.tagContainer}>
        {item.hashtags &&
          item.hashtags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
      </View>
    </TouchableOpacity>
  );

  const renderHashtagFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.hashtagScroll}
    >
      <TouchableOpacity
        onPress={() => setSelectedHashtag(null)}
        style={[styles.hashtagButton, !selectedHashtag && styles.activeHashtag]}
      >
        <Text
          style={[
            styles.hashtagText,
            !selectedHashtag && styles.activeHashtagText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      {hashtags.map((tag, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedHashtag(tag)}
          style={[
            styles.hashtagButton,
            selectedHashtag === tag && styles.activeHashtag,
          ]}
        >
          <Text
            style={[
              styles.hashtagText,
              selectedHashtag === tag && styles.activeHashtagText,
            ]}
          >
            #{tag}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {renderHashtagFilter()}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArts}
          renderItem={renderArtCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Recia_Bold",
    fontSize: 20,
    color: "#FFF",
    marginTop: 10,
  },
  hashtagScroll: {
    marginBottom: 15,
  },
  hashtagButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#555",
    marginHorizontal: 5,
  },
  activeHashtag: {
    backgroundColor: "#555",
  },
  hashtagText: {
    fontFamily: "Recia_Medium",
    fontSize: 16,
    color: "#fff",
  },
  activeHashtagText: {
    fontFamily: "Recia_Medium",
    fontSize: 16,
    color: "#fff",
  },
  gridContainer: {
    paddingBottom: 20,
  },
  artCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#444",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  artImage: {
    width: "100%",
    height: 150,
  },
  artTitle: {
    fontFamily: "Recia_Bold",
    fontSize: 18,
    color: "#fff",
    padding: 10,
  },
  artLikes: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#bbb",
    paddingHorizontal: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tag: {
    fontSize: 12,
    color: "green",
    marginRight: 8,
  },
});
