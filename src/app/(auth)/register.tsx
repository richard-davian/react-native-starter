import { AppButton } from "@/components/app-button";
import { FormTextInput } from "@/components/form-text-input";
import { useAuth } from "@/context/auth";
import { registerSchema, type RegisterInput } from "@/services/auth";
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

export default function Register() {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signUp(values); // sukses -> guard otomatis pindah ke (app)
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
              Buat akun
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Isi data di bawah untuk mendaftar
            </Text>
          </View>

          <FormTextInput
            control={control}
            name="name"
            label="Nama"
            icon="account-outline"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => setFocus("email")}
            error={errors.name?.message}
          />
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            icon="email-outline"
            keyboardType="email-address"
            autoComplete="email"
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
            returnKeyType="next"
            onSubmitEditing={() => setFocus("confirmPassword")}
            error={errors.password?.message}
          />
          <FormTextInput
            control={control}
            name="confirmPassword"
            label="Konfirmasi password"
            icon="lock-check-outline"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            error={errors.confirmPassword?.message}
          />

          <HelperText type="error" visible={!!serverError}>
            {serverError}
          </HelperText>

          <AppButton
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Daftar
          </AppButton>

          <View style={styles.footer}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Sudah punya akun?{" "}
            </Text>
            <Link
              href="/login"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              Masuk
            </Link>
          </View>
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
});
