import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";
import InterviewPage from "./pages/InterviewPage";
import InterviewsPage from "./pages/InterviewsPage";
import ResumePage from "./pages/ResumePage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./component/wrapperComponent/ProtectedRoute";
import PublicRoute from "./component/wrapperComponent/PublicRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <InterviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews/:id"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute>
              <ReportDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;