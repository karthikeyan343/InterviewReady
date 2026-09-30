import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
