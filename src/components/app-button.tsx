import type { ComponentProps } from "react";
import { Button } from "react-native-paper";

export function AppButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      mode="contained"
      contentStyle={{ height: 52 }}
      labelStyle={{ fontSize: 16, fontWeight: "700" }}
      {...props}
    />
  );
}
