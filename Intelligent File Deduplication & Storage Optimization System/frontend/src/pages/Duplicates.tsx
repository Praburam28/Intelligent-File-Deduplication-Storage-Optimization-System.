import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  RefreshCw,
  Copy,
  HardDrive,
  Files,
  PiggyBank,
  ChevronRight,
  ShieldCheck,
  Hash,
  CalendarDays,
  Database,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import type {
  DuplicateGroup,
  DuplicateGroupListResponse,
} from "../types";

/* =========================================================
   Helpers
========================================================= */

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   Component
========================================================= */

export default function Duplicates() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     Load Duplicate Groups
  ======================================================= */

  const loadDuplicateGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<DuplicateGroupListResponse>(
          "/files/duplicate-groups"
        );

      setGroups(response.data.groups);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error(
        "Unable to load duplicate groups:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to load duplicate groups."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicateGroups();
  }, []);

  /* =======================================================
     Rebuild Groups
  ======================================================= */

  const handleRebuild = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to rebuild the duplicate groups?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRebuilding(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/files/duplicate-groups/rebuild"
      );

      setSuccess(
        response.data.message ||
          "Duplicate groups rebuilt successfully."
      );

      await loadDuplicateGroups();
    } catch (error: any) {
      console.error(
        "Unable to rebuild duplicate groups:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to rebuild duplicate groups."
      );
    } finally {
      setRebuilding(false);
    }
  };

  /* =======================================================
     Statistics
  ======================================================= */

  const totalStorage = groups.reduce(
    (sum, group) => sum + group.total_storage,
    0
  );

  const totalSavings = groups.reduce(
    (sum, group) => sum + group.potential_savings,
    0
  );

  const totalDuplicateFiles = groups.reduce(
    (sum, group) =>
      sum + Math.max(group.total_files - 1, 0),
    0
  );

  const averageSavings =
    totalStorage > 0
      ? Math.round((totalSavings / totalStorage) * 100)
      : 0;

  /* =======================================================
     Stat Card
  ======================================================= */

  const StatCard = ({
    icon,
    label,
    value,
    description,
    accent,
    background,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    description: string;
    accent: string;
    background: string;
  }) => (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        p: 2.5,
        minHeight: 150,
        background: "#ffffff",
        border: "1px solid #e6eee9",
        boxShadow:
          "0 8px 30px rgba(15, 95, 77, 0.07)",
        transition:
          "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 14px 36px rgba(15, 95, 77, 0.11)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 110,
          height: 110,
          right: -35,
          top: -35,
          borderRadius: "50%",
          background,
          opacity: 0.75,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              color: "#718078",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Box>

          <Box
            sx={{
              mt: 1,
              color: "#17372f",
              fontSize: {
                xs: "1.55rem",
                md: "1.8rem",
              },
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Box>

          <Box
            sx={{
              mt: 0.8,
              color: "#82908a",
              fontSize: "0.78rem",
            }}
          >
            {description}
          </Box>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background,
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );

  /* =======================================================
     Render
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        background:
          "linear-gradient(180deg, #f7faf7 0%, #f2f7f3 100%)",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
          lg: 3.5,
        },
      }}
    >
      {/* ===================================================
          Header
      =================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 0.8,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #dff5ec, #c9eadc)",
                color: "#0f6f59",
              }}
            >
              <Copy size={21} />
            </Box>

            <Box
              component="h1"
              sx={{
                margin: 0,
                color: "#17372f",
                fontSize: {
                  xs: "1.7rem",
                  md: "2.2rem",
                },
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Duplicate Files
            </Box>
          </Box>

          <Box
            component="p"
            sx={{
              margin: 0,
              color: "#718078",
              fontSize: "0.9rem",
              maxWidth: 620,
            }}
          >
            Find identical files, understand storage
            waste, and identify space that can safely be
            recovered.
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleRebuild}
          disabled={rebuilding}
          startIcon={
            rebuilding ? (
              <CircularProgress
                size={18}
                sx={{ color: "#ffffff" }}
              />
            ) : (
              <RefreshCw size={18} />
            )
          }
          sx={{
            minWidth: 170,
            minHeight: 44,
            borderRadius: 2.5,
            px: 2.2,
            textTransform: "none",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #16836a, #0f6f59)",
            boxShadow:
              "0 7px 18px rgba(22, 131, 106, 0.22)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #126f5a, #0b5d4a)",
              boxShadow:
                "0 9px 22px rgba(22, 131, 106, 0.28)",
            },
          }}
        >
          {rebuilding
            ? "Rebuilding..."
            : "Rebuild Groups"}
        </Button>
      </Box>

      {/* ===================================================
          Messages
      =================================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 2,
            borderRadius: 2.5,
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{
            mb: 2,
            borderRadius: 2.5,
          }}
        >
          {success}
        </Alert>
      )}

      {/* ===================================================
          Stats
      =================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          icon={<Copy size={21} />}
          label="Duplicate Groups"
          value={total}
          description="Unique groups detected"
          accent="#16836a"
          background="#e3f5ed"
        />

        <StatCard
          icon={<Files size={21} />}
          label="Duplicate Files"
          value={totalDuplicateFiles}
          description="Redundant copies found"
          accent="#c77b19"
          background="#fff2d8"
        />

        <StatCard
          icon={<HardDrive size={21} />}
          label="Duplicate Storage"
          value={formatBytes(totalStorage)}
          description="Storage currently consumed"
          accent="#a55a20"
          background="#fff0e3"
        />

        <StatCard
          icon={<PiggyBank size={21} />}
          label="Potential Savings"
          value={formatBytes(totalSavings)}
          description={`${averageSavings}% of duplicate storage`}
          accent="#0f8066"
          background="#dff5ec"
        />
      </Box>

      {/* ===================================================
          Insight Banner
      =================================================== */}

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: {
            xs: 2,
            md: 2.5,
          },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #effaf5 0%, #f9fcf9 100%)",
          border: "1px solid #d9eee5",
          boxShadow:
            "0 7px 25px rgba(15, 95, 77, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#d9f1e7",
              color: "#14765f",
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} />
          </Box>

          <Box>
            <Box
              sx={{
                color: "#1b493d",
                fontWeight: 800,
                fontSize: "0.92rem",
              }}
            >
              Storage optimization insight
            </Box>

            <Box
              sx={{
                mt: 0.35,
                color: "#718078",
                fontSize: "0.8rem",
              }}
            >
              Duplicate groups are identified using file
              content hashes, allowing identical content to
              be grouped even when filenames differ.
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ===================================================
          Groups
      =================================================== */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 4,
          background: "#ffffff",
          border: "1px solid #e3ebe6",
          boxShadow:
            "0 10px 35px rgba(15, 95, 77, 0.07)",
        }}
      >
        {/* Section Header */}

        <Box
          sx={{
            px: {
              xs: 2,
              md: 3,
            },
            py: 2.2,
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1.5,
            borderBottom: "1px solid #edf2ef",
          }}
        >
          <Box>
            <Box
              sx={{
                color: "#17372f",
                fontSize: "1rem",
                fontWeight: 800,
              }}
            >
              Duplicate Groups
            </Box>

            <Box
              sx={{
                mt: 0.35,
                color: "#82908a",
                fontSize: "0.78rem",
              }}
            >
              Click a group to inspect its files and
              duplicate details.
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.2,
              py: 0.65,
              borderRadius: 2,
              background: "#f2f7f4",
              color: "#4f6b61",
              fontSize: "0.76rem",
              fontWeight: 700,
            }}
          >
            <Database size={15} />
            {total} groups
          </Box>
        </Box>

        {/* Loading */}

        {loading ? (
          <Box
            sx={{
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <CircularProgress
              size={34}
              sx={{
                color: "#16836a",
              }}
            />

            <Box
              sx={{
                color: "#7c8c84",
                fontSize: "0.82rem",
              }}
            >
              Loading duplicate groups...
            </Box>
          </Box>
        ) : groups.length === 0 ? (
          /* =================================================
             Empty State
          ================================================= */

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
                background:
                  "linear-gradient(135deg, #e5f5ee, #d8eee5)",
                color: "#16836a",
                mb: 2,
              }}
            >
              <ShieldCheck size={34} />
            </Box>

            <Box
              sx={{
                color: "#1d4439",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              No duplicate groups found
            </Box>

            <Box
              sx={{
                mt: 0.8,
                color: "#82908a",
                fontSize: "0.84rem",
                maxWidth: 430,
                lineHeight: 1.6,
              }}
            >
              Your files currently have no detected
              duplicates. Upload more files or rebuild the
              groups to scan the latest content.
            </Box>

            <Button
              onClick={handleRebuild}
              disabled={rebuilding}
              startIcon={
                rebuilding ? (
                  <CircularProgress
                    size={16}
                    sx={{ color: "#16836a" }}
                  />
                ) : (
                  <RefreshCw size={16} />
                )
              }
              sx={{
                mt: 2.5,
                borderRadius: 2,
                textTransform: "none",
                color: "#126e59",
                fontWeight: 800,
                background: "#eaf6f0",
                "&:hover": {
                  background: "#dff1e8",
                },
              }}
            >
              Scan Again
            </Button>
          </Box>
        ) : (
          /* =================================================
             Table
          ================================================= */

          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: 1050,
              }}
            >
              {/* Table Header */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "0.65fr 1.9fr 0.75fr 1.1fr 1.15fr 1fr 1.1fr",
                  alignItems: "center",
                  px: 3,
                  py: 1.8,
                  background: "#f6f9f7",
                  borderBottom:
                    "1px solid #e7eeea",
                  color: "#718078",
                  fontSize: "0.69rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                }}
              >
                <Box>ID</Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.7,
                    }}
                  >
                    <Hash size={13} />
                    HASH
                  </Box>
                </Box>

                <Box>FILES</Box>

                <Box>TOTAL SIZE</Box>

                <Box>SAVINGS</Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                    }}
                  >
                    <CalendarDays size={13} />
                    CREATED
                  </Box>
                </Box>

                <Box>ORIGINAL</Box>
              </Box>

              {/* Rows */}

              {groups.map((group) => (
                <Box
                  key={group.id}
                  component="button"
                  type="button"
                  onClick={() =>
                    navigate(
                      `/duplicate-groups/${group.id}`
                    )
                  }
                  sx={{
                    minWidth: 1050,
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns:
                      "0.65fr 1.9fr 0.75fr 1.1fr 1.15fr 1fr 1.1fr",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                    border: 0,
                    borderBottom:
                      "1px solid #edf2ef",
                    background: "#ffffff",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition:
                      "background .18s ease",
                    "&:hover": {
                      background: "#f7fbf9",
                    },
                    "&:hover .group-arrow": {
                      opacity: 1,
                      transform:
                        "translateX(2px)",
                    },
                  }}
                >
                  {/* ID */}

                  <Box
                    sx={{
                      color: "#16836a",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                    }}
                  >
                    #{group.id}
                  </Box>

                  {/* Hash */}

                  <Box
                    sx={{
                      minWidth: 0,
                      pr: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: 1.8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#eef7f3",
                          color: "#43806e",
                          flexShrink: 0,
                        }}
                      >
                        <Hash size={15} />
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#36574c",
                          fontSize: "0.75rem",
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        }}
                        title={group.hash_id}
                      >
                        {group.hash_id}
                      </Box>
                    </Box>
                  </Box>

                  {/* Files */}

                  <Box>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 42,
                        px: 1,
                        py: 0.55,
                        borderRadius: 1.8,
                        background: "#fff2dd",
                        color: "#b36a13",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                      }}
                    >
                      {group.total_files}
                    </Box>
                  </Box>

                  {/* Total Size */}

                  <Box
                    sx={{
                      color: "#3b554c",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {formatBytes(
                      group.total_storage
                    )}
                  </Box>

                  {/* Savings */}

                  <Box>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1,
                        py: 0.55,
                        borderRadius: 1.7,
                        background: "#e5f6ee",
                        color: "#13755d",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                      }}
                    >
                      {formatBytes(
                        group.potential_savings
                      )}
                    </Box>
                  </Box>

                  {/* Created */}

                  <Box
                    sx={{
                      color: "#718078",
                      fontSize: "0.77rem",
                    }}
                  >
                    {formatDate(
                      group.created_at
                    )}
                  </Box>

                  {/* Original */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        color: "#527067",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                      }}
                    >
                      {group.original_file_id
                        ? `File #${group.original_file_id}`
                        : "Not set"}
                    </Box>

                    <ChevronRight
                      className="group-arrow"
                      size={17}
                      style={{
                        opacity: 0.35,
                        transition:
                          "all .18s ease",
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Footer */}

        {!loading && groups.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 1.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              background: "#fbfcfb",
              borderTop:
                "1px solid #edf2ef",
            }}
          >
            <Box
              sx={{
                color: "#82908a",
                fontSize: "0.76rem",
              }}
            >
              Showing {groups.length} duplicate group
              {groups.length === 1 ? "" : "s"}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "#527067",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={15} />
              Content-based detection
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}