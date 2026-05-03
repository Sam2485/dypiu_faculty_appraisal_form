import { Navigate } from "react-router-dom";
import { normalizeRole, VALID_ROLES } from "./session";

export default function ProtectedRoute({ children }) {
  const role = normalizeRole(localStorage.getItem("role"), "");

  if (!VALID_ROLES.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  localStorage.setItem("role", role);
  return children;
}
