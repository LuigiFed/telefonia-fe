import { createTheme, type ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  typography: {
    allVariants: {
      fontFamily: '"Titillium Web", sans-serif',
    },
    h1: {
      fontSize: "36px",
      fontWeight: "600",
    },
    h2: {
      fontSize: "28px",
      fontWeight: "600",
    },
    h3: {
      fontSize: "22px",
      fontWeight: "600",
    },
    body1: { fontSize: "16px", fontWeight: "400" },
    body2: { fontSize: "14px", fontWeight: "700" },
    subtitle1: { fontSize: "12px", fontWeight: "400" },
    subtitle2: { fontSize: "12px", fontWeight: "600" },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#134DCE",
      dark: "#565656",
      light: "#E5F6FD",
    },
    secondary: {
      dark: "#737373",
      main: "#DBDBDB",
      light: "#FAFAFA",
    },
    background: {
      default: "#f2f2f2",
    },
    text: {
      primary: "#262626",
      //secondary:"#ffffff"
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-selected": {
            color: "#0C63B3",
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#222222",
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
