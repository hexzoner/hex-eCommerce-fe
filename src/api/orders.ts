import axios from "axios";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/orders`;

export const getOrders = async ({ page, perPage }: { page?: number; perPage?: number }) => {
  let url = `${baseURL}?`;
  if (page) url += `page=${page}&`;
  if (perPage) url += `perPage=${perPage}&`;
  // console.log(url);
  const response = await axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err));
  return response;
};

export interface iOrderProduct {
  productId: number;
  patternId: number;
  sizeId: number;
  quantity: number;
}

export const createOrder = async ({ products, stripeSessionId }: { products: iOrderProduct[]; stripeSessionId: string }) => {
  const body = { products, stripeSessionId };
  // console.log(body);
  const response = await axios
    .post(`${baseURL}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return response;
};
