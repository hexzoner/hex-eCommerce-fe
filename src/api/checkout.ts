import axios from "axios";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/create-checkout`;

export interface iCheckoutItem {
  price: number;
  quantity: number;
}

export async function createCheckout({ items, success_url, cancel_url }: { items: iCheckoutItem[]; success_url: string; cancel_url: string }) {
  const token = restoreToken();
  if (!token) return;
  const response = await axios
    .post(
      `${baseURL}`,
      { items, success_url, cancel_url },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      toast.error(err.message);
    });
  return response;
}
