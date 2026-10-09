import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat datang 👋</Text>
      <Text style={styles.subtitle}>Konten beranda ditaruh di sini.</Text>
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
});
