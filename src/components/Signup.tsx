import { useAuth } from "../context";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./components";
import { toast } from "react-toastify";
import { signUpApiCall } from "../api/auth";
import { storeToken } from "../utils/storage";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, setAuthLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm<{ email: string; password: string; confirmPassword: string; firstName: string; lastName: string }>();

  async function onSubmit(data: { email: string; password: string; confirmPassword: string; firstName: string; lastName: string }) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await signUpApiCall(data);
      setUser(res.user);
      setIsAuthenticated(true);
      setAuthLoading(false);
      setIsLoading(false);
      storeToken(res.token);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      // reset();
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="min-h-screen flex flex-col gap-6 justify-center items-center">
        <p>Create new account</p>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              autoComplete="off"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </label>
          {errors.email && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.email.message?.toString()}</p>}
        </div>

        <div>
          <label htmlFor="password" className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              id="password"
              className="grow"
              placeholder="Password"
              autoComplete="off"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
          </label>
          {errors.password && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.password.message?.toString()}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              id="confirmPassword"
              className="grow"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
          </label>
          {errors.confirmPassword && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.confirmPassword.message?.toString()}</p>}
        </div>

        <p>Personal information (Optional)</p>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-0">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow" placeholder="First Name" autoComplete="off" {...register("firstName")} />
          </label>
          {/* {errors.email && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.email.message?.toString()}</p>} */}
        </div>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-0">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow" placeholder="Last Name" autoComplete="off" {...register("lastName")} />
          </label>
          {/* {errors.email && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.email.message?.toString()}</p>} */}
        </div>

        <button type="submit" className="btn btn-primary px-8">
          Signup
        </button>

        <div className="label ">
          <span onClick={() => navigate("/login")} className="label-text-alt text-info hover:underline hover:cursor-pointer">
            Already have an account yet? Login here!
          </span>
        </div>
      </form>
    </div>
  );
}
