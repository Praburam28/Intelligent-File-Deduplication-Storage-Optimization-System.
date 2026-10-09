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
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        "Registration successful. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Unable to create account.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to create account.",
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
          {/* =====================================
              LEFT BRAND PANEL
          ====================================== */}

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
                md: 650,
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
              {/* =====================================
                  LOGO
              ====================================== */}

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
                  {/* Explicit white color */}
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

              {/* =====================================
                  MAIN BRAND CONTENT
              ====================================== */}

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

                {/* Main heading - explicitly white */}
                <Typography
                  sx={{
                    mt: 2.5,
                    fontSize: {
                      xs: "2rem",
                      sm: "2.35rem",
                      md: "2.65rem",
                    },
                    lineHeight: 1.05,
                    fontWeight: 850,
                    letterSpacing: "-0.04em",
                    color: "#ffffff !important",
                  }}
                >
                  A smarter way
                  <br />

                  <Box
                    component="span"
                    sx={{
                      color: "#d9f5e9 !important",
                    }}
                  >
                    to manage files.
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
                  Create your workspace and start identifying
                  redundant content before it consumes more
                  storage.
                </Typography>
              </Box>

              {/* =====================================
                  FEATURE CARD
              ====================================== */}

              <Box
                sx={{
                  mt: {
                    xs: 3,
                    md: "auto",
                  },
                  pt: {
                    md: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    background:
                      "rgba(255,255,255,0.07)",
                    border:
                      "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 850,
                      color: "#ffffff !important",
                      letterSpacing: "0.02em",
                    }}
                  >
                    BUILT FOR CLARITY
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      fontSize: "0.73rem",
                      color: "#b7d5ca !important",
                      lineHeight: 1.6,
                    }}
                  >
                    Search, analyze and safely clean your
                    storage from one intelligent workspace.
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.8,
                      display: "grid",
                      gap: 1.1,
                    }}
                  >
                    {[
                      {
                        icon: <FileSearch size={15} />,
                        text: "Find duplicate files",
                      },
                      {
                        icon: <ShieldCheck size={15} />,
                        text: "Protect important files",
                      },
                      {
                        icon: <HardDrive size={15} />,
                        text: "Optimize storage",
                      },
                    ].map((item) => (
                      <Box
                        key={item.text}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#d4e9e1 !important",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1.7,
                            background:
                              "rgba(255,255,255,0.09)",
                            color: "#d4e9e1",
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
            </Box>
          </Box>

          {/* =====================================
              RIGHT REGISTRATION PANEL
          ====================================== */}

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

              {/* Page heading */}
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
                Create your account
              </Typography>

              <Typography
                sx={{
                  mt: 0.9,
                  color: "#71877e !important",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                }}
              >
                Set up your intelligent storage workspace in
                just a few seconds.
              </Typography>

              {/* =====================================
                  FORM
              ====================================== */}

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

                {/* Success */}
                {success && (
                  <Alert
                    severity="success"
                    icon={<CheckCircle2 size={19} />}
                    sx={{
                      mb: 2.2,
                      borderRadius: 2.2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {success}
                  </Alert>
                )}

                {/* Username */}
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
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

                    "& label.Mui-focused": {
                      color: "#16836A",
                    },
                  }}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
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

                    "& label.Mui-focused": {
                      color: "#16836A",
                    },
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Create a secure password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  disabled={loading}
                  helperText="Use at least 6 characters."
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

                    "& .MuiFormHelperText-root": {
                      ml: 0.3,
                      color: "#899a92 !important",
                      fontSize: "0.68rem",
                    },
                  }}
                />

                {/* Submit */}
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
                    "Create account"
                  )}
                </Button>

                {/* Login link */}
                <Typography
                  sx={{
                    textAlign: "center",
                    mt: 2.8,
                    color: "#7b8e86 !important",
                    fontSize: "0.8rem",
                  }}
                >
                  Already have an account?{" "}

                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate("/login")}
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
                    Sign in
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
                    color: "#8c9d95 !important",
                    fontSize: "0.68rem",
                  }}
                >
                  <ShieldCheck
                    size={14}
                    color="#16836A"
                  />

                  Your account is protected
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}