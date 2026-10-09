import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import type {
  FileListResponse,
  FileRecord,
  FileUploadResponse,
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
   Hash status
------------------------------------------------------- */

function getHashStatusStyle(
  status: FileRecord["hash_status"],
) {
  switch (status) {
    case "COMPLETED":
      return {
        background: "#E6F5EF",
        color: "#0F5F4D",
        dot: "#16836A",
      };

    case "PROCESSING":
      return {
        background: "#FFF4D8",
        color: "#8A5B0C",
        dot: "#D99A2B",
      };

    case "FAILED":
      return {
        background: "#FCEAEA",
        color: "#9F3030",
        dot: "#C94B4B",
      };

    default:
      return {
        background: "#EDF2F0",
        color: "#5E6A63",
        dot: "#87938C",
      };
  }
}

/* -------------------------------------------------------
   Files page
------------------------------------------------------- */

export default function Files() {
  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [files, setFiles] =
    useState<FileRecord[]>([]);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* Search */

  const [search, setSearch] =
    useState("");

  /* Filters */

  const [fileType, setFileType] =
    useState("");

  const [minSize, setMinSize] =
    useState("");

  const [maxSize, setMaxSize] =
    useState("");

  const [duplicateFilter, setDuplicateFilter] =
    useState("");

  const [hashStatus, setHashStatus] =
    useState("");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  /* Sorting */

  const [sortBy, setSortBy] =
    useState<
      | "created_at"
      | "file_size"
      | "original_filename"
    >("created_at");

  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  /* Pagination */

  const [page, setPage] =
    useState(1);

  const pageSize = 10;

  /* -----------------------------------------------------
     Load files
  ----------------------------------------------------- */

  const loadFiles = async (
    requestedPage = page,
  ) => {
    try {
      setLoading(true);
      setError("");

      const params: Record<
        string,
        string | number | boolean
      > = {
        page: requestedPage,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (fileType) {
        params.file_type = fileType;
      }

      if (minSize) {
        params.min_size = Number(minSize);
      }

      if (maxSize) {
        params.max_size = Number(maxSize);
      }

      if (duplicateFilter) {
        params.is_duplicate =
          duplicateFilter === "true";
      }

      if (hashStatus) {
        params.hash_status = hashStatus;
      }

      if (dateFrom) {
        params.date_from =
          `${dateFrom}T00:00:00`;
      }

      if (dateTo) {
        params.date_to =
          `${dateTo}T23:59:59`;
      }

      const response =
        await api.get<FileListResponse>(
          "/files/",
          {
            params,
          },
        );

      setFiles(response.data.files);
      setTotal(response.data.total);

      setTotalPages(
        response.data.total_pages,
      );
    } catch (error: any) {
      console.error(
        "Unable to load files:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to load files.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(page);
  }, [
    page,
    sortBy,
    sortOrder,
  ]);

  /* -----------------------------------------------------
     Search / filters
  ----------------------------------------------------- */

  const handleSearch = () => {
    setPage(1);
    loadFiles(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFileType("");
    setMinSize("");
    setMaxSize("");
    setDuplicateFilter("");
    setHashStatus("");
    setDateFrom("");
    setDateTo("");

    setSortBy("created_at");
    setSortOrder("desc");
    setPage(1);

    setTimeout(() => {
      loadFiles(1);
    }, 0);
  };

  /* -----------------------------------------------------
     Upload
  ----------------------------------------------------- */

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "uploaded_file",
        selectedFile,
      );

      const response =
        await api.post<FileUploadResponse>(
          "/files/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          },
        );

      setSuccess(
        response.data.message ||
          "File uploaded successfully.",
      );

      setPage(1);

      await loadFiles(1);
    } catch (error: any) {
      console.error(
        "File upload failed:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to upload file.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* -----------------------------------------------------
     Download
  ----------------------------------------------------- */

  const handleDownload = async (
    file: FileRecord,
  ) => {
    try {
      setError("");

      const response =
        await api.get(
          `/files/${file.id}/download`,
          {
            responseType: "blob",
          },
        );

      const blob = new Blob([
        response.data,
      ]);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        file.original_filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error(
        "File download failed:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to download file.",
      );
    }
  };

  /* -----------------------------------------------------
     Delete
  ----------------------------------------------------- */

  const handleDelete = async (
    file: FileRecord,
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${file.original_filename}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/files/${file.id}`,
        {
          params: {
            deletion_reason:
              "Deleted from My Files",
          },
        },
      );

      setSuccess(
        "File deleted successfully.",
      );

      await loadFiles(page);
    } catch (error: any) {
      console.error(
        "File deletion failed:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to delete file.",
      );
    }
  };

  /* -----------------------------------------------------
     Select handlers
  ----------------------------------------------------- */

  const handleFileTypeChange = (
    event: SelectChangeEvent,
  ) => {
    setFileType(event.target.value);
  };

  const handleDuplicateChange = (
    event: SelectChangeEvent,
  ) => {
    setDuplicateFilter(
      event.target.value,
    );
  };

  const handleHashStatusChange = (
    event: SelectChangeEvent,
  ) => {
    setHashStatus(
      event.target.value,
    );
  };

  const handleSortByChange = (
    event: SelectChangeEvent,
  ) => {
    setSortBy(
      event.target.value as
        | "created_at"
        | "file_size"
        | "original_filename",
    );

    setPage(1);
  };

  const handleSortOrderChange = (
    event: SelectChangeEvent,
  ) => {
    setSortOrder(
      event.target.value as
        | "asc"
        | "desc",
    );

    setPage(1);
  };

  /* -----------------------------------------------------
     Render
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
          display: "flex",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          justifyContent:
            "space-between",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          gap: 2,

          mb: 3,
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
            My Files
          </Typography>

          <Typography
            component="p"
            sx={{
              margin: "7px 0 0",

              color: "#77827B",

              fontSize: "0.82rem",
            }}
          >
            Manage, search, filter and
            organize your uploaded files.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleUploadClick}
          disabled={uploading}
          sx={{
            minWidth: 145,

            minHeight: 43,

            borderRadius: 2,

            backgroundColor: "#16836A",

            color: "#FFFFFF",

            fontWeight: 750,

            "&:hover": {
              backgroundColor: "#0F5F4D",
            },
          }}
        >
          {uploading ? (
            <CircularProgress
              size={21}
              sx={{
                color: "#FFFFFF",
              }}
            />
          ) : (
            <>
              <Box
                component="span"
                sx={{
                  mr: 0.8,
                  fontSize: 17,
                }}
              >
                +
              </Box>
              Upload File
            </>
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileUpload}
        />
      </Box>

      {/* Messages */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
          }}
        >
          {success}
        </Alert>
      )}

      {/* Search / filters */}
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },

          mb: 3,

          borderRadius: 3,

          backgroundColor: "#FFFFFF",

          border:
            "1px solid #E4E7E1",

          boxShadow:
            "0 4px 18px rgba(32,41,35,0.045)",
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#202923",

                fontSize: "1rem",

                fontWeight: 800,
              }}
            >
              Search & Filters
            </Typography>

            <Typography
              sx={{
                color: "#89938D",

                fontSize: "0.7rem",

                mt: 0.35,
              }}
            >
              Narrow down your files using
              multiple criteria.
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.1,
              py: 0.55,

              borderRadius: 1.5,

              backgroundColor:
                "#F0F5F2",

              color: "#607068",

              fontSize: "0.68rem",

              fontWeight: 700,
            }}
          >
            {total} files
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },

            gap: 1.7,
          }}
        >
          <TextField
            label="Search filename"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            fullWidth
          />

          <Select
            value={fileType}
            onChange={
              handleFileTypeChange
            }
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              All File Types
            </MenuItem>

            <MenuItem value=".pdf">
              PDF
            </MenuItem>

            <MenuItem value=".txt">
              TXT
            </MenuItem>

            <MenuItem value=".doc">
              DOC
            </MenuItem>

            <MenuItem value=".docx">
              DOCX
            </MenuItem>

            <MenuItem value=".jpg">
              JPG
            </MenuItem>

            <MenuItem value=".jpeg">
              JPEG
            </MenuItem>

            <MenuItem value=".png">
              PNG
            </MenuItem>

            <MenuItem value=".zip">
              ZIP
            </MenuItem>
          </Select>

          <TextField
            label="Minimum size (bytes)"
            type="number"
            value={minSize}
            onChange={(event) =>
              setMinSize(event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Maximum size (bytes)"
            type="number"
            value={maxSize}
            onChange={(event) =>
              setMaxSize(event.target.value)
            }
            fullWidth
          />

          <Select
            value={duplicateFilter}
            onChange={
              handleDuplicateChange
            }
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              All Files
            </MenuItem>

            <MenuItem value="true">
              Duplicates Only
            </MenuItem>

            <MenuItem value="false">
              Unique Only
            </MenuItem>
          </Select>

          <Select
            value={hashStatus}
            onChange={
              handleHashStatusChange
            }
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              All Hash Status
            </MenuItem>

            <MenuItem value="PENDING">
              Pending
            </MenuItem>

            <MenuItem value="PROCESSING">
              Processing
            </MenuItem>

            <MenuItem value="COMPLETED">
              Completed
            </MenuItem>

            <MenuItem value="FAILED">
              Failed
            </MenuItem>
          </Select>

          <TextField
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(event) =>
              setDateFrom(
                event.target.value,
              )
            }
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Date to"
            type="date"
            value={dateTo}
            onChange={(event) =>
              setDateTo(event.target.value)
            }
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Box>

        {/* Sorting */}
        <Box
          sx={{
            display: "flex",

            flexWrap: "wrap",

            alignItems: "center",

            gap: 1.5,

            mt: 2,
          }}
        >
          <Typography
            sx={{
              color: "#68736D",

              fontSize: "0.75rem",

              fontWeight: 750,
            }}
          >
            Sort by
          </Typography>

          <Select
            value={sortBy}
            onChange={
              handleSortByChange
            }
            size="small"
            sx={{
              minWidth: 170,
            }}
          >
            <MenuItem value="created_at">
              Upload Date
            </MenuItem>

            <MenuItem value="file_size">
              File Size
            </MenuItem>

            <MenuItem value="original_filename">
              Filename
            </MenuItem>
          </Select>

          <Select
            value={sortOrder}
            onChange={
              handleSortOrderChange
            }
            size="small"
            sx={{
              minWidth: 130,
            }}
          >
            <MenuItem value="desc">
              Descending
            </MenuItem>

            <MenuItem value="asc">
              Ascending
            </MenuItem>
          </Select>

          <Box
            sx={{
              flex: 1,
              minWidth: 10,
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: "#16836A",

              "&:hover": {
                backgroundColor: "#0F5F4D",
              },
            }}
          >
            Apply Filters
          </Button>

          <Button
            variant="outlined"
            onClick={
              handleResetFilters
            }
            sx={{
              borderColor: "#D5DCD7",

              color: "#526057",

              "&:hover": {
                borderColor: "#16836A",
                backgroundColor:
                  "#EEF7F4",
              },
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Results summary */}
      <Box
        sx={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            color: "#69736D",

            fontSize: "0.78rem",
          }}
        >
          Showing{" "}
          <strong
            style={{
              color: "#34413A",
            }}
          >
            {files.length}
          </strong>{" "}
          of{" "}
          <strong
            style={{
              color: "#34413A",
            }}
          >
            {total}
          </strong>{" "}
          files
        </Typography>
      </Box>

      {/* File table */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",

          overflow: "hidden",

          borderRadius: 3,

          backgroundColor: "#FFFFFF",

          border:
            "1px solid #E4E7E1",

          boxShadow:
            "0 4px 18px rgba(32,41,35,0.045)",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 320,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <CircularProgress
              sx={{
                color: "#16836A",
              }}
            />
          </Box>
        ) : files.length === 0 ? (
          <Box
            sx={{
              minHeight: 320,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              flexDirection: "column",

              color: "#929B95",

              px: 3,

              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,

                borderRadius: 3,

                display: "grid",
                placeItems: "center",

                backgroundColor:
                  "#EEF7F4",

                color: "#16836A",

                fontSize: "1.8rem",

                mb: 1.5,
              }}
            >
              ▱
            </Box>

            <Typography
              sx={{
                fontSize: "1rem",

                fontWeight: 800,

                color: "#34413A",
              }}
            >
              No files found
            </Typography>

            <Typography
              sx={{
                fontSize: "0.78rem",

                mt: 0.5,

                color: "#89938D",
              }}
            >
              Try changing your search or
              filter options.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",

              overflowX: "auto",
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                minWidth: 950,

                display: "grid",

                gridTemplateColumns:
                  "2.2fr 0.8fr 0.8fr 1fr 0.9fr 1.3fr",

                alignItems: "center",

                px: 3,

                py: 1.8,

                backgroundColor:
                  "#F3F5F1",

                borderBottom:
                  "1px solid #E2E6E0",

                color: "#68736D",

                fontSize: "0.68rem",

                fontWeight: 800,

                letterSpacing: "0.06em",

                textTransform:
                  "uppercase",
              }}
            >
              <Box>File</Box>
              <Box>Size</Box>
              <Box>Type</Box>
              <Box>Hash Status</Box>
              <Box>Date</Box>
              <Box>Actions</Box>
            </Box>

            {files.map((file) => {
              const statusStyle =
                getHashStatusStyle(
                  file.hash_status,
                );

              return (
                <Box
                  key={file.id}
                  sx={{
                    minWidth: 950,

                    display: "grid",

                    gridTemplateColumns:
                      "2.2fr 0.8fr 0.8fr 1fr 0.9fr 1.3fr",

                    alignItems: "center",

                    px: 3,

                    py: 1.8,

                    borderBottom:
                      "1px solid #ECEEEA",

                    transition:
                      "background-color .15s ease",

                    "&:last-child": {
                      borderBottom:
                        "none",
                    },

                    "&:hover": {
                      backgroundColor:
                        "#F8FAF7",
                    },
                  }}
                >
                  {/* File */}
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

                        gap: 1.1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,

                          flexShrink: 0,

                          borderRadius: 1.7,

                          display: "grid",
                          placeItems: "center",

                          backgroundColor:
                            file.is_duplicate
                              ? "#FFF4D8"
                              : "#EAF6F1",

                          color:
                            file.is_duplicate
                              ? "#A96F12"
                              : "#16836A",

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
                        <Box
                          component="button"
                          type="button"
                          onClick={() =>
                            navigate(
                              `/files/${file.id}`,
                            )
                          }
                          sx={{
                            display: "block",

                            width: "100%",

                            padding: 0,

                            border: 0,

                            background:
                              "transparent",

                            color: "#0F5F4D",

                            fontWeight: 750,

                            fontSize:
                              "0.82rem",

                            textAlign: "left",

                            cursor: "pointer",

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",

                            "&:hover": {
                              color: "#16836A",
                              textDecoration:
                                "underline",
                            },
                          }}
                        >
                          {
                            file.original_filename
                          }
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",

                            flexWrap:
                              "wrap",

                            gap: 0.5,

                            mt: 0.55,
                          }}
                        >
                          {file.is_duplicate && (
                            <Box
                              sx={{
                                px: 0.8,
                                py: 0.2,

                                borderRadius: 1,

                                backgroundColor:
                                  "#FFF3D9",

                                color:
                                  "#8A5B0C",

                                fontSize:
                                  "0.62rem",

                                fontWeight: 750,
                              }}
                            >
                              Duplicate
                            </Box>
                          )}

                          {file.is_protected && (
                            <Box
                              sx={{
                                px: 0.8,
                                py: 0.2,

                                borderRadius: 1,

                                backgroundColor:
                                  "#FCEAEA",

                                color:
                                  "#9F3030",

                                fontSize:
                                  "0.62rem",

                                fontWeight: 750,
                              }}
                            >
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
                      color: "#526057",

                      fontSize:
                        "0.78rem",

                      fontWeight: 650,
                    }}
                  >
                    {formatBytes(
                      file.file_size,
                    )}
                  </Typography>

                  {/* Type */}
                  <Typography
                    sx={{
                      color: "#69736D",

                      fontSize:
                        "0.76rem",
                    }}
                  >
                    {file.file_extension ||
                      file.mime_type ||
                      "Unknown"}
                  </Typography>

                  {/* Hash status */}
                  <Box>
                    <Box
                      component="span"
                      sx={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        gap: 0.65,

                        px: 1,

                        py: 0.5,

                        borderRadius: 1.5,

                        background:
                          statusStyle.background,

                        color:
                          statusStyle.color,

                        fontSize:
                          "0.64rem",

                        fontWeight: 750,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,

                          borderRadius:
                            "50%",

                          backgroundColor:
                            statusStyle.dot,
                        }}
                      />

                      {file.hash_status}
                    </Box>
                  </Box>

                  {/* Date */}
                  <Typography
                    sx={{
                      color: "#69736D",

                      fontSize:
                        "0.74rem",
                    }}
                  >
                    {formatDate(
                      file.created_at,
                    )}
                  </Typography>

                  {/* Actions */}
                  <Box
                    sx={{
                      display: "flex",

                      gap: 0.8,

                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleDownload(
                          file,
                        )
                      }
                      sx={{
                        minWidth: 70,

                        minHeight: 33,

                        borderRadius: 1.5,

                        borderColor:
                          "#D5DCD7",

                        color: "#526057",

                        fontSize:
                          "0.67rem",

                        "&:hover": {
                          borderColor:
                            "#16836A",

                          color:
                            "#0F5F4D",

                          backgroundColor:
                            "#EEF7F4",
                        },
                      }}
                    >
                      Download
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleDelete(
                          file,
                        )
                      }
                      disabled={
                        file.is_protected
                      }
                      sx={{
                        minWidth: 58,

                        minHeight: 33,

                        borderRadius: 1.5,

                        fontSize:
                          "0.67rem",

                        "&:hover": {
                          backgroundColor:
                            "#FCEAEA",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Pagination */}
      {totalPages > 0 && (
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "center",

            alignItems: "center",

            gap: 2,

            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            disabled={page <= 1}
            onClick={() =>
              setPage((current) =>
                Math.max(
                  current - 1,
                  1,
                ),
              )
            }
            sx={{
              borderColor: "#D5DCD7",

              color: "#526057",

              "&:hover": {
                borderColor: "#16836A",

                backgroundColor:
                  "#EEF7F4",
              },
            }}
          >
            Previous
          </Button>

          <Box
            sx={{
              px: 1.5,
              py: 0.7,

              borderRadius: 1.5,

              backgroundColor:
                "#FFFFFF",

              border:
                "1px solid #E4E7E1",

              color: "#526057",

              fontSize: "0.78rem",

              fontWeight: 700,
            }}
          >
            Page {page} of{" "}
            {totalPages}
          </Box>

          <Button
            variant="outlined"
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage((current) =>
                Math.min(
                  current + 1,
                  totalPages,
                ),
              )
            }
            sx={{
              borderColor: "#D5DCD7",

              color: "#526057",

              "&:hover": {
                borderColor: "#16836A",

                backgroundColor:
                  "#EEF7F4",
              },
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}