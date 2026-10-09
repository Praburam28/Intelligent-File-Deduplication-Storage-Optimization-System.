import {
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useEffect, useState } from "react";

import api from "../api/axios";

import type {
  FileListResponse,
  FileRecord,
  StorageStatistics,
} from "../types";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024),
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    index === 0 ? 0 : 2,
  )} ${units[index]}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/* -------------------------------------------------------
   Stat Card
------------------------------------------------------- */

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  accent: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  accent,
}: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",

        p: 2.5,

        minHeight: 145,

        borderRadius: 3,

        backgroundColor: "#FFFFFF",

        border: "1px solid #E4E7E1",

        boxShadow:
          "0 4px 18px rgba(32,41,35,0.045)",

        transition:
          "transform .2s ease, box-shadow .2s ease",

        "&:hover": {
          transform: "translateY(-3px)",

          boxShadow:
            "0 10px 28px rgba(32,41,35,0.08)",
        },
      }}
    >
      {/* Decorative accent */}
      <Box
        sx={{
          position: "absolute",

          width: 90,
          height: 90,

          right: -35,
          top: -35,

          borderRadius: "50%",

          backgroundColor: `${accent}10`,
        }}
      />

      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          position: "relative",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#7A847E",

              fontSize: "0.75rem",

              fontWeight: 750,

              letterSpacing: "0.02em",

              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "#202923",

              fontSize: {
                xs: "1.45rem",
                sm: "1.65rem",
              },

              fontWeight: 850,

              lineHeight: 1.15,

              letterSpacing: "-0.025em",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              color: "#89938D",

              fontSize: "0.72rem",

              mt: 1,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 43,
            height: 43,

            borderRadius: 2,

            display: "grid",
            placeItems: "center",

            backgroundColor: `${accent}12`,

            color: accent,

            fontSize: "1.15rem",

            fontWeight: 800,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

/* -------------------------------------------------------
   File Row
------------------------------------------------------- */

function FileRow({
  file,
}: {
  file: FileRecord;
}) {
  return (
    <Box
      sx={{
        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: 2,

        py: 1.5,

        borderBottom:
          "1px solid #ECEEEA",

        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          minWidth: 0,

          flex: 1,

          display: "flex",

          alignItems: "center",

          gap: 1.2,
        }}
      >
        {/* File icon */}
        <Box
          sx={{
            width: 35,
            height: 35,

            flexShrink: 0,

            borderRadius: 1.7,

            display: "grid",
            placeItems: "center",

            backgroundColor: "#EEF7F4",

            color: "#16836A",

            fontSize: 15,

            fontWeight: 800,
          }}
        >
          ▱
        </Box>

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              color: "#34413A",

              fontWeight: 650,

              fontSize: "0.83rem",

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",
            }}
          >
            {file.original_filename}
          </Typography>

          <Typography
            sx={{
              color: "#9AA39E",

              fontSize: "0.69rem",

              mt: 0.25,
            }}
          >
            {formatDate(file.created_at)}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          color: "#526057",

          fontSize: "0.78rem",

          fontWeight: 700,

          whiteSpace: "nowrap",
        }}
      >
        {formatBytes(file.file_size)}
      </Typography>
    </Box>
  );
}

/* -------------------------------------------------------
   Section Header
------------------------------------------------------- */

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          color: "#202923",

          fontSize: "1.02rem",

          fontWeight: 800,

          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#89938D",

          fontSize: "0.74rem",

          mt: 0.35,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

/* -------------------------------------------------------
   Dashboard
------------------------------------------------------- */

export default function Dashboard() {
  const [statistics, setStatistics] =
    useState<StorageStatistics | null>(null);

  const [recentFiles, setRecentFiles] =
    useState<FileRecord[]>([]);

  const [largestFiles, setLargestFiles] =
    useState<FileRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statisticsResponse,
          recentResponse,
          largestResponse,
        ] = await Promise.all([
          api.get<StorageStatistics>(
            "/files/storage/statistics",
          ),

          api.get<FileListResponse>(
            "/files/",
            {
              params: {
                page: 1,
                page_size: 5,
                sort_by: "created_at",
                sort_order: "desc",
              },
            },
          ),

          api.get<FileListResponse>(
            "/files/",
            {
              params: {
                page: 1,
                page_size: 5,
                sort_by: "file_size",
                sort_order: "desc",
              },
            },
          ),
        ]);

        setStatistics(
          statisticsResponse.data,
        );

        setRecentFiles(
          recentResponse.data.files,
        );

        setLargestFiles(
          largestResponse.data.files,
        );
      } catch (error: any) {
        console.error(
          "Unable to load dashboard:",
          error,
        );

        setError(
          error?.response?.data?.detail ||
            "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* -----------------------------------------------------
     Loading
  ----------------------------------------------------- */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 120px)",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={34}
          thickness={4}
          sx={{
            color: "#16836A",
          }}
        />
      </Box>
    );
  }

  /* -----------------------------------------------------
     Error
  ----------------------------------------------------- */

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,

          borderRadius: 3,

          backgroundColor: "#FFFFFF",

          border:
            "1px solid #F0D2D2",

          boxShadow:
            "0 4px 18px rgba(32,41,35,0.04)",
        }}
      >
        <Typography
          sx={{
            color: "#9F3030",

            fontWeight: 700,
          }}
        >
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!statistics) {
    return null;
  }

  /* -----------------------------------------------------
     Calculations
  ----------------------------------------------------- */

  const totalStorage =
    statistics.total_storage;

  const duplicateStorage =
    statistics.duplicate_storage;

  const uniqueStorage = Math.max(
    totalStorage - duplicateStorage,
    0,
  );

  const duplicatePercentage =
    totalStorage > 0
      ? (duplicateStorage /
          totalStorage) *
        100
      : 0;

  const storageChartData = [
    {
      name: "Unique Storage",
      value: uniqueStorage,
    },

    {
      name: "Duplicate Storage",
      value: duplicateStorage,
    },
  ].filter(
    (item) => item.value > 0,
  );

  /* -----------------------------------------------------
     UI
  ----------------------------------------------------- */

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* Page heading */}
      <Box
        sx={{
          mb: 3.5,

          display: {
            xs: "block",
            md: "flex",
          },

          alignItems: "flex-end",

          justifyContent: "space-between",

          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              margin: 0,

              color: "#202923",

              fontSize: {
                xs: "1.7rem",
                md: "2.15rem",
              },

              fontWeight: 850,

              letterSpacing:
                "-0.035em",
            }}
          >
            Storage overview
          </Typography>

          <Typography
            component="p"
            sx={{
              margin: "7px 0 0",

              color: "#77827B",

              fontSize: "0.82rem",
            }}
          >
            Monitor files, duplicates and
            reclaimable storage from one
            place.
          </Typography>
        </Box>

        {/* Optimization indicator */}
        <Box
          sx={{
            mt: {
              xs: 2,
              md: 0,
            },

            display: "inline-flex",

            alignItems: "center",

            gap: 0.8,

            px: 1.5,
            py: 0.8,

            borderRadius: 2,

            backgroundColor: "#E8F5F0",

            border:
              "1px solid #D4EBE2",
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,

              borderRadius: "50%",

              backgroundColor:
                "#16836A",
            }}
          />

          <Typography
            sx={{
              color: "#0F5F4D",

              fontSize: "0.72rem",

              fontWeight: 750,
            }}
          >
            Storage optimization active
          </Typography>
        </Box>
      </Box>

      {/* Statistics */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <StatCard
          title="Total Files"
          value={String(
            statistics.total_files,
          )}
          description="Files in your storage"
          icon="▤"
          accent="#16836A"
        />

        <StatCard
          title="Total Storage"
          value={formatBytes(
            statistics.total_storage,
          )}
          description="Storage currently consumed"
          icon="◫"
          accent="#347A8F"
        />

        <StatCard
          title="Duplicate Files"
          value={String(
            statistics.duplicate_files,
          )}
          description="Redundant files detected"
          icon="◈"
          accent="#D99A2B"
        />

        <StatCard
          title="Duplicate Storage"
          value={formatBytes(
            statistics.duplicate_storage,
          )}
          description="Storage used by duplicates"
          icon="◉"
          accent="#C96B45"
        />

        <StatCard
          title="Potential Savings"
          value={formatBytes(
            statistics.potential_savings,
          )}
          description="Storage you could reclaim"
          icon="↓"
          accent="#16836A"
        />
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.05fr 0.95fr",
          },

          gap: 3,

          mb: 3,
        }}
      >
        {/* Storage distribution */}
        <Paper
          elevation={0}
          sx={{
            p: 3,

            minHeight: 360,

            borderRadius: 3,

            backgroundColor: "#FFFFFF",

            border:
              "1px solid #E4E7E1",

            boxShadow:
              "0 4px 18px rgba(32,41,35,0.045)",
          }}
        >
          <SectionHeader
            title="Storage distribution"
            subtitle="Unique content compared with redundant content"
          />

          {storageChartData.length > 0 ? (
            <Box
              sx={{
                height: 245,

                mt: 1,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={storageChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={3}
                    stroke="none"
                  >
                    <Cell
                      fill="#16836A"
                    />

                    <Cell
                      fill="#D99A2B"
                    />
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatBytes(
                        Number(value),
                      )
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                height: 245,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                color: "#929B95",

                fontSize: "0.82rem",
              }}
            >
              No storage data available yet.
            </Box>
          )}

          <Box
            sx={{
              display: "flex",

              justifyContent: "center",

              gap: 3,

              fontSize: "0.75rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    "#16836A",
                }}
              />

              <Typography
                sx={{
                  color: "#647068",
                  fontSize: "0.75rem",
                }}
              >
                Unique
              </Typography>
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
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    "#D99A2B",
                }}
              />

              <Typography
                sx={{
                  color: "#647068",
                  fontSize: "0.75rem",
                }}
              >
                Duplicate
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Storage overview */}
        <Paper
          elevation={0}
          sx={{
            p: 3,

            minHeight: 360,

            borderRadius: 3,

            backgroundColor: "#FFFFFF",

            border:
              "1px solid #E4E7E1",

            boxShadow:
              "0 4px 18px rgba(32,41,35,0.045)",
          }}
        >
          <SectionHeader
            title="Optimization overview"
            subtitle="How much of your storage is occupied by duplicates"
          />

          {/* Percentage */}
          <Box
            sx={{
              mt: 2,

              display: "flex",

              alignItems: "flex-end",

              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#202923",

                  fontSize: "2.1rem",

                  fontWeight: 850,

                  lineHeight: 1,
                }}
              >
                {duplicatePercentage.toFixed(
                  1,
                )}
                %
              </Typography>

              <Typography
                sx={{
                  color: "#89938D",

                  fontSize: "0.72rem",

                  mt: 0.6,
                }}
              >
                storage is duplicated
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#16836A",

                fontSize: "0.75rem",

                fontWeight: 800,
              }}
            >
              {formatBytes(
                statistics.potential_savings,
              )}{" "}
              reclaimable
            </Typography>
          </Box>

          {/* Progress bar */}
          <Box
            sx={{
              mt: 2.5,

              height: 14,

              borderRadius: 10,

              backgroundColor: "#E9EDE9",

              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${Math.min(
                  duplicatePercentage,
                  100,
                )}%`,

                height: "100%",

                borderRadius: 10,

                background:
                  "linear-gradient(90deg, #D99A2B 0%, #C96B45 100%)",

                transition:
                  "width .5s ease",
              }}
            />
          </Box>

          {/* Summary cards */}
          <Box
            sx={{
              mt: 3,

              display: "grid",

              gridTemplateColumns:
                "repeat(3, 1fr)",

              gap: 1.2,
            }}
          >
            <Box
              sx={{
                p: 1.5,

                borderRadius: 2,

                backgroundColor:
                  "#F5F7F4",

                border:
                  "1px solid #E8EBE6",
              }}
            >
              <Typography
                sx={{
                  color: "#89938D",

                  fontSize: "0.68rem",
                }}
              >
                Total storage
              </Typography>

              <Typography
                sx={{
                  color: "#34413A",

                  fontSize: "1rem",

                  fontWeight: 800,

                  mt: 0.5,
                }}
              >
                {formatBytes(
                  totalStorage,
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,

                borderRadius: 2,

                backgroundColor:
                  "#FFF7E6",

                border:
                  "1px solid #F5E6C4",
              }}
            >
              <Typography
                sx={{
                  color: "#9A7735",

                  fontSize: "0.68rem",
                }}
              >
                Duplicate
              </Typography>

              <Typography
                sx={{
                  color: "#8A5B0C",

                  fontSize: "1rem",

                  fontWeight: 800,

                  mt: 0.5,
                }}
              >
                {formatBytes(
                  duplicateStorage,
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,

                borderRadius: 2,

                backgroundColor:
                  "#EAF6F1",

                border:
                  "1px solid #D8ECE3",
              }}
            >
              <Typography
                sx={{
                  color: "#64877D",

                  fontSize: "0.68rem",
                }}
              >
                Savings
              </Typography>

              <Typography
                sx={{
                  color: "#0F5F4D",

                  fontSize: "1rem",

                  fontWeight: 800,

                  mt: 0.5,
                }}
              >
                {formatBytes(
                  statistics.potential_savings,
                )}
              </Typography>
            </Box>
          </Box>

          {/* Recommendation */}
          <Box
            sx={{
              mt: 2,

              p: 1.5,

              display: "flex",

              gap: 1,

              alignItems: "flex-start",

              borderRadius: 2,

              backgroundColor:
                "#F8F6EF",

              border:
                "1px solid #ECE7D9",
            }}
          >
            <Typography
              sx={{
                color: "#D99A2B",

                fontSize: "1rem",

                lineHeight: 1,
              }}
            >
              ◆
            </Typography>

            <Typography
              sx={{
                color: "#68736D",

                fontSize: "0.7rem",

                lineHeight: 1.5,
              }}
            >
              Review your duplicate groups
              before deleting redundant files
              to safely reclaim storage.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Recent + Largest */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },

          gap: 3,
        }}
      >
        {/* Recent uploads */}
        <Paper
          elevation={0}
          sx={{
            p: 3,

            borderRadius: 3,

            backgroundColor: "#FFFFFF",

            border:
              "1px solid #E4E7E1",

            boxShadow:
              "0 4px 18px rgba(32,41,35,0.045)",
          }}
        >
          <SectionHeader
            title="Recent uploads"
            subtitle="Your latest files added to storage"
          />

          {recentFiles.length > 0 ? (
            recentFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
              />
            ))
          ) : (
            <Box
              sx={{
                py: 4,

                textAlign: "center",

                color: "#929B95",

                fontSize: "0.82rem",
              }}
            >
              No files uploaded yet.
            </Box>
          )}
        </Paper>

        {/* Largest files */}
        <Paper
          elevation={0}
          sx={{
            p: 3,

            borderRadius: 3,

            backgroundColor: "#FFFFFF",

            border:
              "1px solid #E4E7E1",

            boxShadow:
              "0 4px 18px rgba(32,41,35,0.045)",
          }}
        >
          <SectionHeader
            title="Largest files"
            subtitle="Files currently consuming the most storage"
          />

          {largestFiles.length > 0 ? (
            largestFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
              />
            ))
          ) : (
            <Box
              sx={{
                py: 4,

                textAlign: "center",

                color: "#929B95",

                fontSize: "0.82rem",
              }}
            >
              No files uploaded yet.
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}