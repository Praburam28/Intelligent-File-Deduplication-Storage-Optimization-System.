import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const titles: Record<string, [string, string]> = {
  "/": [
    "Dashboard",
    "A clear view of files, duplicates and storage health",
  ],

  "/files": [
    "My Files",
    "Manage, search and organize your uploaded files",
  ],

  "/duplicates": [
    "Duplicate Center",
    "Review redundant files before reclaiming storage",
  ],

  "/analytics": [
    "Storage Analytics",
    "Understand where your storage is going",
  ],

  "/deletion-history": [
    "Deletion History",
    "Review files that have been removed",
  ],

  "/audit-logs": [
    "Audit Logs",
    "Track important file and account activity",
  ],
};

export default function Header({
  onMenu,
}: {
  onMenu: () => void;
}) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [title, subtitle] =
    titles[location.pathname] || [
      "StorageIQ",
      "Intelligent file management",
    ];

  const initial = (
    user?.username || "U"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <Box
      sx={{
        height: 70,

        position: "fixed",

        top: 0,

        left: {
          xs: 0,
          md: "272px",
        },

        right: 0,

        px: {
          xs: 1.5,
          sm: 3,
          lg: 4,
        },

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        backgroundColor: "rgba(255,255,255,0.94)",

        backdropFilter: "blur(14px)",

        borderBottom:
          "1px solid #E5E3DB",

        boxShadow:
          "0 2px 12px rgba(32,41,35,0.035)",

        zIndex: 1100,
      }}
    >
      {/* Left section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,

          minWidth: 0,
        }}
      >
        {/* Mobile menu */}
        <IconButton
          onClick={onMenu}
          aria-label="Open navigation"
          sx={{
            display: {
              xs: "grid",
              md: "none",
            },

            placeItems: "center",

            width: 40,
            height: 40,

            border:
              "1px solid #DDE2DD",

            borderRadius: 2,

            color: "#465149",

            backgroundColor: "#FFFFFF",

            "&:hover": {
              borderColor: "#16836A",
              backgroundColor: "#EEF7F4",
              color: "#16836A",
            },
          }}
        >
          ☰
        </IconButton>

        {/* Page title */}
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 16,
                sm: 18,
              },

              fontWeight: 800,

              color: "#202923",

              lineHeight: 1.15,

              letterSpacing: "-0.015em",

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              color: "#7A847E",

              fontSize: 11.5,

              mt: 0.35,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Right section */}
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: {
            xs: 0.7,
            sm: 1.2,
          },
        }}
      >
        {/* User information */}
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },

            textAlign: "right",

            mr: 0.4,
          }}
        >
          <Typography
            sx={{
              fontSize: 12.5,

              fontWeight: 750,

              color: "#28342D",

              lineHeight: 1.2,
            }}
          >
            {user?.username || "User"}
          </Typography>

          <Typography
            sx={{
              fontSize: 10.5,

              color: "#89938D",

              mt: 0.35,
            }}
          >
            {user?.email || "Signed in"}
          </Typography>
        </Box>

        {/* Avatar */}
        <Avatar
          sx={{
            width: 39,
            height: 39,

            fontSize: 13,

            fontWeight: 800,

            color: "#FFFFFF",

            backgroundColor: "#16836A",

            border:
              "3px solid #E5F3EE",

            boxShadow:
              "0 3px 10px rgba(22,131,106,0.16)",
          }}
        >
          {initial}
        </Avatar>

        {/* Logout */}
        <Button
          onClick={logout}
          variant="outlined"
          size="small"
          sx={{
            display: {
              xs: "none",
              sm: "inline-flex",
            },

            minWidth: 72,

            height: 36,

            borderRadius: 2,

            borderColor: "#D5DCD7",

            color: "#526057",

            fontSize: 12,

            fontWeight: 700,

            px: 1.5,

            "&:hover": {
              borderColor: "#C94B4B",

              backgroundColor: "#FCEAEA",

              color: "#9F3030",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}