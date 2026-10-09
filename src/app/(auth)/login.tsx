import { AppButton } from "@/components/app-button";
import { FormTextInput } from "@/components/form-text-input";
import { useAuth } from "@/context/auth";
import { loginSchema, type LoginInput } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values); // sukses -> guard otomatis pindah ke (app)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Terjadi kesalahan");
    }
  });

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.bold}>
              Selamat datang
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Masuk untuk melanjutkan ke akunmu
            </Text>
          </View>

          <FormTextInput
            control={control}
            name="email"
            label="Email"
            icon="email-outline"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => setFocus("password")}
            error={errors.email?.message}
          />
          <FormTextInput
            control={control}
            name="password"
            label="Password"
            icon="lock-outline"
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            error={errors.password?.message}
          />

          <Link
            href="/forgot-password"
            style={[styles.forgot, { color: theme.colors.primary }]}
          >
            Lupa password?
          </Link>

          <HelperText type="error" visible={!!serverError}>
            {serverError}
          </HelperText>

          <AppButton
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Masuk
          </AppButton>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Belum punya akun?{" "}
            </Text>
            <Link
              href="/register"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              Daftar
            </Link>
          </View>

          <Text
            variant="bodySmall"
            style={[styles.center, { color: theme.colors.onSurfaceVariant }]}
          >
            Demo: demo@demo.com / password123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 4 },
  header: { gap: 4, marginBottom: 20 },
  bold: { fontWeight: "800" },
  forgot: { alignSelf: "flex-end", fontWeight: "600", marginBottom: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  center: { textAlign: "center", marginTop: 8 },
});
