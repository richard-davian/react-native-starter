import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const PRIMARY_LIGHT = "#2563eb";
const PRIMARY_DARK = "#60a5fa";

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: PRIMARY_LIGHT,
    primaryContainer: "#dbeafe",
    onPrimaryContainer: "#1e3a8a",
    secondaryContainer: "#e0f2fe",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: PRIMARY_DARK,
    primaryContainer: "#1e3a8a",
    onPrimaryContainer: "#dbeafe",
    secondaryContainer: "#0c4a6e",
  },
};
