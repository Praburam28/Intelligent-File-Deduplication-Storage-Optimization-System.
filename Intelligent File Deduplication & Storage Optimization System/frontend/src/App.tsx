import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#16836A",
      light: "#43A88D",
      dark: "#0F5F4D",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#D99A2B",
      light: "#F0BD63",
      dark: "#A96F12",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F6F4EE",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#202923",
      secondary: "#69736D",
    },

    success: {
      main: "#16836A",
      light: "#43A88D",
      dark: "#0F5F4D",
    },

    warning: {
      main: "#D99A2B",
      light: "#F0BD63",
      dark: "#A96F12",
    },

    error: {
      main: "#C94B4B",
      light: "#E27676",
      dark: "#9F3030",
    },

    info: {
      main: "#347A8F",
      light: "#65A6B8",
      dark: "#24586A",
    },

    divider: "#E5E3DB",
  },

  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.035em",
      color: "#202923",
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
      color: "#202923",
    },

    h3: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
      color: "#202923",
    },

    h4: {
      fontWeight: 750,
      letterSpacing: "-0.02em",
      color: "#202923",
    },

    h5: {
      fontWeight: 700,
      color: "#202923",
    },

    h6: {
      fontWeight: 700,
      color: "#202923",
    },

    body1: {
      color: "#465149",
    },

    body2: {
      color: "#69736D",
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F6F4EE",
          color: "#202923",
        },

        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#B8C5BE transparent",
        },

        "*::-webkit-scrollbar": {
          width: "7px",
          height: "7px",
        },

        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#B8C5BE",
          borderRadius: "10px",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#16836A",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #E5E3DB",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E3DB",
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(32, 41, 35, 0.055)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 9,
          minHeight: 40,
          paddingLeft: 17,
          paddingRight: 17,
        },

        contained: {
          "&.MuiButton-containedPrimary": {
            backgroundColor: "#16836A",
            color: "#FFFFFF",

            "&:hover": {
              backgroundColor: "#0F5F4D",
            },
          },

          "&.MuiButton-containedSecondary": {
            backgroundColor: "#D99A2B",
            color: "#FFFFFF",

            "&:hover": {
              backgroundColor: "#A96F12",
            },
          },
        },

        outlined: {
          borderColor: "#C9D1CB",
          color: "#34413A",

          "&:hover": {
            borderColor: "#16836A",
            backgroundColor: "#EEF7F4",
          },
        },

        text: {
          color: "#16836A",

          "&:hover": {
            backgroundColor: "#EEF7F4",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,

          "&:hover": {
            backgroundColor: "#EEF7F4",
            color: "#16836A",
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          backgroundColor: "#FFFFFF",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D7DDD8",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9BB8AD",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#16836A",
            borderWidth: 2,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#69736D",

          "&.Mui-focused": {
            color: "#16836A",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
        },

        colorPrimary: {
          backgroundColor: "#E5F3EE",
          color: "#0F5F4D",
        },

        colorSecondary: {
          backgroundColor: "#FFF3D9",
          color: "#8A5B0C",
        },

        colorSuccess: {
          backgroundColor: "#E5F3EE",
          color: "#0F5F4D",
        },

        colorWarning: {
          backgroundColor: "#FFF3D9",
          color: "#8A5B0C",
        },

        colorError: {
          backgroundColor: "#FBE8E8",
          color: "#9F3030",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F2F1EB",

          "& .MuiTableCell-head": {
            color: "#526057",
            fontWeight: 800,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.045em",
            borderBottom: "1px solid #DDDCD4",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #ECEBE5",
          color: "#34413A",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F8FAF8",
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#202923",
          fontSize: "11px",
          borderRadius: 7,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid transparent",
        },

        colorSuccess: {
          backgroundColor: "#E8F5F0",
          color: "#0F5F4D",
        },

        colorWarning: {
          backgroundColor: "#FFF4DD",
          color: "#81570E",
        },

        colorError: {
          backgroundColor: "#FCEAEA",
          color: "#9F3030",
        },

        colorInfo: {
          backgroundColor: "#E8F2F5",
          color: "#24586A",
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 7,
          borderRadius: 10,
          backgroundColor: "#E2E9E5",
        },

        bar: {
          borderRadius: 10,
          backgroundColor: "#16836A",
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          strokeLinecap: "round",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5E3DB",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
