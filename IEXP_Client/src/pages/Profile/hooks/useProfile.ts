import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardData, User } from "../types";

export const useProfile = () => {
  const navigate = useNavigate();

  const [user] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (error) {
        console.error("Unable to read stored user:", error);
      }
    }
    return null;
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/interviews/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Profile data error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfileData();
  }, [navigate]);

  const displayName = user?.name?.trim() || "User";
  const email = user?.email?.trim() || "Email not available";

  const initials = useMemo(() => {
    const parts = displayName.split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [displayName]);

  const totalInterviews = dashboardData?.stats?.totalInterviews ?? 0;
  const completedInterviews = dashboardData?.stats?.completedInterviews ?? 0;
  const averageScore = dashboardData?.stats?.averageScore ?? 0;
  const resumeUploaded = dashboardData?.resume?.uploaded ?? false;

  return {
    displayName,
    email,
    initials,
    loading,
    totalInterviews,
    completedInterviews,
    averageScore,
    resumeUploaded,
    navigate,
  };
};
