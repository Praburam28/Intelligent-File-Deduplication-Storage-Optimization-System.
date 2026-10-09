import {
  Alert,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  File,
  HardDrive,
  History,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api/axios";
import type {
  DeletionHistory as DeletionHistoryRecord,
  DeletionHistoryListResponse,
} from "../types";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 2.2, md: 2.7 },
        borderRadius: 3.5,
        border: "1px solid #dfeae2",
        background: "#ffffff",
        boxShadow: "0 12px 35px rgba(26, 70, 54, 0.06)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -22,
          top: -22,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "#eff8f2",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              color: "#70867d",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            {label}
          </Box>

          <Box
            sx={{
              mt: 1,
              color: "#183b30",
              fontSize: {
                xs: "1.55rem",
                md: "1.8rem",
              },
              lineHeight: 1.1,
              fontWeight: 850,
              letterSpacing: "-0.025em",
            }}
          >
            {value}
          </Box>

          <Box
            sx={{
              mt: 0.8,
              color: "#80938c",
              fontSize: "0.76rem",
              lineHeight: 1.5,
            }}
          >
            {description}
          </Box>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#e8f6ef",
            color: "#16836A",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
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
          width: 76,
          height: 76,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#edf8f1",
          color: "#16836A",
          mb: 2,
        }}
      >
        <History size={34} />
      </Box>

      <Box
        sx={{
          color: "#24473a",
          fontSize: "1.15rem",
          fontWeight: 800,
        }}
      >
        No deleted files
      </Box>

      <Box
        sx={{
          maxWidth: 430,
          mt: 0.8,
          color: "#7a8e86",
          fontSize: "0.85rem",
          lineHeight: 1.65,
        }}
      >
        Your file deletion history will appear here after files are safely
        removed from your storage.
      </Box>
    </Box>
  );
}

function HistoryRow({
  record,
}: {
  record: DeletionHistoryRecord;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "0.55fr 2fr 1fr 1.5fr 1.4fr",
        },
        gap: {
          xs: 1.3,
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
            mb: 0.35,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          ID
        </Box>

        #{record.id}
      </Box>

      {/* File */}
      <Box
        sx={{
          minWidth: 0,
          pr: { md: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#edf8f1",
              color: "#16836A",
            }}
          >
            <File size={18} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box
              title={record.filename}
              sx={{
                color: "#25473c",
                fontSize: "0.85rem",
                fontWeight: 750,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.filename}
            </Box>

            <Box
              sx={{
                mt: 0.35,
                color: "#899b94",
                fontSize: "0.68rem",
              }}
            >
              File ID: {record.file_id}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Size */}
      <Box
        sx={{
          color: "#536f64",
          fontSize: "0.82rem",
          fontWeight: 700,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.35,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Size
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <HardDrive size={15} color="#16836A" />
          {formatBytes(record.file_size)}
        </Box>
      </Box>

      {/* Reason */}
      <Box
        sx={{
          color: "#60786e",
          fontSize: "0.78rem",
          lineHeight: 1.5,
          pr: { md: 2 },
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.35,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Deletion Reason
        </Box>

        {record.deletion_reason || "No reason provided"}
      </Box>

      {/* Deleted at */}
      <Box
        sx={{
          color: "#60786e",
          fontSize: "0.76rem",
          lineHeight: 1.5,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            mb: 0.35,
            color: "#91a39c",
            fontSize: "0.66rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Deleted At
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

          {formatDate(record.deleted_at)}
        </Box>
      </Box>
    </Box>
  );
}

export default function DeletionHistory() {
  const [history, setHistory] = useState<DeletionHistoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeletionHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<DeletionHistoryListResponse>(
          "/files/history/deletions",
        );

      setHistory(response.data.history);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error(
        "Unable to load deletion history:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to load deletion history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletionHistory();
  }, []);

  const totalStorageFreed = history.reduce(
    (sum, record) => sum + record.file_size,
    0,
  );

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
          maxWidth: 1350,
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
              Deletion History
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
              Review files that were safely deleted and monitor the storage
              recovered from your file management activity.
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
            SAFE DELETION LOG
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

        {/* Summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            mb: 3,
            maxWidth: 850,
          }}
        >
          <StatCard
            icon={<Trash2 size={22} />}
            label="Deleted Files"
            value={String(total)}
            description="Files recorded in the deletion history"
          />

          <StatCard
            icon={<HardDrive size={22} />}
            label="Storage Freed"
            value={formatBytes(totalStorageFreed)}
            description="Combined size of deleted files"
          />
        </Box>

        {/* History table */}
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
          {/* Table header */}
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
                <History size={18} />
              </Box>

              <Box>
                <Box
                  sx={{
                    color: "#23473b",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                  }}
                >
                  Deletion Records
                </Box>

                <Box
                  sx={{
                    mt: 0.2,
                    color: "#84978f",
                    fontSize: "0.72rem",
                  }}
                >
                  {total} {total === 1 ? "record" : "records"} available
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
              <Clock3 size={14} />
              Audit trail
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 380,
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
                sx={{ color: "#16836A" }}
              />

              <Box
                sx={{
                  color: "#70867d",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Loading deletion history...
              </Box>
            </Box>
          ) : history.length === 0 ? (
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
                    md: 950,
                  },
                  display: {
                    xs: "none",
                    md: "grid",
                  },
                  gridTemplateColumns:
                    "0.55fr 2fr 1fr 1.5fr 1.4fr",
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
                <Box>File</Box>
                <Box>Size</Box>
                <Box>Deletion Reason</Box>
                <Box>Deleted At</Box>
              </Box>

              {history.map((record) => (
                <HistoryRow
                  key={record.id}
                  record={record}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* Security note */}
        {!loading && history.length > 0 && (
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
            <CheckCircle2
              size={15}
              color="#16836A"
              style={{ marginTop: 1 }}
            />

            Deletion activity is retained as part of the system audit trail
            for safe storage management and accountability.
          </Box>
        )}
      </Box>
    </Box>
  );
}