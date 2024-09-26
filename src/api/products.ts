import axios from "axios";
// import { toast } from "react-toastify";
// import { Product } from "../components/admin-area/Products";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/products`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${restoreToken()}`,
};

export const getProducts = async (categories?: number[], colors?: number[]) => {
  ///products?category=1,2&color=2
  let url = `${baseURL}?`;
  if (categories) url += `category=${categories.join(",")}&`;
  if (colors) url += `color=${colors.join(",")}`;

  const response = await axios
    .get(url, {
      headers,
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};

export const createProduct = async (product: {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  colorId: number;
  image: string;
  sizes: number[];
}) => {
  const response = await axios
    .post(
      `${baseURL}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        colorId: product.colorId,
        image: product.image,
        sizes: product.sizes,
      },
      {
        headers,
      }
    )
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};

export const updateProduct = async (product: {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  id: number;
  image: string;
  colorId: number;
  sizes: number[];
}) => {
  const body = {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    image: product.image,
    colorId: product.colorId,
    sizes: product.sizes,
  };

  const response = await axios
    .put(`${baseURL}/${product.id}`, body, {
      headers,
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};

export const deleteProduct = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers,
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data));

  return response;
};

export const getProductById = async (id: number) => {
  const response = await axios
    .get(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};
