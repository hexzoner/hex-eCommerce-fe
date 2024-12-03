import { useAuth } from "../context";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Profile() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingSpinner />;
  if (!user) <Navigate to={"/"} />;

  return (
    <div className="min-h-screen">
      {/* <p className="text-3xl font-semibold mt-8"> User Profile</p> */}
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-2xl text-left">
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">Email: </p>
          <p className="w-1/2">{user.email}</p>
        </div>
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">First Name: </p>
          <p className="w-1/2">{user.firstName}</p>
        </div>
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">Last Name:</p>
          <p className="w-1/2"> {user.lastName}</p>
        </div>
      </div>
    </div>
  );
}
