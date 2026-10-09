import {
  Box,
  Divider,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  ["Dashboard", "/", "⌂"],
  ["My Files", "/files", "▣"],
  ["Duplicates", "/duplicates", "◈"],
  ["Storage Analytics", "/analytics", "◒"],
  ["Deletion History", "/deletion-history", "↶"],
  ["Audit Logs", "/audit-logs", "◌"],
] as const;

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 252,
        minHeight: mobile ? "100vh" : "calc(100vh - 24px)",

        position: mobile ? "relative" : "fixed",

        left: mobile ? 0 : 12,
        top: mobile ? 0 : 12,

        display: "flex",
        flexDirection: "column",

        backgroundColor: "#FFFFFF",
        color: "#202923",

        border: "1px solid #E3E5DF",
        borderRadius: mobile ? 0 : 3,

        overflow: "hidden",

        boxShadow: mobile
          ? "none"
          : "0 12px 35px rgba(32, 41, 35, 0.08)",

        zIndex: 1200,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          px: 2.25,
          py: 2.4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.35,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,

              borderRadius: 2,

              display: "grid",
              placeItems: "center",

              backgroundColor: "#16836A",

              color: "#FFFFFF",

              fontSize: 21,
              fontWeight: 900,

              boxShadow:
                "0 7px 18px rgba(22, 131, 106, 0.20)",
            }}
          >
            ◇
          </Box>

          {/* Brand name */}
          <Box>
            <Typography
              sx={{
                color: "#202923",
                fontWeight: 850,
                lineHeight: 1.1,
                fontSize: 15,
                letterSpacing: "-0.01em",
              }}
            >
              StorageIQ
            </Typography>

            <Typography
              sx={{
                color: "#7A847E",
                fontSize: 10.5,
                mt: 0.4,
              }}
            >
              Intelligent file storage
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "#E8E9E4",
        }}
      />

      {/* Navigation */}
      <Box
        sx={{
          px: 1.2,
          py: 2,
        }}
      >
        <Typography
          sx={{
            px: 1.25,
            mb: 1,

            color: "#929B95",

            fontSize: 10,
            fontWeight: 800,

            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Workspace
        </Typography>

        <List disablePadding>
          {menuItems.map(([label, path, icon]) => {
            const active =
              location.pathname === path ||
              (path !== "/" &&
                location.pathname.startsWith(path));

            return (
              <ListItemButton
                key={path}
                selected={active}
                onClick={() => {
                  navigate(path);
                  onNavigate?.();
                }}
                sx={{
                  mb: 0.55,

                  minHeight: 46,

                  borderRadius: 2,

                  color: active
                    ? "#0F5F4D"
                    : "#68736D",

                  px: 1.1,

                  position: "relative",

                  transition:
                    "all .18s ease",

                  "&.Mui-selected": {
                    backgroundColor: "#E8F5F0",
                    color: "#0F5F4D",
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "#E1F1EB",
                  },

                  "&:hover": {
                    backgroundColor: "#F4F7F4",
                    color: "#202923",
                  },

                  "&.Mui-selected:before": {
                    content: '""',

                    position: "absolute",

                    left: 0,
                    top: 9,
                    bottom: 9,

                    width: 3,

                    borderRadius: 3,

                    backgroundColor: "#16836A",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 35,
                    height: 35,

                    mr: 0.8,

                    borderRadius: 1.7,

                    display: "grid",
                    placeItems: "center",

                    fontSize: 17,

                    color: active
                      ? "#16836A"
                      : "#7B8780",

                    backgroundColor: active
                      ? "#D8EEE6"
                      : "transparent",

                    transition:
                      "all .18s ease",
                  }}
                >
                  {icon}
                </Box>

                {/* Label */}
                <Typography
                  sx={{
                    fontSize: 13.2,

                    fontWeight: active
                      ? 750
                      : 550,

                    color: "inherit",

                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </Typography>
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom section */}
      <Box
        sx={{
          mt: "auto",
          p: 1.8,
        }}
      >
        {/* Storage insight card */}
        <Box
          sx={{
            p: 1.7,

            borderRadius: 2.5,

            background:
              "linear-gradient(145deg, #F0F8F4 0%, #E8F5F0 100%)",

            border: "1px solid #D7EBE3",

            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circle */}
          <Box
            sx={{
              position: "absolute",

              width: 70,
              height: 70,

              right: -25,
              top: -25,

              borderRadius: "50%",

              backgroundColor:
                "rgba(22,131,106,.08)",
            }}
          />

          <Typography
            sx={{
              color: "#0F5F4D",

              fontSize: 12,
              fontWeight: 800,

              position: "relative",
            }}
          >
            Storage insight
          </Typography>

          <Typography
            sx={{
              color: "#718079",

              fontSize: 10.8,
              lineHeight: 1.55,

              mt: 0.55,

              position: "relative",
            }}
          >
            Identify duplicate files and
            reclaim unnecessary storage
            safely.
          </Typography>
        </Box>

        {/* Version */}
        <Typography
          sx={{
            color: "#A0A7A2",

            fontSize: 9.5,

            mt: 1.5,
            px: 0.5,

            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          Intelligent File Deduplication
        </Typography>

        <Typography
          sx={{
            color: "#B0B6B2",

            fontSize: 9.5,

            mt: 0.35,
            px: 0.5,
          }}
        >
          StorageIQ • v1.0
        </Typography>
      </Box>
    </Box>
  );
}