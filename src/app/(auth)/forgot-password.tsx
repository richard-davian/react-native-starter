import { AppButton } from "@/components/app-button";
import { AuthFooter } from "@/components/auth-footer";
import { AuthScreen } from "@/components/auth-screen";
import { FormTextInput } from "@/components/form-text-input";
import {
  forgotPassword,
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HelperText } from "react-native-paper";

export default function ForgotPassword() {
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
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  });

  return (
    <AuthScreen
      title={sentTo ? "Check your email" : "Forgot password?"}
      description={
        sentTo
          ? `If ${sentTo} is registered, we've sent a link to reset your password.`
          : "Enter your account email and we'll send you a link to reset your password."
      }
      footer={<AuthFooter linkLabel="Back to sign in" href="/login" />}
    >
      {!sentTo && (
        <>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            icon="email-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
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
            Send reset link
          </AppButton>
        </>
      )}
    </AuthScreen>
  );
}
