import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context";
import LoadingSpinner from "../components/LoadingSpinner";

function Authorize({ roles }: { roles: string[] }) {
  const { user } = useAuth();
  if (!user) return <LoadingSpinner />;
  return <>{roles.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" />}</>;
}

export default Authorize;
