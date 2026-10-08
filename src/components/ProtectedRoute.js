import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);

  // IF USER NOT FOUND
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!Array.isArray(allowedRoles) || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
