import { useRef, useState } from "react";
import { useResume, invalidateResume } from "../../../../../services/apiQueries";

export const useResumeStatus = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data, isLoading: loading } = useResume();
  const resume = data?.resume ?? null;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleViewResume = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/view`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to open resume");
      }

      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("View resume error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to open resume"
      );
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      setError("Only PDF and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.reason || result.message || "Failed to upload resume"
        );
      }

      invalidateResume();
    } catch (err) {
      console.error("Resume upload error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload resume"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return {
    fileInputRef,
    resume,
    loading,
    uploading,
    error,
    formatDate,
    handleUploadClick,
    handleViewResume,
    handleFileChange,
  };
};
