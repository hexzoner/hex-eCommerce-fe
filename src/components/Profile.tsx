import { useAuth } from "../context";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Profile() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingSpinner />;
  if (!user) <Navigate to={"/"} />;

  return (
    <div className="min-h-screen">
      <p className="text-3xl font-semibold mt-8"> User Profile</p>
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-2xl">
        <p>{user.email}</p>
        <p>{user.firstName}</p>
        <p>{user.lastName}</p>
      </div>
    </div>
  );
}
