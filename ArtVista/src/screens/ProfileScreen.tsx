import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import dummyArts from "../dummyData/dummyArts"; // Update with your actual path

import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig"; // Adjust your import paths
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [userUploadedArts, setUserUploadedArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;

      if (!currentUser) {
        Alert.alert("Error", "User not logged in!");
        return;
      }

      try {
        // Fetch user details (username, profile image) from 'users' collection
        const userRef = doc(FIREBASE_DB, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData(userData); // Set user data (username, profile image)
        } else {
          setUserData({
            username: "Anonymous",
            profileImage: require("../../assets/images/artvista2.png"),
          });
        }

        // Fetch the artworks uploaded by the user from the 'artworks' collection
        const artworksQuery = query(
          collection(FIREBASE_DB, "artworks"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(artworksQuery);

        const artworks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserUploadedArts(artworks);

        // Optionally, you can calculate stats dynamically here if needed
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []); // Only run once when component mounts

  const handleArtPress = (art: any) => {
    navigation.navigate("ArtDetails", { item: art });
  };

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

  // Default values for stats if no data available yet
  const totalLikes = userUploadedArts.reduce((sum, art) => sum + art.likes, 0);
  const totalComments = userUploadedArts.reduce(
    (sum, art) => sum + (art.commentsArray?.length || 0),
    0
  );
  const totalUploads = userUploadedArts.length;

  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={styles.profileSection}>
        <Image
          source={
            userData.imageUrl || require("../../assets/images/artvista2.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData.username}</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Feather name="edit-3" size={20} color="#fff" />
          <Text style={styles.editProfileText}>Edit the profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Total Likes</Text>
          <Text style={styles.statText}>{totalLikes || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Comments</Text>
          <Text style={styles.statText}>{totalComments || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Uploads</Text>
          <Text style={styles.statText}>{totalUploads || 0}</Text>
        </View>
      </View>

      {/* Uploaded Arts */}
      <Text style={styles.sectionTitle}>Your Artworks</Text>
      {userUploadedArts.length === 0 ? (
        <Text style={styles.noArtText}>
          You haven't uploaded any artworks yet!
        </Text>
      ) : (
        <FlatList
          data={userUploadedArts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.artworksList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.artCard}
              onPress={() => handleArtPress(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.artImage} />
              <View style={styles.artDetails}>
                <Text style={styles.artTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.artInfo}>
                  {item.medium} • {item.date}
                </Text>
                <Text style={styles.artInfo}>
                  Likes: {item.likes} • Comments: {item.comments}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#ccc",
  },
  username: {
    fontFamily: "Recia_Bold",
    fontSize: 24,
    color: "#FFF",
    marginBottom: 10,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 5,
  },
  editProfileText: {
    color: "#FFF",
    fontFamily: "Recia_Bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Recia_Regular",
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  statText: {
    fontFamily: "Recia_Bold",
    color: "#FFF",
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    fontFamily: "Recia_Bold",
    fontSize: 20,
    color: "#FFF",
    marginBottom: 10,
  },
  noArtText: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#ccc",
    marginBottom: 10,
  },
  artworksList: {
    paddingBottom: 20,
  },
  artCard: {
    flexDirection: "row",
    backgroundColor: "#403C37",
    marginBottom: 15,
    borderRadius: 3,
    overflow: "hidden",
    elevation: 3,
  },
  artImage: {
    width: 100,
    height: 100,
  },
  artDetails: {
    flex: 1,
    padding: 10,
  },
  artTitle: {
    fontSize: 16,
    fontFamily: "Recia_Bold",
    color: "#FFF",
    marginBottom: 5,
  },
  artInfo: {
    fontSize: 12,
    color: "#CCC",
    marginBottom: 5,
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
