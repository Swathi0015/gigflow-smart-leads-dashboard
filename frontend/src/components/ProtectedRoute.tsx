import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();

  if (loading) return <div style={{ color: "#ffffff", padding: "2rem" }}>Verifying security credentials...</div>;
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}