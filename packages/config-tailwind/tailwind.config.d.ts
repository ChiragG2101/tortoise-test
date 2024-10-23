import "tailwindcss/tailwind-config";
import type { Config } from "tailwindcss";
import { default as themeConstants } from "./themeConstants";

declare module "tailwindcss/tailwind-config" {
  interface Theme {
    extend: {
      fontFamily: {
        heading: typeof themeConstants.font.heading;
        body: typeof themeConstants.font.body;
        default: typeof themeConstants.font.body;
      };
      colors: {
        primary: typeof themeConstants.primary;
        secondary: typeof themeConstants.secondary;
        error: typeof themeConstants.error;
        fg: typeof themeConstants.fg;
        green: typeof themeConstants.green;
        black: typeof themeConstants.black;
        rose: typeof themeConstants.rose;
        violet: typeof themeConstants.violet;
        blue: typeof themeConstants.blue;
        sky: typeof themeConstants.sky;
        slate: typeof themeConstants.slate;
        yellow: typeof themeConstants.yellow;
        pink: typeof themeConstants.pink;
        purple: typeof themeConstants.purple;
        highlight: typeof themeConstants.highlight;
      };
      screens: {
        ha: { raw: "(hover: hover)" };
      };
      backgroundImage: {
        "glow-conic": string;
      };
    };
  }
}

declare const config: Omit<Config, "content">;
export default config;
