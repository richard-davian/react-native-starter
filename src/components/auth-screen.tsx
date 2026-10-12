import { BRAND } from "@/constants/brand";
import { type ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreen({ title, description, children, footer }: Props) {
  const { colors } = useTheme();
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={[
            styles.blob,
            styles.top,
            { backgroundColor: colors.primaryContainer },
          ]}
        />
        <View
          style={[
            styles.blob,
            styles.bottom,
            { backgroundColor: colors.secondaryContainer },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: enter,
              transform: [
                {
                  translateY: enter.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            }}
          >
            <View style={styles.brand}>
              <Card mode="elevated" elevation={3} style={styles.logoCard}>
                <Image
                  source={BRAND.logo}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel={`Logo ${BRAND.name}`}
                />
              </Card>
              <Text variant="headlineMedium" style={styles.appName}>
                {BRAND.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                {BRAND.tagline}
              </Text>
            </View>

            <Card mode="outlined">
              <Card.Content style={styles.cardContent}>
                <View style={styles.heading}>
                  <Text variant="titleLarge" style={styles.title}>
                    {title}
                  </Text>
                  {description && (
                    <Text
                      variant="bodyMedium"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {description}
                    </Text>
                  )}
                </View>
                {children}
              </Card.Content>
            </Card>

            {footer && <View style={styles.footer}>{footer}</View>}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.6 },
  top: { width: 280, height: 280, top: -110, right: -90 },
  bottom: { width: 220, height: 220, bottom: -90, left: -80 },
  brand: { alignItems: "center", gap: 6, marginBottom: 28 },
  logoCard: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: { width: 56, height: 56 },
  appName: { fontWeight: "800", letterSpacing: -0.5 },
  cardContent: { gap: 4, paddingVertical: 8 },
  heading: { gap: 4, marginBottom: 12 },
  title: { fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
});
