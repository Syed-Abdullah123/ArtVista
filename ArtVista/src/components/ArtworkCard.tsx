import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";

const ArtworkCard = ({ navigation, item }: any) => {
  return (
    <Pressable
      style={styles.outerContainer}
      onPress={() => navigation.navigate("ArtDetails", { item })}
    >
      <View style={styles.innerContainer}>
        {/* Artwork Image */}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          defaultSource={require("../../assets/images/artvista2.png")} // Optional placeholder
        />

        <View style={styles.userInfo}>
          {/* Author Image */}
          <Image
            style={styles.userImage}
            source={
              item.authorImage
                ? { uri: item.authorImage }
                : require("../../assets/images/artvista2.png") // Fallback for missing author image
            }
          />
          <View style={{ flex: 1 }}>
            {/* Title and Author Name */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.username}>{item.author}</Text>

            {/* User Interactions Section */}
            <View style={styles.interactions}>
              <View style={styles.interaction}>
                <Feather name="thumbs-up" size={18} color="#302C28" />
                <Text style={styles.interactionText}>
                  {item.likes || 0} {/* Default to 0 if missing */}
                </Text>
              </View>
              <View style={styles.interaction}>
                <FontAwesome name="commenting-o" size={18} color="#302C28" />
                <Text style={styles.interactionText}>
                  {item.comments || 0} {/* Default to 0 if missing */}
                </Text>
              </View>
              <View style={styles.interaction}>
                <Ionicons name="share-outline" size={18} color="#302C28" />
                <Text style={styles.interactionText}>
                  {item.shares || 0} {/* Default to 0 if missing */}
                </Text>
              </View>
            </View>

            {/* Description Section */}
            <View style={styles.description}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    gap: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  title: {
    fontFamily: "Recia_Bold",
    fontSize: 16,
    color: "#302C28",
  },
  username: {
    fontFamily: "Recia_Regular",
    fontSize: 12,
    color: "#302C28",
  },
  interactions: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  interaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  interactionText: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#302C28",
  },
  description: {
    marginTop: 5,
  },
  descriptionText: {
    fontFamily: "Recia_Regular",
    fontSize: 14,
    color: "#302C28",
  },
});

export default ArtworkCard;
