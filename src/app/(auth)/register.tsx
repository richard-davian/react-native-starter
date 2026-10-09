import { useAuth } from "@/context/auth";
import { registerSchema, type RegisterInput } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Field reusable: mengurangi pengulangan Controller
function Field({
  control,
  name,
  error,
  ...inputProps
}: {
  control: Control<RegisterInput>;
  name: keyof RegisterInput;
  error?: string;
} & TextInputProps) {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            {...inputProps}
          />
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
}

export default function Register() {
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Daftar</Text>

          <Field
            control={control}
            name="name"
            placeholder="Nama"
            autoCapitalize="words"
            error={errors.name?.message}
          />
          <Field
            control={control}
            name="email"
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email?.message}
          />
          <Field
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
            error={errors.password?.message}
          />
          <Field
            control={control}
            name="confirmPassword"
            placeholder="Konfirmasi password"
            secureTextEntry
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            error={errors.confirmPassword?.message}
          />

          {serverError && <Text style={styles.error}>{serverError}</Text>}

          <Pressable
            style={[styles.button, isSubmitting && styles.disabled]}
            onPress={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </Pressable>

          <Link href="/login" style={styles.link}>
            Sudah punya akun? Masuk
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: { borderColor: "#dc2626" },
  error: { color: "#dc2626", fontSize: 13 },
  button: {
    backgroundColor: "#2563eb",
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", color: "#2563eb", marginTop: 8 },
});
