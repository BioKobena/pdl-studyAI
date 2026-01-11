import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { storage } from "@/api/storage/token";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  variant?: "icon" | "button"; // icon = petit bouton icône, button = bouton avec texte
};

export default function LogoutButton({ variant = "icon" }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const doLogout = async () => {
    try {
      setLoading(true);
      await storage.clearAllLogout(); // ✅ token + user + cache
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: doLogout },
      ]
    );
  };

  if (variant === "button") {
    return (
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Déconnexion</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // variant = "icon"
  return (
    <TouchableOpacity
      style={[styles.iconBtn, loading && { opacity: 0.6 }]}
      onPress={handleLogout}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Ionicons name="log-out-outline" size={22} color="#2C94CB" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F9690E",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  btnText: {
    color: "#fff",
    fontFamily: "Kufam-Bold",
    fontSize: 14,
  },
});
