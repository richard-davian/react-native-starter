import { AppButton } from "@/components/app-button";
import { AuthFooter } from "@/components/auth-footer";
import { AuthScreen } from "@/components/auth-screen";
import { FormTextInput } from "@/components/form-text-input";
import { useAuth } from "@/context/auth";
import { registerSchema, type RegisterInput } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HelperText } from "react-native-paper";

export default function Register() {
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
      await signUp(values);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  });

  return (
    <AuthScreen
      title="Create account"
      footer={
        <AuthFooter
          text="Already have an account?"
          linkLabel="Sign in"
          href="/login"
        />
      }
    >
      <FormTextInput
        control={control}
        name="name"
        label="Name"
        icon="account-outline"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
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
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => setFocus("confirmPassword")}
        error={errors.password?.message}
      />
      <FormTextInput
        control={control}
        name="confirmPassword"
        label="Confirm password"
        icon="lock-check-outline"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
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
        Create account
      </AppButton>
    </AuthScreen>
  );
}
