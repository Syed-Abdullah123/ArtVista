import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import ButtonComponent from "../components/ButtonComponent";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UploadArtScreen = ({ navigation, route }: any) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Function to pick an image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated to use MediaType
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Ensure to handle 'assets' array correctly
      }
    } catch (error) {
      console.error("Error picking an image:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (
      !title ||
      !author ||
      !description ||
      !medium ||
      !dimensions ||
      !date ||
      !location ||
      !hashtags ||
      !image
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const currentUser = FIREBASE_AUTH.currentUser;

    if (!currentUser) {
      Alert.alert("Error", "User not logged in!");
      return;
    }

    try {
      const artworkId = `${currentUser.uid}_${Date.now()}`;
      const newArt = {
        title,
        author,
        description,
        medium,
        dimensions,
        date,
        location,
        hashtags,
        imageUrl: image, // Upload image to storage and use the URL
        userId: currentUser.uid,
      };

      await setDoc(doc(FIREBASE_DB, "artworks", artworkId), newArt);

      Alert.alert("Success", "Artwork uploaded successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Could not upload artwork. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.outerContainer} onPress={pickImage}>
        {image ? (
          <View style={styles.innerContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Ionicons name="camera" size={42} color="#302C28" />
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Title:</Text>
        <View style={styles.textInput}>
          <MaterialIcons name="title" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Author:</Text>
        <View style={styles.textInput}>
          <MaterialIcons name="account-circle" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Description:</Text>
        <View style={styles.textInput}>
          <MaterialIcons name="subtitles" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Medium (e.g., Oil on Canvas):</Text>
        <View style={styles.textInput}>
          <MaterialIcons name="format-paint" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={medium}
            onChangeText={setMedium}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Dimensions (e.g., 24 x 36 inches):
        </Text>
        <View style={styles.textInput}>
          <MaterialIcons name="area-chart" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={dimensions}
            onChangeText={setDimensions}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Date:</Text>
        <View style={styles.textInput}>
          <MaterialIcons name="calendar-month" size={20} color="#aaa" />
          <TextInput style={styles.input} value={date} onChangeText={setDate} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Location (e.g., ArtVista Gallery, NY):
        </Text>
        <View style={styles.textInput}>
          <MaterialIcons name="location-on" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Hashtags (e.g., #art #painting #canvas):
        </Text>
        <View style={styles.textInput}>
          <Feather name="hash" size={20} color="#aaa" />
          <TextInput
            style={styles.input}
            value={hashtags}
            onChangeText={setHashtags}
            multiline
          />
        </View>
      </View>

      <ButtonComponent title={"Upload Artwork"} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#302C28",
    padding: 20,
    alignItems: "center",
  },
  outerContainer: {
    borderWidth: 1,
    width: "100%",
    height: 230,
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "#fff",
    margin: 10,
  },
  innerContainer: {
    borderWidth: 1,
    width: "100%",
    height: 230,
    padding: 7,
    bottom: 6,
    right: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    fontFamily: "Recia_Medium",
    color: "#302C28",
    fontSize: 16,
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    width: "100%",
    gap: 5,
  },
  inputTitle: {
    fontFamily: "Recia_Regular",
    color: "#fff",
    fontSize: 16,
  },
  textInput: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "Recia_Regular",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default UploadArtScreen;
