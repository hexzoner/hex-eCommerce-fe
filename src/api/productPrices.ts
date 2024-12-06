import axios from "axios";
// import { toast } from "react-toastify";
// import { Product } from "../components/admin-area/Products";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/product-prices`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${restoreToken()}`,
};

export const getProductPricesByProductId = async ({ productId, sizeId }: { productId: number; sizeId?: number }) => {
  const url = sizeId ? `${baseURL}/${productId}?sizeId=${sizeId}` : `${baseURL}/${productId}`;
  const response = await axios
    .get(url, {
      headers,
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};
