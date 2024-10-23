// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";
import { nextui } from "@nextui-org/react";

const config: Pick<Config, "content" | "presets" | "plugins" | "theme"> = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#16AF8E",
          main: "#16AF8E",
          dark: "#114036",
          contrastText: "#FFFFFF",
        },
      },
    },
  },
  presets: [sharedConfig],

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
