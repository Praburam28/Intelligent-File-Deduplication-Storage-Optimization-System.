import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  HardDrive,
  Hash,
  Info,
  Lock,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import type { FileRecord } from "../types";

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
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

function getHashStatusStyle(status: FileRecord["hash_status"]) {
  switch (status) {
    case "COMPLETED":
      return {
        background: "#dcfce7",
        color: "#166534",
        icon: <CheckCircle2 size={15} />,
      };

    case "PROCESSING":
      return {
        background: "#fef3c7",
        color: "#92400e",
        icon: <Upload size={15} />,
      };

    case "FAILED":
      return {
        background: "#fee2e2",
        color: "#991b1b",
        icon: <Info size={15} />,
      };

    default:
      return {
        background: "#e0f2fe",
        color: "#075985",
        icon: <Hash size={15} />,
      };
  }
}

function getFileIcon(extension?: string | null) {
  const ext = (extension || "").toLowerCase();

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)
  ) {
    return <FileImage size={30} />;
  }

  if (
    ["zip", "rar", "7z", "tar", "gz", "iso"].includes(ext)
  ) {
    return <FileArchive size={30} />;
  }

  if (
    ["txt", "pdf", "doc", "docx", "xls", "xlsx", "csv"].includes(ext)
  ) {
    return <FileText size={30} />;
  }

  return <File size={30} />;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "210px 1fr",
        },
        gap: 1.5,
        py: 1.8,
        borderBottom: "1px solid #edf2ed",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#648075",
          fontSize: "0.84rem",
          fontWeight: 700,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#16836A",
          }}
        >
          {icon}
        </Box>

        {label}
      </Box>

      <Box
        sx={{
          color: "#20372f",
          fontSize: "0.9rem",
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

function StatusBadge({
  children,
  background,
  color,
  icon,
}: {
  children: React.ReactNode;
  background: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.7,
        px: 1.4,
        py: 0.65,
        borderRadius: 999,
        background,
        color,
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.02em",
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

export default function FileDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [file, setFile] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadFile = async () => {
    if (!id) {
      setError("Invalid file ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get<FileRecord>(`/files/${id}`);
      setFile(response.data);
    } catch (error: any) {
      console.error("Unable to load file details:", error);

      setError(
        error?.response?.data?.detail ||
          "Unable to load file details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFile();
  }, [id]);

  const handleDownload = async () => {
    if (!file) {
      return;
    }

    try {
      setError("");
      setSuccess("");

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

      setSuccess("File download started.");
    } catch (error: any) {
      console.error("File download failed:", error);

      setError(
        error?.response?.data?.detail ||
          "Unable to download file.",
      );
    }
  };

  const handleDelete = async () => {
    if (!file) {
      return;
    }

    if (file.is_protected) {
      setError("Protected files cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${file.original_filename}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await api.delete(`/files/${file.id}`, {
        params: {
          deletion_reason: "Deleted from File Details",
        },
      });

      setSuccess("File deleted successfully.");

      setTimeout(() => {
        navigate("/files");
      }, 1000);
    } catch (error: any) {
      console.error("File deletion failed:", error);

      setError(
        error?.response?.data?.detail ||
          "Unable to delete file.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7faf7",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress
            size={38}
            thickness={4}
            sx={{ color: "#16836A" }}
          />

          <Box
            sx={{
              color: "#648075",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Loading file details...
          </Box>
        </Box>
      </Box>
    );
  }

  if (!file) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          background: "#f7faf7",
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 760,
            mx: "auto",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid #e2ebe4",
            background: "#ffffff",
            boxShadow: "0 15px 40px rgba(30, 70, 55, 0.07)",
          }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2.5,
            }}
          >
            {error || "File not found."}
          </Alert>

          <Button
            startIcon={<ArrowLeft size={18} />}
            variant="outlined"
            onClick={() => navigate("/files")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#16836A",
              color: "#16836A",
            }}
          >
            Back to My Files
          </Button>
        </Paper>
      </Box>
    );
  }

  const statusStyle = getHashStatusStyle(file.hash_status);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        background:
          "linear-gradient(180deg, #f5faf6 0%, #fbfdfb 45%, #ffffff 100%)",
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 2, md: 3.5 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          maxWidth: 1250,
          mx: "auto",
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowLeft size={17} />}
          onClick={() => navigate("/files")}
          sx={{
            mb: 2,
            px: 0,
            color: "#58746a",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              background: "transparent",
              color: "#16836A",
            },
          }}
        >
          Back to My Files
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              md: "row",
            },
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
              File Details
            </Box>

            <Box
              component="p"
              sx={{
                margin: "7px 0 0",
                color: "#6b8178",
                fontSize: "0.92rem",
              }}
            >
              Review file information, integrity status and storage impact.
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge
              background="#dcfce7"
              color="#166534"
              icon={<CheckCircle2 size={14} />}
            >
              FILE AVAILABLE
            </StatusBadge>

            {file.is_duplicate && (
              <StatusBadge
                background="#fff3d6"
                color="#9a6500"
                icon={<Copy size={14} />}
              >
                DUPLICATE
              </StatusBadge>
            )}

            {file.is_protected && (
              <StatusBadge
                background="#e8eefb"
                color="#31558f"
                icon={<ShieldCheck size={14} />}
              >
                PROTECTED
              </StatusBadge>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1250,
          mx: "auto",
        }}
      >
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

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
            }}
          >
            {success}
          </Alert>
        )}

        {/* Main file card */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid #dfeae2",
            background: "#ffffff",
            boxShadow: "0 18px 50px rgba(26, 70, 54, 0.07)",
          }}
        >
          {/* File hero */}
          <Box
            sx={{
              p: { xs: 2.5, md: 4 },
              background:
                "linear-gradient(135deg, #eff9f2 0%, #ffffff 65%)",
              borderBottom: "1px solid #e5eee7",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                gap: 2,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Box
                sx={{
                  width: 66,
                  height: 66,
                  flexShrink: 0,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(145deg, #16836A, #0f654f)",
                  color: "#ffffff",
                  boxShadow:
                    "0 10px 25px rgba(22, 131, 106, 0.22)",
                }}
              >
                {getFileIcon(file.file_extension)}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    color: "#183b30",
                    fontSize: {
                      xs: "1.1rem",
                      md: "1.4rem",
                    },
                    fontWeight: 800,
                    lineHeight: 1.35,
                    wordBreak: "break-word",
                  }}
                >
                  {file.original_filename}
                </Box>

                <Box
                  sx={{
                    mt: 0.8,
                    color: "#748980",
                    fontSize: "0.78rem",
                    wordBreak: "break-all",
                  }}
                >
                  File ID: {file.id}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.8,
                }}
              >
                <StatusBadge
                  background={statusStyle.background}
                  color={statusStyle.color}
                  icon={statusStyle.icon}
                >
                  {file.hash_status}
                </StatusBadge>
              </Box>
            </Box>
          </Box>

          {/* Quick stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
              borderBottom: "1px solid #e8efe9",
            }}
          >
            <Box
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRight: {
                  xs: "1px solid #e8efe9",
                  md: "1px solid #e8efe9",
                },
                borderBottom: {
                  xs: "1px solid #e8efe9",
                  md: "none",
                },
              }}
            >
              <Box
                sx={{
                  color: "#789087",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                File Size
              </Box>

              <Box
                sx={{
                  mt: 0.7,
                  color: "#183b30",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                }}
              >
                {formatBytes(file.file_size)}
              </Box>
            </Box>

            <Box
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRight: {
                  md: "1px solid #e8efe9",
                },
                borderBottom: {
                  xs: "1px solid #e8efe9",
                  md: "none",
                },
              }}
            >
              <Box
                sx={{
                  color: "#789087",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                File Type
              </Box>

              <Box
                sx={{
                  mt: 0.7,
                  color: "#183b30",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  wordBreak: "break-word",
                }}
              >
                {file.mime_type || "Unknown"}
              </Box>
            </Box>

            <Box
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRight: {
                  xs: "1px solid #e8efe9",
                  md: "1px solid #e8efe9",
                },
              }}
            >
              <Box
                sx={{
                  color: "#789087",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Duplicate
              </Box>

              <Box
                sx={{
                  mt: 0.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: file.is_duplicate
                    ? "#a56a00"
                    : "#16836A",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                }}
              >
                {file.is_duplicate ? (
                  <>
                    <Copy size={17} />
                    Yes
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    No
                  </>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                p: { xs: 2, md: 2.5 },
              }}
            >
              <Box
                sx={{
                  color: "#789087",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Protection
              </Box>

              <Box
                sx={{
                  mt: 0.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: file.is_protected
                    ? "#31558f"
                    : "#16836A",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                }}
              >
                {file.is_protected ? (
                  <>
                    <Lock size={17} />
                    Protected
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Normal
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Details */}
          <Box
            sx={{
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Box
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e8f6ef",
                  color: "#16836A",
                }}
              >
                <Info size={18} />
              </Box>

              <Box
                sx={{
                  color: "#183b30",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                }}
              >
                File Information
              </Box>
            </Box>

            <Box>
              <DetailRow
                icon={<FileText size={17} />}
                label="Original Filename"
                value={file.original_filename}
              />

              <DetailRow
                icon={<HardDrive size={17} />}
                label="Stored Filename"
                value={file.stored_filename}
              />

              <DetailRow
                icon={<HardDrive size={17} />}
                label="File Size"
                value={formatBytes(file.file_size)}
              />

              <DetailRow
                icon={<File size={17} />}
                label="MIME Type"
                value={file.mime_type || "Unknown"}
              />

              <DetailRow
                icon={<FileText size={17} />}
                label="File Extension"
                value={file.file_extension || "Unknown"}
              />

              <DetailRow
                icon={<Hash size={17} />}
                label="Hash Status"
                value={file.hash_status}
              />

              <DetailRow
                icon={<Copy size={17} />}
                label="Duplicate"
                value={file.is_duplicate ? "Yes" : "No"}
              />

              <DetailRow
                icon={<ShieldCheck size={17} />}
                label="Protected"
                value={file.is_protected ? "Yes" : "No"}
              />

              <DetailRow
                icon={<Trash2 size={17} />}
                label="Deleted"
                value={file.is_deleted ? "Yes" : "No"}
              />

              <DetailRow
                icon={<CalendarDays size={17} />}
                label="Uploaded On"
                value={formatDate(file.created_at)}
              />
            </Box>

            {/* Storage / status notice */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2.5,
                background: file.is_duplicate
                  ? "#fff8e8"
                  : "#eff9f3",
                border: file.is_duplicate
                  ? "1px solid #f2dfad"
                  : "1px solid #d6ecdd",
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  mt: 0.15,
                  color: file.is_duplicate
                    ? "#a56a00"
                    : "#16836A",
                }}
              >
                {file.is_duplicate ? (
                  <Copy size={19} />
                ) : (
                  <ShieldCheck size={19} />
                )}
              </Box>

              <Box>
                <Box
                  sx={{
                    color: "#27483c",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                  }}
                >
                  {file.is_duplicate
                    ? "Duplicate file detected"
                    : "Unique file"}
                </Box>

                <Box
                  sx={{
                    mt: 0.35,
                    color: "#71877e",
                    fontSize: "0.8rem",
                    lineHeight: 1.6,
                  }}
                >
                  {file.is_duplicate
                    ? "This file has matching content with another stored file and may contribute to potential storage savings."
                    : "No duplicate status is currently associated with this file."}
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 1.25,
                flexWrap: "wrap",
                mt: 3.5,
                pt: 3,
                borderTop: "1px solid #e5eee7",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Download size={18} />}
                onClick={handleDownload}
                sx={{
                  minHeight: 44,
                  px: 2.3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #16836A, #0f654f)",
                  boxShadow:
                    "0 8px 20px rgba(22, 131, 106, 0.18)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #126f5a, #0b5543)",
                    boxShadow:
                      "0 10px 24px rgba(22, 131, 106, 0.24)",
                  },
                }}
              >
                Download File
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  deleting ? (
                    <CircularProgress
                      size={17}
                      color="inherit"
                    />
                  ) : (
                    <Trash2 size={18} />
                  )
                }
                onClick={handleDelete}
                disabled={
                  file.is_protected ||
                  deleting ||
                  file.is_deleted
                }
                sx={{
                  minHeight: 44,
                  px: 2.3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: file.is_protected
                    ? "#d5ded9"
                    : "#d97777",
                  color: file.is_protected
                    ? "#82938c"
                    : "#c03939",
                  "&:hover": {
                    borderColor: "#c03939",
                    background: "#fff5f5",
                  },
                }}
              >
                {deleting ? "Deleting..." : "Delete File"}
              </Button>

              <Button
                variant="text"
                startIcon={<ArrowLeft size={17} />}
                onClick={() => navigate("/files")}
                sx={{
                  minHeight: 44,
                  px: 1.8,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#60786f",
                  "&:hover": {
                    background: "#f0f6f2",
                    color: "#16836A",
                  },
                }}
              >
                Back to Files
              </Button>
            </Box>

            {file.is_protected && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#6d7f78",
                  fontSize: "0.78rem",
                }}
              >
                <Lock size={15} />
                This file is protected and cannot be deleted.
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}