import { Box, Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F6F4EE",
        color: "#202923",
        position: "relative",
      }}
    >
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Sidebar />
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: 276,
            border: "none",
            borderRight: "1px solid #E5E3DB",
            backgroundColor: "#FFFFFF",
            boxShadow: "12px 0 35px rgba(32, 41, 35, 0.10)",
          },
        }}
      >
        <Sidebar
          mobile
          onNavigate={closeMobile}
        />
      </Drawer>

      {/* Top Header */}
      <Header
        onMenu={() => setMobileOpen(true)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          ml: {
            xs: 0,
            md: "272px",
          },

          pt: {
            xs: "76px",
            md: "82px",
          },

          minHeight: "100vh",

          width: {
            xs: "100%",
            md: "calc(100% - 272px)",
          },

          background:
            "linear-gradient(180deg, #F6F4EE 0%, #F8F7F2 45%, #F6F4EE 100%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1600,
            mx: "auto",

            px: {
              xs: 2,
              sm: 3,
              lg: 4,
              xl: 5,
            },

            pb: {
              xs: 4,
              md: 6,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
