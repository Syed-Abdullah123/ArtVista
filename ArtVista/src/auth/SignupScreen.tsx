import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import SignupHeader from "../components/SignupHeader";
import ButtonComponent from "../components/ButtonComponent";
import AlertComponent from "../components/AlertComponent";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    title: "",
    message: "",
    confirmText: "",
  });

  const handleSignup = async () => {
    if (
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      setAlertDetails({
        title: "Incomplete Information",
        message:
          password !== confirmPassword
            ? "Passwords do not match."
            : "Please fill in all required fields before proceeding.",
        confirmText: "OK",
      });
      setAlertVisible(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const userId = userCredential.user.uid; // Get the user ID

      // Save user data to Firestore
      await setDoc(doc(FIREBASE_DB, "users", userId), {
        username: username || "Anonymous",
        email,
        createdAt: new Date().toISOString(),
      });

      setAlertDetails({
        title: "Account Created!",
        message:
          "Your account has been successfully created. You can now log in and start using the app.",
        confirmText: "Go to Login",
      });
      setAlertVisible(true);
      navigation.navigate("Login");
    } catch (error: any) {
      setAlertDetails({
        title: "Error",
        message: error.message,
        confirmText: "OK",
      });
      setAlertVisible(true);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertDetails.title === "Success") {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <AlertComponent
        visible={alertVisible}
        title={alertDetails.title}
        message={alertDetails.message}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleAlertConfirm}
        confirmText={alertDetails.confirmText}
      />
      <SignupHeader
        headerTitle="Sign Up to Create Account"
        subtitle="Fill in all the fields below"
      />
      <View style={styles.inputs}>
        <View style={styles.input}>
          <Feather name="user" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Enter username"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.input}>
          <Feather name="mail" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.input}>
          <Feather name="lock" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.input}>
          <Feather name="lock" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Rewrite Password"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>
      </View>
      <ButtonComponent
        title="Sign Up"
        onPress={handleSignup}
        containerStyle={{ marginTop: "17%" }}
      />
      <View style={styles.accountText}>
        <Text style={styles.text1}>Already have an account?</Text>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ top: 4 }}
        >
          <Text style={styles.text2}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
  },
  inputs: {
    width: "100%",
    gap: 25,
    marginTop: 20,
  },
  input: {
    width: 325,
    height: 57,
    padding: 10,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
  },
  icon: {
    padding: 5,
    marginRight: 10,
  },
  textInput: {
    fontFamily: "Recia_Regular",
    flex: 1,
    color: "#fff",
  },
  accountText: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 3,
  },
  text1: {
    fontFamily: "Recia_Regular",
    color: "#fff",
    marginTop: 10,
  },
  text2: {
    color: "#fff",
    fontFamily: "Recia_Bold",
    textDecorationLine: "underline",
  },
});
