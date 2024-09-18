import axios from "axios";
// import { toast } from "react-toastify";
// import { Product } from "../components/admin-area/Products";
import { toast } from "react-toastify";

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

export const createProduct = async (
  token: string,
  product: { name: string; description: string; price: number; categoryId: number; image: string; colorId: number }
) => {
  // console.log({
  //   name: product.name,
  //   description: product.description,
  //   price: product.price,
  //   categoryId: product.categoryId,
  // });
  const response = await axios
    .post(
      `${baseURL}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        colorId: product.colorId,
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

export const updateProduct = async (
  token: string,
  product: { name: string; description: string; price: number; categoryId: number; id: number; image: string; colorId: number }
) => {
  const body = {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    image: product.image,
    colorId: product.colorId,
  };

  const response = await axios
    .put(`${baseURL}/${product.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const deleteProduct = async (token: string, id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data));

  return response;
};
