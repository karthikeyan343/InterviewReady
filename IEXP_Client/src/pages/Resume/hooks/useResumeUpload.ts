import React, { useRef, useState } from "react";
import { useResume, invalidateResume } from "../../../services/apiQueries";

export const useResumeUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading: loading, error: queryError, refetch } = useResume();
  const resume = data?.resume ?? null;

  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [error, setError] = useState(
    queryError
      ? queryError instanceof Error
        ? queryError.message
        : "Failed to load resume."
      : ""
  );
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("token");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

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

      const formData = new FormData();
      formData.append("resume", file);

      const token = getToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/upload`,
        {
          method: "POST",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: formData,
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData?.reason ||
          resData?.message ||
          "Failed to upload resume."
        );
      }

      invalidateResume();
      setMessage(resData.message || "Resume uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload resume."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleViewResume = async () => {
    try {
      setViewing(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/view`,
        {
          method: "GET",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.message || "Failed to open resume.");
      }

      window.open(resData.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to open resume."
      );
    } finally {
      setViewing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    resume,
    loading,
    uploading,
    viewing,
    error,
    message,
    refetch,
    handleUpload,
    handleViewResume,
    triggerFileInput,
  };
};
