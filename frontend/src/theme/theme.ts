import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const sage = {
  50: "#f3f6f4",
  100: "#e1ebe3",
  200: "#c5d7c9",
  300: "#a0bda6",
  400: "#7ba286",
  500: "#5b8a6b",
  600: "#476e54",
  700: "#385943",
  800: "#2c4534",
  900: "#1f3025",
};

const warmGray = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917",
};

const SYSTEM_FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
const MONO_STACK = `"Consolas", "Monaco", "Courier New", monospace`;

const theme = extendTheme({
  config,
  colors: {
    sage,
    warmGray,
  },
  fonts: {
    heading: SYSTEM_FONT_STACK,
    body: SYSTEM_FONT_STACK,
    mono: MONO_STACK,
  },
  semanticTokens: {
    colors: {
      "bg.canvas": { _light: "warmGray.50", _dark: "warmGray.900" },
      "bg.surface": { _light: "white", _dark: "warmGray.800" },
      "bg.muted": { _light: "warmGray.100", _dark: "warmGray.800" },
      "text.primary": { _light: "warmGray.900", _dark: "warmGray.50" },
      "text.muted": { _light: "warmGray.600", _dark: "warmGray.400" },
      "text.subtle": { _light: "warmGray.500", _dark: "warmGray.500" },
      "border.default": { _light: "warmGray.200", _dark: "warmGray.700" },
      "border.subtle": { _light: "warmGray.100", _dark: "warmGray.800" },
      "accent.solid": { _light: "sage.500", _dark: "sage.400" },
      "accent.fg": { _light: "white", _dark: "warmGray.900" },
      "accent.hover": { _light: "sage.600", _dark: "sage.300" },
      "accent.subtle": { _light: "sage.50", _dark: "sage.900" },
      "accent.muted": { _light: "sage.100", _dark: "sage.800" },
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "bg.canvas",
        color: "text.primary",
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: "text.primary",
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "sage",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "accent.solid",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "accent.solid",
      },
    },
    Link: {
      baseStyle: {
        color: "accent.solid",
        _hover: { color: "accent.hover", textDecoration: "underline" },
      },
    },
  },
});

export default theme;
