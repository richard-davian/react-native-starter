import { AppButton } from "@/components/app-button";
import { AuthFooter } from "@/components/auth-footer";
import { AuthScreen } from "@/components/auth-screen";
import { FormTextInput } from "@/components/form-text-input";
import { useAuth } from "@/context/auth";
import { loginSchema, type LoginInput } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";

export default function Login() {
  const { colors } = useTheme();
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
      await signIn(values);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  });

  return (
    <AuthScreen
      title="Sign in"
      footer={
        <AuthFooter
          text="Don't have an account?"
          linkLabel="Sign up"
          href="/register"
        />
      }
    >
      <FormTextInput
        control={control}
        name="email"
        label="Email"
        icon="email-outline"
        keyboardType="email-address"
        autoCapitalize="none"
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
        style={[styles.forgot, { color: colors.primary }]}
      >
        Forgot password?
      </Link>

      <HelperText type="error" visible={!!serverError}>
        {serverError}
      </HelperText>

      <AppButton
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign in
      </AppButton>

      {__DEV__ && (
        <Text
          variant="bodySmall"
          style={[styles.demo, { color: colors.onSurfaceVariant }]}
        >
          Demo: demo@demo.com / password123
        </Text>
      )}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: "flex-end", fontWeight: "600", marginVertical: 8 },
  demo: { textAlign: "center", marginTop: 8 },
});
