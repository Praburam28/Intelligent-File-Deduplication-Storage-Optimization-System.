import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  File,
  FolderOpen,
  HardDrive,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  Tag,
} from "lucide-react";

import api from "../api/axios";

import type {
  DuplicateCheckResponse,
  DuplicateGroup,
  DuplicateGroupListResponse,
  FileRecord,
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
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getHashStatusStyle(status: FileRecord["hash_status"]) {
  switch (status) {
    case "COMPLETED":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "PROCESSING":
      return {
        background: "#fef3c7",
        color: "#92400e",
      };

    case "FAILED":
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };

    default:
      return {
        background: "#e0f2fe",
        color: "#075985",
      };
  }
}

function FileRow({
  file,
  isOriginal,
  onDownload,
}: {
  file: FileRecord;
  isOriginal: boolean;
  onDownload: (file: FileRecord) => void;
}) {
  const statusStyle = getHashStatusStyle(file.hash_status);

  return (
    <Box
      sx={{
        minWidth: 900,
        display: "grid",
        gridTemplateColumns: "2fr 0.9fr 0.9fr 1fr 1.1fr 0.9fr",
        alignItems: "center",
        px: 3,
        py: 2,
        borderBottom: "1px solid #e8eee9",
        "&:hover": {
          background: "#f7fbf8",
        },
      }}
    >
      {/* File name */}
      <Box sx={{ minWidth: 0, pr: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              background: "#e8f5ef",
              color: "#16836a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <File size={17} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              title={file.original_filename}
              sx={{
                color: "#193b31",
                fontWeight: 700,
                fontSize: "0.86rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.original_filename}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 0.6,
                flexWrap: "wrap",
                mt: 0.5,
              }}
            >
              {isOriginal && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 0.9,
                    py: 0.2,
                    borderRadius: 10,
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  Original
                </Box>
              )}

              {file.is_duplicate && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 0.9,
                    py: 0.2,
                    borderRadius: 10,
                    background: "#fff4df",
                    color: "#a16207",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  Duplicate
                </Box>
              )}

              {file.is_protected && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.35,
                    px: 0.9,
                    py: 0.2,
                    borderRadius: 10,
                    background: "#fef3c7",
                    color: "#92400e",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  <Lock size={10} />
                  Protected
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Size */}
      <Typography
        sx={{
          color: "#45645a",
          fontSize: "0.82rem",
          fontWeight: 600,
        }}
      >
        {formatBytes(file.file_size)}
      </Typography>

      {/* Type */}
      <Typography
        sx={{
          color: "#607d72",
          fontSize: "0.8rem",
        }}
      >
        {file.file_extension || file.mime_type || "Unknown"}
      </Typography>

      {/* Hash */}
      <Box>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.45,
            borderRadius: 10,
            background: statusStyle.background,
            color: statusStyle.color,
            fontSize: "0.66rem",
            fontWeight: 700,
          }}
        >
          {file.hash_status === "COMPLETED" && (
            <CheckCircle2 size={12} />
          )}

          {file.hash_status}
        </Box>
      </Box>

      {/* Date */}
      <Typography
        sx={{
          color: "#607d72",
          fontSize: "0.75rem",
        }}
      >
        {formatDate(file.created_at)}
      </Typography>

      {/* Download */}
      <Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Download size={15} />}
          onClick={() => onDownload(file)}
          sx={{
            minWidth: 105,
            textTransform: "none",
            borderRadius: 1.5,
            borderColor: "#b7d8ca",
            color: "#16836a",
            fontSize: "0.72rem",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#16836a",
              background: "#eef8f3",
            },
          }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
}

export default function DuplicateGroupDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<DuplicateGroup | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloading, setReloading] = useState(false);

  const loadGroupDetails = async () => {
    if (!id) {
      setError("Invalid duplicate group ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const groupsResponse =
        await api.get<DuplicateGroupListResponse>(
          "/files/duplicate-groups",
        );

      const selectedGroup =
        groupsResponse.data.groups.find(
          (item) => item.id === Number(id),
        );

      if (!selectedGroup) {
        setError("Duplicate group not found.");
        setGroup(null);
        setFiles([]);
        return;
      }

      setGroup(selectedGroup);

      if (!selectedGroup.original_file_id) {
        setFiles([]);
        return;
      }

      const duplicateResponse =
        await api.post<DuplicateCheckResponse>(
          `/files/${selectedGroup.original_file_id}/check-duplicate`,
        );

      const duplicateFiles =
        duplicateResponse.data.duplicates || [];

      const originalFileResponse =
        await api.get<FileRecord>(
          `/files/${selectedGroup.original_file_id}`,
        );

      const originalFile =
        originalFileResponse.data;

      const allFiles: FileRecord[] = [
        originalFile,
        ...duplicateFiles.filter(
          (file) => file.id !== originalFile.id,
        ),
      ];

      setFiles(allFiles);
    } catch (err: any) {
      console.error(
        "Unable to load duplicate group details:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to load duplicate group details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [id]);

  const handleRefresh = async () => {
    try {
      setReloading(true);
      await loadGroupDetails();
    } finally {
      setReloading(false);
    }
  };

  const handleDownload = async (file: FileRecord) => {
    try {
      setError("");

      const response = await api.get(
        `/files/${file.id}/download`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = file.original_filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("File download failed:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to download file.",
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7faf8",
        }}
      >
        <CircularProgress
          sx={{
            color: "#16836a",
          }}
        />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          background: "#f7faf8",
          p: 3,
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error || "Duplicate group not found."}
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={17} />}
          onClick={() => navigate("/duplicates")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            borderColor: "#b7d8ca",
            color: "#16836a",
          }}
        >
          Back to Duplicates
        </Button>
      </Box>
    );
  }

  const originalFile =
    files.find(
      (file) =>
        file.id === group.original_file_id,
    ) || files[0];

  const totalStorage = files.reduce(
    (total, file) =>
      total + Number(file.file_size || 0),
    0,
  );

  const duplicateCount = Math.max(
    files.length - 1,
    0,
  );

  const originalSize = originalFile
    ? Number(originalFile.file_size || 0)
    : 0;

  const potentialSavings =
    duplicateCount * originalSize;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6faf7 0%, #eef6f1 100%)",
        px: {
          xs: 1.5,
          md: 3,
        },
        py: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          maxWidth: 1500,
          mx: "auto",
        }}
      >
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/duplicates")}
          sx={{
            mb: 2,
            color: "#557066",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              background: "#e7f2ec",
            },
          }}
        >
          Back to Duplicate Groups
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            borderRadius: 3,
            border: "1px solid #dce9e2",
            background: "#ffffff",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              gap: 2,
              flexWrap: "wrap",
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
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #16836a, #0f5f4d)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FolderOpen size={25} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.35rem",
                      md: "1.7rem",
                    },
                    fontWeight: 800,
                    color: "#173c31",
                    lineHeight: 1.2,
                  }}
                >
                  Duplicate Group #{group.id}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#71877d",
                    fontSize: "0.86rem",
                  }}
                >
                  Files sharing the same content hash
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={
                <RefreshCw
                  size={17}
                  style={{
                    animation: reloading
                      ? "spin 1s linear infinite"
                      : undefined,
                  }}
                />
              }
              onClick={handleRefresh}
              disabled={reloading}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                borderColor: "#b7d8ca",
                color: "#16836a",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "#16836a",
                  background: "#eef8f3",
                },
              }}
            >
              {reloading ? "Refreshing..." : "Refresh"}
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              border: "1px solid #dce9e2",
              background: "#ffffff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.7,
                  background: "#e8f5ef",
                  color: "#16836a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy size={20} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Files in Group
                </Typography>

                <Typography
                  sx={{
                    color: "#173c31",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                  }}
                >
                  {files.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              border: "1px solid #dce9e2",
              background: "#ffffff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.7,
                  background: "#edf5ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HardDrive size={20} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Storage Used
                </Typography>

                <Typography
                  sx={{
                    color: "#173c31",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                  }}
                >
                  {formatBytes(totalStorage)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              border: "1px solid #eadfc8",
              background: "#fffdf8",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.7,
                  background: "#fff1d6",
                  color: "#c27a0a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={20} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#8d8065",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Potential Savings
                </Typography>

                <Typography
                  sx={{
                    color: "#7a4b05",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                  }}
                >
                  {formatBytes(potentialSavings)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              border: "1px solid #dce9e2",
              background: "#ffffff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.7,
                  background: "#f0eaff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tag size={20} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Duplicate Files
                </Typography>

                <Typography
                  sx={{
                    color: "#173c31",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                  }}
                >
                  {duplicateCount}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Original File */}
        {originalFile && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              border: "1px solid #dce9e2",
              background: "#ffffff",
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <KeyRound
                size={18}
                color="#16836a"
              />

              <Typography
                sx={{
                  color: "#173c31",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                Original File
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Filename
                </Typography>

                <Typography
                  sx={{
                    color: "#234b3e",
                    fontWeight: 700,
                    mt: 0.4,
                    wordBreak: "break-word",
                  }}
                >
                  {originalFile.original_filename}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Size
                </Typography>

                <Typography
                  sx={{
                    color: "#234b3e",
                    fontWeight: 700,
                    mt: 0.4,
                  }}
                >
                  {formatBytes(originalFile.file_size)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#789087",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Uploaded
                </Typography>

                <Typography
                  sx={{
                    color: "#234b3e",
                    fontWeight: 700,
                    mt: 0.4,
                  }}
                >
                  {formatDate(originalFile.created_at)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Hash */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            border: "1px solid #dce9e2",
            background: "#ffffff",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.2,
            }}
          >
            <KeyRound
              size={18}
              color="#16836a"
            />

            <Typography
              sx={{
                color: "#173c31",
                fontWeight: 800,
              }}
            >
              Content Hash
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              background: "#f5f8f6",
              border: "1px solid #e1ebe5",
              overflowX: "auto",
            }}
          >
            <Typography
              component="code"
              sx={{
                color: "#49665c",
                fontSize: "0.76rem",
                fontFamily:
                  "Consolas, Monaco, monospace",
                wordBreak: "break-all",
              }}
            >
              Hash is available from the duplicate detection result.
            </Typography>
          </Box>
        </Paper>

        {/* Files */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2.5,
            border: "1px solid #dce9e2",
            background: "#ffffff",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.2,
              borderBottom: "1px solid #e8eee9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FolderOpen
                size={20}
                color="#16836a"
              />

              <Typography
                sx={{
                  color: "#173c31",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                }}
              >
                Files in This Group
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#789087",
                fontSize: "0.78rem",
              }}
            >
              {files.length} file
              {files.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          {files.length === 0 ? (
            <Box
              sx={{
                py: 8,
                px: 3,
                textAlign: "center",
              }}
            >
              <File
                size={42}
                color="#9ab5a9"
              />

              <Typography
                sx={{
                  mt: 1.5,
                  color: "#587267",
                  fontWeight: 700,
                }}
              >
                No files found in this group.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                overflowX: "auto",
              }}
            >
              {/* Table Header */}
              <Box
                sx={{
                  minWidth: 900,
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 0.9fr 0.9fr 1fr 1.1fr 0.9fr",
                  alignItems: "center",
                  px: 3,
                  py: 1.4,
                  background: "#f7faf8",
                  borderBottom:
                    "1px solid #e8eee9",
                }}
              >
                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  File
                </Typography>

                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Size
                </Typography>

                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Type
                </Typography>

                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Hash
                </Typography>

                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Uploaded
                </Typography>

                <Typography
                  sx={{
                    color: "#71877d",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Action
                </Typography>
              </Box>

              {files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  isOriginal={
                    file.id ===
                    group.original_file_id
                  }
                  onDownload={handleDownload}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* Footer information */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.8,
            color: "#789087",
            fontSize: "0.75rem",
          }}
        >
          <CalendarDays size={14} />
          Duplicate detection is based on
          content hash, not filename.
        </Box>
      </Box>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Box>
  );
}
