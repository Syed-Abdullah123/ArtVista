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
  ActivityIndicator,
  LogBox,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useArt } from "../contexts/ArtContext";

const ArtworkDetailsScreen = ({ route }: any) => {
  const { item } = route.params;
  const {
    arts,
    toggleLike,
    addComment,
    isLiked: getIsLiked,
    getComments,
    isLikeLoading,
    isCommentLoading,
  } = useArt();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Get the latest art data from context
  const currentArtwork = arts.find((art) => art.id === item.id) || item;

  // Get current values from context
  const liked = getIsLiked(currentArtwork.id);
  const comments = getComments(currentArtwork.id);
  const isLikeLoadingForThis = isLikeLoading[currentArtwork.id];
  const isCommentLoadingForThis = isCommentLoading[currentArtwork.id];

  const handleLike = () => {
    toggleLike(currentArtwork.id);
  };

  const handleAddComment = async () => {
    if (newComment.trim().length > 0) {
      await addComment(currentArtwork.id, newComment);
      setNewComment(""); // Clear input only after successful post
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Artwork Image */}
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Image
            source={{ uri: currentArtwork.imageUrl }} // Replace with item.image if dynamic
            style={styles.artImage}
          />
        </View>
      </View>

      {/* Artwork Title and Author */}
      <Text style={styles.title}>{currentArtwork.title}</Text>
      <View style={styles.header}>
        <Image
          source={
            currentArtwork.authorImage
              ? { uri: currentArtwork.authorImage }
              : require("../../assets/images/artvista2.png")
          }
          style={styles.userImage}
        />
        <Text style={styles.author}>
          {currentArtwork.author} . {currentArtwork.date}
        </Text>
      </View>

      {/* Artwork Interactions */}
      <View style={styles.interactions}>
        <TouchableOpacity
          style={styles.interaction}
          onPress={handleLike}
          disabled={isLikeLoadingForThis}
        >
          {isLikeLoadingForThis ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome
                name={liked ? "thumbs-up" : "thumbs-o-up"}
                size={22}
                color={liked ? "green" : "#fff"}
              />
              <Text style={styles.interactionText}>
                {currentArtwork.likes} Likes
              </Text>
            </>
          )}
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
        <Text style={styles.description}>{currentArtwork.description}</Text>
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
            <View key={`recent-comment-${index}`} style={styles.commentSection}>
              <View style={styles.userInfo}>
                <Image
                  source={
                    currentArtwork.authorImage
                      ? { uri: currentArtwork.authorImage }
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
              keyExtractor={(item, index) => `modal-${index}-${item.timestamp}`}
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
              showsVerticalScrollIndicator={false}
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
                style={[
                  styles.commentButton,
                  isCommentLoadingForThis && styles.commentButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={isCommentLoadingForThis || !newComment.trim()}
              >
                {isCommentLoadingForThis ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.commentButtonText}>Post</Text>
                )}
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
          Medium:{" "}
          <Text style={styles.detailsText}>{currentArtwork.medium}</Text>
        </Text>
        <Text style={styles.details}>
          Dimensions:{" "}
          <Text style={styles.detailsText}>{currentArtwork.dimensions}</Text>
        </Text>
        <Text style={styles.details}>
          Date: <Text style={styles.detailsText}>{currentArtwork.date}</Text>
        </Text>
        <Text style={styles.details}>
          Location:{" "}
          <Text style={styles.detailsText}>{currentArtwork.location}</Text>
        </Text>
      </View>

      {/* Hashtags section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hashtags</Text>
        <View style={styles.hashtagsContainer}>
          <Text style={styles.hashtag}>{currentArtwork.hashtags}</Text>
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
  commentButtonDisabled: {
    opacity: 1,
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
