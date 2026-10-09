import { AppButton } from "@/components/app-button";
import { FormTextInput } from "@/components/form-text-input";
import {
  forgotPassword,
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/services/auth";
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

export default function ForgotPassword() {
  const theme = useTheme();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await forgotPassword(values);
      setSentTo(values.email);
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
          {sentTo ? (
            // Tampilan sukses
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.bold}>
                Cek email kamu
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Jika {sentTo} terdaftar, kami telah mengirim tautan untuk
                mengatur ulang password.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text variant="headlineLarge" style={styles.bold}>
                  Lupa password?
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Masukkan email akunmu, kami kirim tautan untuk mengatur ulang
                  password.
                </Text>
              </View>

              <FormTextInput
                control={control}
                name="email"
                label="Email"
                icon="email-outline"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                error={errors.email?.message}
              />

              <HelperText type="error" visible={!!serverError}>
                {serverError}
              </HelperText>

              <AppButton
                onPress={onSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Kirim tautan
              </AppButton>
            </>
          )}

          <View style={styles.footer}>
            <Link
              href="/login"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              Kembali ke login
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
