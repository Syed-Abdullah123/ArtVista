import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ArtworkDetailsScreen = ({ route }: any) => {
  const { item } = route.params;

  // State for likes and comments
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(item.commentsArray || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Track user authentication state
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    // Check if the user has already liked this artwork
    const hasLiked = item.likesArray?.includes(user?.uid);
    setIsLiked(hasLiked);
  }, [item.likesArray, user]);

  // Toggle like status
  const toggleLike = async () => {
    const auth = getAuth(); // Get the current authenticated user
    const user = auth.currentUser;

    if (user) {
      try {
        const artworkRef = doc(FIREBASE_DB, "artworks", item.id); // Referencing artwork document
        const artworkDoc = await getDoc(artworkRef); // Get current artwork document
        if (artworkDoc.exists()) {
          const artworkData = artworkDoc.data();
          const likesArray = artworkData?.likesArray || [];
          const currentLikes = artworkData?.likes || 0;

          // Check if the user has already liked the artwork
          const userLiked = likesArray.includes(user.uid);

          // Update Firestore with the toggled like state
          await updateDoc(artworkRef, {
            likes: userLiked ? currentLikes - 1 : currentLikes + 1,
            likesArray: userLiked
              ? arrayRemove(user.uid)
              : arrayUnion(user.uid),
          });

          // Update local state
          setLikes(userLiked ? likes - 1 : likes + 1);
          setIsLiked(!userLiked);
        }
      } catch (error) {
        console.error("Error updating like:", error);
      }
    }
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const artworkRef = doc(FIREBASE_DB, "artworks", item.id);
          const artworkDoc = await getDoc(artworkRef);

          if (artworkDoc.exists()) {
            const artworkData = artworkDoc.data();
            const likesArray = artworkData?.likesArray || [];
            const userLiked = likesArray.includes(user.uid);

            setLikes(artworkData?.likes || 0); // Set initial likes count
            setIsLiked(userLiked); // Set the like status
          }
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    };

    fetchLikeStatus();
  }, [item.id]); // Refetch when the artwork ID changes

  // Add a new comment
  const addComment = async () => {
    if (newComment.trim().length > 0) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          // Fetch user data from Firestore
          const userRef = doc(FIREBASE_DB, "users", user.uid);
          const userSnap = await getDoc(userRef);

          const userData = userSnap.exists()
            ? userSnap.data()
            : { username: "Anonymous", userImage: null };

          const artworkRef = doc(FIREBASE_DB, "artworks", item.id);
          const newCommentData = {
            userId: user.uid,
            username: userData.username, // Fetched username
            userImage: userData.userImage || null, // Fetched user image
            text: newComment.trim(),
            timestamp: new Date(),
          };

          await updateDoc(artworkRef, {
            commentsArray: arrayUnion(newCommentData),
          });

          setComments((prev: any) => [...prev, newCommentData]);
          setNewComment("");
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Artwork Image */}
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Image
            source={{ uri: item.imageUrl }} // Replace with item.image if dynamic
            style={styles.artImage}
          />
        </View>
      </View>

      {/* Artwork Title and Author */}
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.header}>
        <Image
          source={
            item.authorImage
              ? { uri: item.authorImage }
              : require("../../assets/images/artvista2.png") // Fallback for missing author image
          }
          style={styles.userImage}
        />
        <Text style={styles.author}>
          {item.author} . {item.date}
        </Text>
      </View>

      {/* Artwork Interactions */}
      <View style={styles.interactions}>
        <TouchableOpacity style={styles.interaction} onPress={toggleLike}>
          <FontAwesome
            name={isLiked ? "thumbs-up" : "thumbs-o-up"}
            size={22}
            color={isLiked ? "green" : "#fff"}
          />
          <Text style={styles.interactionText}>{likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.interaction}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome name="commenting-o" size={22} color="#fff" />
          <Text style={styles.interactionText}>{comments.length} Comments</Text>
        </TouchableOpacity>
      </View>

      {/* Artwork Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Comments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Comments</Text>
        {comments.length === 0 ? (
          // Check if there are no comments
          <Text style={styles.noCommentsText}>
            No comments yet. Be the first to comment!
          </Text>
        ) : (
          comments.slice(-3).map((comment: any, index: number) => (
            <View key={comment.id || index} style={styles.commentSection}>
              <View style={styles.userInfo}>
                <Image
                  source={
                    item.authorImage
                      ? { uri: item.authorImage }
                      : require("../../assets/images/artvista2.png")
                  }
                  style={styles.userImage}
                />
                <Text style={styles.commentAuthor}>
                  {comment.username || "anonymous"}
                </Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))
        )}
        {comments.length > 3 && (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.viewAllComments}>View all comments</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for Viewing All Comments */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.line}></View>
            <Text style={styles.modalTitle}>All Comments</Text>
            <FlatList
              data={comments}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentSection}>
                  <View style={styles.userInfo}>
                    <Image
                      source={require("../../assets/images/artvista2.png")}
                      style={styles.userImage}
                    />
                    <Text style={styles.commentAuthor}>
                      {item.username || "anonymous"}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />
            <View style={styles.newCommentSection}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                placeholderTextColor="#fff"
                multiline
              />
              <TouchableOpacity
                style={styles.commentButton}
                onPress={addComment}
              >
                <Text style={styles.commentButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Additional Details */}
      <View style={[styles.section, { marginTop: 10 }]}>
        <Text style={styles.sectionTitle}>Additional Details</Text>
        <Text style={styles.details}>
          Medium: <Text style={styles.detailsText}>{item.medium}</Text>
        </Text>
        <Text style={styles.details}>
          Dimensions: <Text style={styles.detailsText}>{item.dimensions}</Text>
        </Text>
        <Text style={styles.details}>
          Date: <Text style={styles.detailsText}>{item.date}</Text>
        </Text>
        <Text style={styles.details}>
          Location: <Text style={styles.detailsText}>{item.location}</Text>
        </Text>
      </View>

      {/* Hashtags section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hashtags</Text>
        <View style={styles.hashtagsContainer}>
          <Text style={styles.hashtag}>{item.hashtags}</Text>
        </View>
      </View>

      {/* Extra section */}
      <View style={styles.extra}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingHorizontal: 20,
  },
  outerContainer: {
    borderWidth: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "#fff",
    margin: 10,
  },
  innerContainer: {
    borderWidth: 1,
    width: "100%",
    padding: 7,
    bottom: 6,
    right: 6,
    backgroundColor: "white",
  },
  artImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  title: {
    fontFamily: "Erode_Bold",
    fontSize: 24,
    color: "#fff",
  },
  author: {
    fontFamily: "Recia_Medium",
    fontSize: 12,
    color: "#ccc",
  },
  interactions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  interaction: {
    alignItems: "center",
  },
  interactionText: {
    fontFamily: "Recia_Medium",
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: "Erode_Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 15,
  },
  noCommentsText: {
    fontFamily: "Recia_Medium",
    fontStyle: "italic",
    fontSize: 14,
    color: "#ccc",
    marginBottom: 15,
  },
  description: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  commentText: {
    fontFamily: "Recia_Regular",
    color: "#fff",
    marginBottom: 20,
  },
  viewAllComments: {
    fontFamily: "Recia_Regular",
    color: "#bbb",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#302C28",
    padding: 16,
  },
  line: {
    width: 35,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
    borderRadius: 10,
  },
  modalTitle: {
    fontFamily: "Erode_Bold",
    fontSize: 20,
    color: "#fff",
    marginBottom: 15,
  },
  commentSection: {
    gap: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  commentAuthor: {
    fontFamily: "Recia_Bold",
    fontSize: 14,
    color: "#fff",
  },
  newCommentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    fontFamily: "Recia_Regular",
    backgroundColor: "#444",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  commentButton: {
    // backgroundColor: "#555",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  commentButtonText: {
    fontFamily: "Recia_Bold",
    color: "#fff",
  },
  closeButton: {
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    fontFamily: "Recia_Regular",
    color: "#bbb",
  },
  details: {
    fontFamily: "Recia_Medium",
    fontSize: 14,
    color: "#ccc",
    marginVertical: 5,
  },
  detailsText: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#ccc",
  },
  extra: {
    width: "100%",
    height: 50,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  hashtag: {
    fontFamily: "Recia_Medium",
    fontSize: 14,
    color: "#ccc",
  },
});

export default ArtworkDetailsScreen;
