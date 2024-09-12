import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedLayout = () => {
  const location = useLocation();
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <LoadingSpinner />;
  return <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ next: location.pathname }} />}</>;
};

export default ProtectedLayout;
