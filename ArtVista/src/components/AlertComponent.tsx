import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AlertComponentProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            {onConfirm && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingVertical: 50,
    elevation: 5,
  },
  title: {
    fontFamily: "Recia_Bold",
    fontSize: 20,
    marginBottom: 10,
    marginTop: 15,
    color: "#333",
  },
  message: {
    fontFamily: "Recia_Regular",
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    top: 20,
    width: "100%",
  },
  closeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#302C28",
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  closeButtonText: {
    fontFamily: "Recia_Regular",
    color: "#302C28",
  },
  confirmButton: {
    backgroundColor: "#302C28",
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Recia_Regular",
    color: "#fff",
  },
});

export default AlertComponent;
