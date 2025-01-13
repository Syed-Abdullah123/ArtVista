import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ButtonComponent from "../components/ButtonComponent";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/artvista2.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/images/welcome-illustration.png")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <View style={styles.midContainer}>
        <View>
          <Text style={styles.title}>
            Discover Amazing Art around the world
          </Text>
          <Text style={styles.subtitle}>
            Feel the experience of seeing art from around the world in the palm
            of your hand without having to come directly to the museum.
          </Text>
        </View>

        <ButtonComponent
          title="Get Started"
          onPress={() => navigation.navigate("Signup")}
        ></ButtonComponent>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#302C28",
    paddingVertical: 40,
  },
  image: {
    width: "100%", // Adjust based on design
    height: "20%",
  },
  illustration: {
    width: "80%", // Adjust based on design
    height: "40%",
  },
  midContainer: {
    rowGap: 20,
  },
  title: {
    fontFamily: "Erode_Bold",
    fontSize: 24,
    color: "#fff",
    marginTop: 20,
  },
  subtitle: {
    fontFamily: "Recia_Regular",
    fontSize: 16,
    color: "#ccc",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: "#272727",
    fontSize: 18,
    fontWeight: "bold",
  },
});
