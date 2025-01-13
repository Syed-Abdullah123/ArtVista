import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
  TextStyle,
  ActivityIndicator,
} from "react-native";

type ButonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};
const ButtonComponent: React.FC<ButonProps> = ({
  title,
  onPress,
  containerStyle,
  buttonStyle,
  textStyle,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.outerContainer, containerStyle]}
      onPress={onPress}
    >
      {/* {!loading ? (
        <View style={[styles.container, buttonStyle]}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      ) : (
        <ActivityIndicator size="small" color="#fff" />
      )} */}
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={[styles.container, buttonStyle]}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
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
  container: {
    borderWidth: 1,
    padding: 15,
    width: "100%",
    alignSelf: "center",
    bottom: 6,
    right: 6,
    backgroundColor: "white",
  },
  buttonText: {
    color: "#302C28",
    fontFamily: "Recia_Bold",
    fontSize: 20,
    textAlign: "center",
  },
});

export default ButtonComponent;
