import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CircleX,
  ClipboardList,
  Database,
  File,
  Filter,
  History,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api/axios";
import type {
  AuditLog,
  AuditLogListResponse,
} from "../types";

function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionStyle(action: string) {
  const normalized = action.toUpperCase();

  if (
    normalized.includes("DELETE") ||
    normalized.includes("REMOVE")
  ) {
    return {
      background: "#fff0ef",
      color: "#b63b35",
      icon: <CircleX size={14} />,
    };
  }

  if (
    normalized.includes("UPLOAD") ||
    normalized.includes("CREATE") ||
    normalized.includes("REGISTER")
  ) {
    return {
      background: "#eaf7ef",
      color: "#16734f",
      icon: <CheckCircle2 size={14} />,
    };
  }

  if (
    normalized.includes("LOGIN") ||
    normalized.includes("AUTH")
  ) {
    return {
      background: "#eef3ff",
      color: "#4664a8",
      icon: <ShieldCheck size={14} />,
    };
  }

  if (
    normalized.includes("UPDATE") ||
    normalized.includes("EDIT")
  ) {
    return {
      background: "#fff6df",
      color: "#996500",
      icon: <Activity size={14} />,
    };
  }

  return {
    background: "#edf7f4",
    color: "#16836A",
    icon: <Activity size={14} />,
  };
}

function getEntityIcon(entityType?: string | null) {
  const normalized = (entityType || "").toLowerCase();

  if (normalized.includes("user")) {
    return <User size={16} />;
  }

  if (normalized.includes("file")) {
    return <File size={16} />;
  }

  if (
    normalized.includes("group") ||
    normalized.includes("duplicate")
  ) {
    return <Database size={16} />;
  }

  return <ClipboardList size={16} />;
}

function EmptyState() {
  return (
    <Box
      sx={{
        minHeight: 390,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 78,
          height: 78,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#edf8f1",
          color: "#16836A",
          mb: 2,
        }}
      >
        <History size={35} />
      </Box>

      <Box
        sx={{
          color: "#24473a",
          fontSize: "1.15rem",
          fontWeight: 800,
        }}
      >
        No audit logs found
      </Box>

      <Box
        sx={{
          maxWidth: 440,
          mt: 0.8,
          color: "#7a8e86",
          fontSize: "0.85rem",
          lineHeight: 1.65,
        }}
      >
        Account and system activities matching your filter will appear here.
      </Box>
    </Box>
  );
}

function AuditRow({
  log,
}: {
  log: AuditLog;
}) {
  const actionStyle = getActionStyle(log.action);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "0.55fr 1.35fr 1.05fr 1fr 2.35fr 1.45fr",
        },
        gap: {
          xs: 1.5,
          md: 0,
        },
        alignItems: "center",
        px: { xs: 2, md: 3 },
        py: { xs: 2.2, md: 2.1 },
        borderBottom: "1px solid #edf2ed",
        transition: "background 0.2s ease",
        "&:hover": {
          background: "#f8fbf9",
        },
      }}
    >
      {/* ID */}
      <Box
        sx={{
          color: "#668077",
          fontSize: "0.8rem",
          fontWeight: 700,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          ID
        </Box>

        #{log.id}
      </Box>

      {/* Action */}
      <Box>
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Action
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.65,
            px: 1.15,
            py: 0.6,
            borderRadius: 1.8,
            background: actionStyle.background,
            color: actionStyle.color,
            fontSize: "0.69rem",
            fontWeight: 850,
            letterSpacing: "0.025em",
            maxWidth: "100%",
          }}
        >
          {actionStyle.icon}

          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {log.action}
          </Box>
        </Box>
      </Box>

      {/* Entity */}
      <Box
        sx={{
          minWidth: 0,
          color: "#536f64",
          fontSize: "0.8rem",
          fontWeight: 650,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Entity
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <Box
            sx={{
              color: "#16836A",
              display: "flex",
            }}
          >
            {getEntityIcon(log.entity_type)}
          </Box>

          {log.entity_type || "-"}
        </Box>
      </Box>

      {/* Entity ID */}
      <Box
        sx={{
          color: "#60786e",
          fontSize: "0.8rem",
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Entity ID
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            px: 1,
            py: 0.45,
            borderRadius: 1.5,
            background: "#f3f7f4",
            color: "#526b61",
            fontSize: "0.72rem",
            fontWeight: 700,
          }}
        >
          {log.entity_id ?? "-"}
        </Box>
      </Box>

      {/* Description */}
      <Box
        sx={{
          minWidth: 0,
          pr: { md: 2 },
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Description
        </Box>

        <Box
          title={log.description || ""}
          sx={{
            color: "#60786e",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: {
              xs: "normal",
              md: "nowrap",
            },
          }}
        >
          {log.description || "No description"}
        </Box>
      </Box>

      {/* Date */}
      <Box
        sx={{
          color: "#60786e",
          fontSize: "0.75rem",
          lineHeight: 1.5,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.4,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Date
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0.6,
          }}
        >
          <CalendarDays
            size={14}
            color="#16836A"
            style={{ marginTop: 2 }}
          />

          {formatDate(log.created_at)}
        </Box>
      </Box>
    </Box>
  );
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState("");

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string> = {};

      if (action.trim()) {
        params.action = action.trim().toUpperCase();
      }

      const response =
        await api.get<AuditLogListResponse>(
          "/audit-logs/",
          {
            params,
          },
        );

      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error(
        "Unable to load audit logs:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to load audit logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const handleFilter = () => {
    loadAuditLogs();
  };

  const handleClear = () => {
    setAction("");

    setTimeout(() => {
      loadAuditLogs();
    }, 0);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        background:
          "linear-gradient(180deg, #f5faf6 0%, #fbfdfb 48%, #ffffff 100%)",
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 2, md: 3.5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 3.5,
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box
              component="h1"
              sx={{
                margin: 0,
                color: "#17372d",
                fontSize: {
                  xs: "1.75rem",
                  md: "2.25rem",
                },
                fontWeight: 850,
                letterSpacing: "-0.035em",
              }}
            >
              Audit Logs
            </Box>

            <Box
              component="p"
              sx={{
                margin: "8px 0 0",
                maxWidth: 650,
                color: "#6b8178",
                fontSize: "0.92rem",
                lineHeight: 1.6,
              }}
            >
              Track important activities and security events performed in
              your account.
            </Box>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.8,
              borderRadius: 999,
              background: "#eaf6ef",
              color: "#16836A",
              fontSize: "0.72rem",
              fontWeight: 800,
            }}
          >
            <ShieldCheck size={15} />
            ACTIVITY MONITOR
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filter card */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.3 },
            borderRadius: 3.5,
            border: "1px solid #dfeae2",
            background: "#ffffff",
            boxShadow: "0 12px 35px rgba(26, 70, 54, 0.055)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "stretch",
                md: "center",
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 1.3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#24473a",
                fontSize: "0.84rem",
                fontWeight: 800,
                mr: {
                  md: 0.5,
                },
              }}
            >
              <Box
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e8f6ef",
                  color: "#16836A",
                }}
              >
                <Filter size={17} />
              </Box>

              Filter activity
            </Box>

            <TextField
              label="Action"
              placeholder="Example: DELETE_FILE"
              value={action}
              onChange={(event) =>
                setAction(event.target.value)
              }
              size="small"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleFilter();
                }
              }}
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 310,
                },
                flex: {
                  md: 1,
                },
                maxWidth: {
                  md: 430,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.3,
                  background: "#fbfdfb",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#16836A",
                },
                "& label.Mui-focused": {
                  color: "#16836A",
                },
              }}
            />

            <Box
              component="button"
              type="button"
              onClick={handleFilter}
              sx={{
                minHeight: 40,
                border: 0,
                borderRadius: 2.3,
                px: 2.4,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
                background:
                  "linear-gradient(135deg, #16836A, #0f654f)",
                color: "#ffffff",
                fontFamily: "inherit",
                fontSize: "0.82rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow:
                  "0 7px 18px rgba(22, 131, 106, 0.16)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #126f5a, #0b5543)",
                },
              }}
            >
              <Search size={16} />
              Filter
            </Box>

            <Box
              component="button"
              type="button"
              onClick={handleClear}
              sx={{
                minHeight: 40,
                border: "1px solid #d6e2da",
                borderRadius: 2.3,
                px: 2.2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.7,
                background: "#ffffff",
                color: "#60786e",
                fontFamily: "inherit",
                fontSize: "0.82rem",
                fontWeight: 750,
                cursor: "pointer",
                "&:hover": {
                  background: "#f5faf6",
                  borderColor: "#bcd5c7",
                },
              }}
            >
              <X size={15} />
              Clear
            </Box>

            <Box
              sx={{
                ml: {
                  xs: 0,
                  md: "auto",
                },
                px: 1.4,
                py: 0.8,
                borderRadius: 2,
                background: "#f3f8f4",
                color: "#70867d",
                fontSize: "0.76rem",
                whiteSpace: "nowrap",
              }}
            >
              Total Logs:{" "}
              <Box
                component="span"
                sx={{
                  color: "#16836A",
                  fontWeight: 850,
                }}
              >
                {total}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Logs table */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 3.5,
            border: "1px solid #dfeae2",
            background: "#ffffff",
            boxShadow: "0 15px 45px rgba(26, 70, 54, 0.065)",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: "1px solid #e5eee7",
              background: "#fbfdfb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.1,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e8f6ef",
                  color: "#16836A",
                }}
              >
                <ClipboardList size={18} />
              </Box>

              <Box>
                <Box
                  sx={{
                    color: "#23473b",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                  }}
                >
                  Activity Records
                </Box>

                <Box
                  sx={{
                    mt: 0.2,
                    color: "#84978f",
                    fontSize: "0.72rem",
                  }}
                >
                  System and account activity
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                alignItems: "center",
                gap: 0.6,
                color: "#789087",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              <Activity size={14} />
              Live records
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 390,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <CircularProgress
                size={36}
                thickness={4}
                sx={{
                  color: "#16836A",
                }}
              />

              <Box
                sx={{
                  color: "#70867d",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Loading audit logs...
              </Box>
            </Box>
          ) : logs.length === 0 ? (
            <EmptyState />
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
              }}
            >
              {/* Desktop header */}
              <Box
                sx={{
                  minWidth: {
                    xs: 0,
                    md: 1100,
                  },
                  display: {
                    xs: "none",
                    md: "grid",
                  },
                  gridTemplateColumns:
                    "0.55fr 1.35fr 1.05fr 1fr 2.35fr 1.45fr",
                  alignItems: "center",
                  px: 3,
                  py: 1.8,
                  background: "#f4f9f5",
                  borderBottom: "1px solid #e4ede6",
                  color: "#70867d",
                  fontSize: "0.68rem",
                  fontWeight: 850,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <Box>ID</Box>
                <Box>Action</Box>
                <Box>Entity</Box>
                <Box>Entity ID</Box>
                <Box>Description</Box>
                <Box>Date</Box>
              </Box>

              {logs.map((log) => (
                <AuditRow
                  key={log.id}
                  log={log}
                />
              ))}
            </Box>
          )}
        </Paper>

        {!loading && logs.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              color: "#81938b",
              fontSize: "0.74rem",
              lineHeight: 1.55,
            }}
          >
            <ShieldCheck
              size={15}
              color="#16836A"
              style={{ marginTop: 1 }}
            />

            Audit records help maintain visibility and accountability for
            important account and system activities.
          </Box>
        )}
      </Box>
    </Box>
  );
}