import React from "react";
import { StyleSheet, Text, View } from "react-native";

type headerProps = {
  headerTitle: string;
  subtitle: string;
};

const SignupHeader: React.FC<headerProps> = ({ headerTitle, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{headerTitle}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "30%",
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
});

export default SignupHeader;
