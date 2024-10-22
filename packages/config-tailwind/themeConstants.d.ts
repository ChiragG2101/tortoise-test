declare module "themeConstants" {
  export interface ThemeConstants {
    primary: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      base: string;
      dark: string;
      contrastText: string;
    };
    green: Record<number, string>;
    black: Record<number, string>;
    rose: Record<number | string, string>;
    violet: Record<number | string, string>;
    blue: Record<number | string, string>;
    sky: Record<number | string, string>;
    slate: Record<number | string, string>;
    yellow: Record<number | string, string>;
    highlight: {
      red: {
        dark: string;
        light: Record<number, string>;
      };
      yellow: {
        dark: string;
        light: Record<number, string>;
      };
      purple: {
        dark: string;
        light: Record<number, string>;
      };
      green: {
        dark: string;
        light: Record<number, string>;
      };
      grey: {
        dark: string;
        light: Record<number, string>;
      };
    };
    pink: Record<number, string>;
    purple: Record<number, string>;
    error: {
      base: string;
      contrastText: string;
    };
    fg: {
      main: string;
      dark: string;
    };
    background: {
      grey: string;
    };
    breakpoints: Record<string, string>;
    font: {
      body: string;
      heading: string;
    };
  }

  const themeConstants: ThemeConstants;
  export default themeConstants;
}
