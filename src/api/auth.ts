import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/auth`;

export const loginApiCall = async (email: string, password: string) => {
  const response = await axios
    .post(`${baseURL}/login`, { email, password })
    .then((res) => {
      if (res.data.status === "error") {
        toast.error(res.data.message);
        return null;
      } else {
        toast.success("Login successful");
        return res.data;
      }
    })
    .catch((err) => {
      const error = err.response.data;
      toast.error(error.message);
      throw new Error("Login failed");
      //   console.clear();
    });
  return response;
};

export const signUpApiCall = async (data: { email: string; password: string; confirmPassword: string; firstName: string; lastName: string }) => {
  const response = await axios
    .post(`${baseURL}/signup`, data)
    .then((res) => {
      if (res.data.status === "error") {
        toast.error(res.data.message);
        return null;
      } else {
        toast.success("Signup successful");
        return res.data;
      }
    })
    .catch((err) => {
      const error = err.response.data;
      toast.error(error.message);
      throw new Error("Signup failed");
    });
  return response;
};

// export const signUpApiCall = async

export const meApi = async (token: string) => {
  const response = await axios
    .get(`${baseURL}/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};
