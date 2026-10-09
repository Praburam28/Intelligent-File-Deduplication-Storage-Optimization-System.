import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  HardDrive,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      await login(username.trim(), password);

      navigate("/", { replace: true });
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ||
          "Invalid username or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1.5, sm: 3 },
        py: { xs: 2, md: 4 },
        background:
          "radial-gradient(circle at 10% 10%, rgba(22,131,106,0.12) 0, transparent 28%), radial-gradient(circle at 90% 90%, rgba(217,154,43,0.10) 0, transparent 25%), #f5faf6",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1080,
            overflow: "hidden",
            borderRadius: {
              xs: 3,
              md: 4,
            },
            border: "1px solid #dfeae2",
            background: "#ffffff",
            boxShadow:
              "0 30px 80px rgba(26,70,54,0.12)",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "0.95fr 1.05fr",
            },
          }}
        >
          {/* ================================
              LEFT BRAND PANEL
          ================================= */}

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              p: {
                xs: 3,
                sm: 4,
                md: 5.5,
              },
              color: "#ffffff",
              background:
                "linear-gradient(145deg, #0c4639 0%, #12624f 52%, #16836A 100%)",
              minHeight: {
                xs: 300,
                md: 620,
              },
            }}
          >
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.055)",
                top: -150,
                right: -120,
              }}
            />

            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "rgba(217,154,43,0.10)",
                bottom: -100,
                left: -90,
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ================================
                  LOGO
              ================================= */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(255,255,255,0.13)",
                    border:
                      "1px solid rgba(255,255,255,0.15)",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.12)",
                    color: "#ffffff",
                  }}
                >
                  <HardDrive size={23} />
                </Box>

                <Box>
                  {/* FIXED: Explicit white color */}
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 850,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "#ffffff !important",
                    }}
                  >
                    StorageIQ
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      color: "#ccefe1 !important",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Intelligent Storage
                  </Typography>
                </Box>
              </Box>

              {/* ================================
                  MAIN BRAND MESSAGE
              ================================= */}

              <Box
                sx={{
                  mt: {
                    xs: 4,
                    md: 9,
                  },
                }}
              >
                {/* Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.7,
                    px: 1.2,
                    py: 0.65,
                    borderRadius: 999,
                    background:
                      "rgba(255,255,255,0.10)",
                    color: "#d9eee6",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                  }}
                >
                  <Sparkles size={13} />
                  SMART FILE MANAGEMENT
                </Box>

                {/* FIXED: Explicit white heading */}
                <Typography
                  sx={{
                    mt: 2.5,
                    fontSize: {
                      xs: "2rem",
                      sm: "2.35rem",
                      md: "2.7rem",
                    },
                    lineHeight: 1.05,
                    fontWeight: 850,
                    letterSpacing: "-0.04em",
                    color: "#ffffff !important",
                  }}
                >
                  Your storage.
                  <br />

                  {/* Highlighted second line */}
                  <Box
                    component="span"
                    sx={{
                      color: "#d9f5e9 !important",
                    }}
                  >
                    Under control.
                  </Box>
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    mt: 2,
                    maxWidth: 440,
                    color: "#d4ebe2 !important",
                    fontSize: {
                      xs: "0.82rem",
                      md: "0.88rem",
                    },
                    lineHeight: 1.75,
                  }}
                >
                  Find duplicate content, understand storage
                  waste, and reclaim space safely from one
                  intelligent workspace.
                </Typography>
              </Box>

              {/* ================================
                  FEATURE LIST
              ================================= */}

              <Box
                sx={{
                  mt: {
                    xs: 3,
                    md: "auto",
                  },
                  pt: {
                    md: 6,
                  },
                  display: "grid",
                  gap: 1.4,
                }}
              >
                {[
                  {
                    icon: <FileSearch size={16} />,
                    text: "Content-based duplicate detection",
                  },
                  {
                    icon: <HardDrive size={16} />,
                    text: "Background file hashing",
                  },
                  {
                    icon: <ShieldCheck size={16} />,
                    text: "Safe deletion & audit history",
                  },
                ].map((item) => (
                  <Box
                    key={item.text}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.1,
                      color: "#d5ebe3",
                      fontSize: "0.76rem",
                      fontWeight: 600,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: 1.8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(255,255,255,0.10)",
                        color: "#d5eee5",
                      }}
                    >
                      {item.icon}
                    </Box>

                    {item.text}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ================================
              RIGHT LOGIN PANEL
          ================================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: {
                xs: 3,
                sm: 5,
                md: 6,
              },
              background: "#ffffff",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 430,
                mx: "auto",
              }}
            >
              {/* Mobile Logo */}
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "none",
                  },
                  alignItems: "center",
                  gap: 1,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#e8f6ef",
                    color: "#16836A",
                  }}
                >
                  <HardDrive size={20} />
                </Box>

                <Typography
                  sx={{
                    color: "#183b30 !important",
                    fontSize: "1rem",
                    fontWeight: 850,
                  }}
                >
                  StorageIQ
                </Typography>
              </Box>

              {/* Heading */}
              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2rem",
                  },
                  fontWeight: 850,
                  color: "#183b30 !important",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                }}
              >
                Welcome back
              </Typography>

              <Typography
                sx={{
                  mt: 0.9,
                  color: "#71877e !important",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                }}
              >
                Sign in to continue to your intelligent storage
                workspace.
              </Typography>

              {/* Form */}
              <Box
                component="form"
                onSubmit={submit}
                sx={{
                  mt: 3.5,
                }}
              >
                {/* Error */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2.2,
                      borderRadius: 2.2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Username */}
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                  disabled={loading}
                  sx={{
                    mb: 1.8,

                    "& .MuiInputLabel-root": {
                      color: "#71877e",
                    },

                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.3,
                      background: "#fbfdfb",
                    },

                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: "#a8c9ba",
                    },

                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#16836A",
                    },

                    "& .MuiOutlinedInput-root.Mui-focused .MuiInputLabel-root":
                      {
                        color: "#16836A",
                      },

                    "& label.Mui-focused": {
                      color: "#16836A",
                    },
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  sx={{
                    mb: 2.2,

                    "& .MuiInputLabel-root": {
                      color: "#71877e",
                    },

                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.3,
                      background: "#fbfdfb",
                    },

                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: "#a8c9ba",
                    },

                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#16836A",
                    },

                    "& label.Mui-focused": {
                      color: "#16836A",
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  endIcon={
                    !loading ? (
                      <ArrowRight size={18} />
                    ) : undefined
                  }
                  sx={{
                    height: 48,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontSize: "0.86rem",
                    fontWeight: 800,
                    color: "#ffffff !important",
                    background:
                      "linear-gradient(135deg, #16836A, #0f654f)",
                    boxShadow:
                      "0 9px 24px rgba(22,131,106,0.20)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #126f5a, #0b5543)",
                      boxShadow:
                        "0 11px 28px rgba(22,131,106,0.25)",
                    },

                    "&.Mui-disabled": {
                      color: "#ffffff",
                      background: "#8bb8aa",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={21}
                      sx={{
                        color: "#ffffff",
                      }}
                    />
                  ) : (
                    "Sign in"
                  )}
                </Button>

                {/* OR divider */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    my: 2.8,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      background: "#e6eee9",
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#9aaaA3 !important",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  >
                    OR
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      height: "1px",
                      background: "#e6eee9",
                    }}
                  />
                </Box>

                {/* Register */}
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#7b8e86 !important",
                    fontSize: "0.8rem",
                  }}
                >
                  New to StorageIQ?{" "}
                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate("/register")}
                    sx={{
                      border: 0,
                      p: 0,
                      background: "transparent",
                      color: "#16836A !important",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      fontWeight: 850,
                      cursor: "pointer",

                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Create an account
                  </Box>
                </Typography>

                {/* Security note */}
                <Box
                  sx={{
                    mt: 3.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.6,
                    color: "#8c9d95",
                    fontSize: "0.68rem",
                  }}
                >
                  <CheckCircle2
                    size={13}
                    color="#16836A"
                  />

                  Secure access to your files
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}