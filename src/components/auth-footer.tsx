import { Link, type Href } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = { text?: string; linkLabel: string; href: Href };

export function AuthFooter({ text, linkLabel, href }: Props) {
  const { colors } = useTheme();
  return (
    <>
      {text && <Text style={{ color: colors.onSurfaceVariant }}>{text} </Text>}
      <Link href={href} style={[styles.link, { color: colors.primary }]}>
        {linkLabel}
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  link: { fontWeight: "700" },
});
