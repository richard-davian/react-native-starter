import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password</Text>
      <Text style={styles.subtitle}>Halaman ini belum diimplementasikan.</Text>
      <Link href="/login" style={styles.link}>
        Kembali ke login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#6b7280" },
  link: { color: "#2563eb", marginTop: 8 },
});
