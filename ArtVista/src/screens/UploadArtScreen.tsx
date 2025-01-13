import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Title:</Text>
        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Author:</Text>
        <TextInput
          style={styles.textInput}
          value={author}
          onChangeText={setAuthor}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Description:</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Medium (e.g., Oil on Canvas):</Text>
        <TextInput
          style={styles.textInput}
          value={medium}
          onChangeText={setMedium}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Dimensions (e.g., 24 x 36 inches):
        </Text>
        <TextInput
          style={styles.textInput}
          value={dimensions}
          onChangeText={setDimensions}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Date:</Text>
        <TextInput
          style={styles.textInput}
          value={date}
          onChangeText={setDate}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Location (e.g., ArtVista Gallery, NY):
        </Text>
        <TextInput
          style={styles.textInput}
          value={location}
          onChangeText={setLocation}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Hashtags (e.g., #art #painting #canvas):
        </Text>
        <TextInput
          style={styles.textInput}
          value={hashtags}
          onChangeText={setHashtags}
          multiline
        />
      </View>

      <ButtonComponent title="Submit" onPress={handleSubmit} />
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
    fontFamily: "Recia_Regular",
    width: "100%",
    padding: 10,
    marginBottom: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#0066CC",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UploadArtScreen;
