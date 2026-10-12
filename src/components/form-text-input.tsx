import { useState, type ComponentProps } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";

type Props<T extends FieldValues> = Omit<
  ComponentProps<typeof TextInput>,
  "value" | "onChangeText" | "error"
> & {
  control: Control<T>;
  name: Path<T>;
  error?: string;
  icon?: string;
};

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  error,
  icon,
  secureTextEntry,
  ...rest
}: Props<T>) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <TextInput
            ref={ref}
            mode="outlined"
            value={(value as string) ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
            secureTextEntry={hidden}
            autoCapitalize="none"
            autoCorrect={false}
            left={icon ? <TextInput.Icon icon={icon} /> : undefined}
            right={
              secureTextEntry ? (
                <TextInput.Icon
                  icon={hidden ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setHidden((h) => !h)}
                />
              ) : undefined
            }
            {...rest}
          />
        )}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </>
  );
}
