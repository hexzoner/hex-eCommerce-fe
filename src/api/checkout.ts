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

export async function createCheckout(items: iCheckoutItem[]) {
  const token = restoreToken();
  if (!token) return;
  const response = await axios
    .post(
      `${baseURL}`,
      { items },
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
      toast.error(err.response.data.message);
    });
  return response;
}
