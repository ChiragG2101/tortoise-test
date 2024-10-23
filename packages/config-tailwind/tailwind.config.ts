import type { Config } from "tailwindcss";
import { default as themeConstants } from "./themeConstants";
import { screens as _screens } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      fontFamily: {
        heading: themeConstants.font.heading,
        body: themeConstants.font.body,
        default: themeConstants.font.body,
      },
      colors: {
        primary: themeConstants.primary,
        secondary: themeConstants.secondary,
        error: themeConstants.error,
        fg: themeConstants.fg,
        green: themeConstants.green,
        black: themeConstants.black,
        rose: themeConstants.rose,
        violet: themeConstants.violet,
        blue: themeConstants.blue,
        sky: themeConstants.sky,
        slate: themeConstants.slate,
        yellow: themeConstants.yellow,
        pink: themeConstants.pink,
        purple: themeConstants.purple,
        highlight: themeConstants.highlight,
      },
      screens: {
        ..._screens,
        ...themeConstants.breakpoints,
        ha: { raw: "(hover: hover)" },
      },
    },
    backgroundImage: {
      "glow-conic":
        "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
    },
  },
};
export default config;
