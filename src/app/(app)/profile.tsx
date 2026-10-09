import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const { user, signOut } = useAuth();

  // Konfirmasi dulu supaya tidak logout tanpa sengaja
  const confirmLogout = () =>
    Alert.alert("Logout", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: () => void signOut() },
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.name ?? "-"}</Text>
        <Text style={styles.email}>{user?.email ?? "-"}</Text>
      </View>

      <Pressable style={styles.logout} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 32 },
  header: { alignItems: "center", gap: 4, marginTop: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  name: { fontSize: 20, fontWeight: "700" },
  email: { color: "#6b7280" },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  logoutText: { color: "#dc2626", fontWeight: "600", fontSize: 16 },
});
