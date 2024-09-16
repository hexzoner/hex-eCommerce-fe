import axios from "axios";
// import { toast } from "react-toastify";
import { Product } from "../components/admin-area/Products";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/products`;

export const getProducts = async (token: string) => {
  const response = await axios
    .get(`${baseURL}`, {
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

export const createProduct = async (token: string, product: Product) => {
  const response = await axios
    .post(
      `${baseURL}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};

export const updateProduct = async (token: string, product: Product) => {
  const response = await axios
    .put(
      `${baseURL}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};
