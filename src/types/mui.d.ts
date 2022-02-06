export { }

declare module '@mui/material/styles' {
  interface Palette {
    [key: string]: Palette['primary'];
  }
  interface PaletteOptions {
    red: PaletteOptions['primary'];
    green: PaletteOptions['primary'];
    orange: PaletteOptions['primary'];
    light_orange: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
    cyan: PaletteOptions['primary'];
    purple: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    red: true;
    green: true;
    orange: true;
    light_orange: true;
    yellow: true;
    cyan: true;
    purple: true;
  }
}