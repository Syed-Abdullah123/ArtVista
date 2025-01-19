import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import SignupHeader from "../components/SignupHeader";
import ButtonComponent from "../components/ButtonComponent";
import AlertComponent from "../components/AlertComponent";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    title: "",
    message: "",
    confirmText: "OK",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertDetails({
        title: "Incomplete Information",
        message:
          "Both fields are required. Please fill in your email and password.",
        confirmText: "OK",
      });
      setAlertVisible(true);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      // setAlertDetails({
      //   title: "Welcome!",
      //   message: "You have logged in successfully.",
      //   confirmText: "Go to Home",
      // });
      // setAlertVisible(true);
      // Navigate after closing alert
      // setTimeout(() => {
      // setAlertVisible(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        })
      );
      // }, 2000); // Delayed navigation
    } catch (error: any) {
      setAlertDetails({
        title: "Login Failed",
        message: error.message || "Something went wrong. Please try again.",
        confirmText: "Retry",
      });
      setAlertVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <SignupHeader
        headerTitle="Sign In to Your Account"
        subtitle="Fill in all the fields below"
      /> */}
      <Text style={styles.title}>Sign In to Your Account</Text>
      <Text style={styles.subtitle}>Fill in all the fields below</Text>
      <View style={styles.inputs}>
        <View style={styles.input}>
          <Feather name="mail" size={18} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#aaa"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.input}>
          <Feather name="lock" size={18} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
      </View>
      <ButtonComponent
        title="Sign In"
        onPress={handleLogin}
        // onPress={() => navigation.navigate("Tabs")}
        containerStyle={{ marginTop: "17%" }}
      />
      <View style={styles.accountText}>
        <Text style={styles.text1}>Don't have an account?</Text>
        <Pressable
          onPress={() => navigation.navigate("Signup")}
          style={{ top: 4 }}
        >
          <Text style={styles.text2}>Sign Up</Text>
        </Pressable>
      </View>

      {/* Alert Component */}
      {alertVisible && (
        <AlertComponent
          title={alertDetails.title}
          message={alertDetails.message}
          confirmText={alertDetails.confirmText}
          onConfirm={() => setAlertVisible(false)}
          onClose={() => setAlertVisible(false)}
          visible={alertVisible}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302C28",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontFamily: "Erode_Bold",
    fontSize: 32,
    color: "#fff",
    marginTop: 30,
  },
  subtitle: {
    fontFamily: "Recia_Regular",
    fontSize: 16,
    color: "#ccc",
    marginVertical: 10,
  },
  inputs: {
    width: "100%",
    gap: 25,
    marginTop: "20%",
  },
  input: {
    width: "100%",
    height: 57,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: "Recia_Regular",
    color: "#fff",
    fontSize: 15,
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
