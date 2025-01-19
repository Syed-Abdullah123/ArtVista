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

type ButtonProps = {
  title: string;
  onPress: (
    event: GestureResponderEvent,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  containerStyle,
  buttonStyle,
  textStyle,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = (event: GestureResponderEvent) => {
    if (!loading) {
      setLoading(true);
      onPress(event, setLoading); // Pass `setLoading` to manage the async state
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.outerContainer,
        containerStyle,
        loading && styles.disabledContainer,
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      <View style={[styles.container, buttonStyle]}>
        {!loading ? (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        ) : (
          <ActivityIndicator size="small" color="#302C28" />
        )}
      </View>
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
  disabledContainer: {
    backgroundColor: "#555",
  },
});

export default ButtonComponent;
