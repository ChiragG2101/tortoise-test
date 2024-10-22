import type { Config } from "tailwindcss";
import { default as themeConstants } from "./themeConstants";
import { screens as _screens } from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/react";

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
  plugins: [
    nextui({
      themes: {
        "custom-theme": {
          extend: "light",
          colors: {
            background: "#FAF4EA",
            foreground: "#191919",
            primary: {
              50: "#E6FFE6",
              100: "#C5FCC9",
              200: "#A4F6B5",
              300: "#83EDA8",
              400: "#62E29F",
              500: "#42D499",
              600: "#2AC393",
              700: "#16AF8E",
              800: "#167E62",
              900: "#114036",
              DEFAULT: "#16AF8E",
              foreground: "#191919",
            },
            focus: "#4DBDDF",
          },
          layout: {
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};
export default config;
