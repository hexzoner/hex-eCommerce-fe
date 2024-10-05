import axios from "axios";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/cart`;

export const getCart = async () => {
  const token = restoreToken();
  if (!token) return;
  const response = await axios
    .get(`${baseURL}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    });
  return response;
};

export const updateCart = async (data: { productId: number; quantity: number; color: number; size: number }) => {
  // console.log(data);
  const token = restoreToken();
  if (!token) return;
  const response = await axios
    .post(`${baseURL}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    });
  return response;
};

export const clearCart = async () => {
  const token = restoreToken();
  if (!token) return;
  const response = await axios
    .delete(`${baseURL}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.data.message);
      toast.error(err.data.message);
    });
  return response;
};
