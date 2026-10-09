import { AppButton } from "@/components/app-button";
import { useAuth } from "@/context/auth";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

// "Demo User" -> "DU"
const initials = (name?: string) =>
  (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

export default function Profile() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  // Konfirmasi dulu supaya tidak logout tanpa sengaja
  const confirmLogout = () =>
    Alert.alert("Logout", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: () => void signOut() },
    ]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Avatar.Text size={88} label={initials(user?.name)} />
        <Text variant="titleLarge" style={styles.bold}>
          {user?.name ?? "-"}
        </Text>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          {user?.email ?? "-"}
        </Text>
      </View>

      <AppButton
        mode="outlined"
        icon="logout"
        textColor={theme.colors.error}
        style={{ borderColor: theme.colors.error }}
        onPress={confirmLogout}
      >
        Logout
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 32 },
  header: { alignItems: "center", gap: 6, marginTop: 24 },
  bold: { fontWeight: "700" },
});
