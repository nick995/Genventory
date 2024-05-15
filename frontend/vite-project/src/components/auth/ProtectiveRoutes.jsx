// ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Ensure user is logged in, otherwise redirect to login page
  console.log("current user")
  console.log(currentUser)
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Render children if user is logged in
  return children;
};

export default ProtectedRoute;
