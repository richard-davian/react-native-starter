import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// Ganti warna merek klien di sini saja
const PRIMARY_LIGHT = "#2563eb";
const PRIMARY_DARK = "#60a5fa";

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 3, // MD3 mengalikan nilai ini (3 ≈ 12px)
  colors: { ...MD3LightTheme.colors, primary: PRIMARY_LIGHT },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: { ...MD3DarkTheme.colors, primary: PRIMARY_DARK },
};
