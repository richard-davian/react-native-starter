import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Home() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineSmall" style={styles.bold}>
        Welcome 👋
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }}>
        Home content goes here.
      </Text>
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
  bold: { fontWeight: "700" },
});
