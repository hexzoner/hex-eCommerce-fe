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

export const getProducts = async (
  categories?: number[],
  colors?: number[],
  sizes?: number[],
  producers?: number[],
  page?: number,
  perPage?: number
) => {
  // /products?category=1,2&color=2
  let url = `${baseURL}?`;
  if (categories && categories.length > 0) url += `category=${categories.join(",")}&`;
  if (colors && colors.length > 0) url += `color=${colors.join(",")}&`;
  if (sizes && sizes.length > 0) url += `size=${sizes.join(",")}&`;
  if (page) url += `page=${page}&`;
  if (perPage) url += `perPage=${perPage}&`;
  if (producers && producers.length > 0) url += `producer=${producers.join(",")}&`;

  // console.log(url);
  const response = await axios
    .get(url, {
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

interface ProductProps {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  defaultColorId: number;
  image: string;
  sizes: number[];
  defaultSize: number;
  colors: number[];
  details: string;
  notes: string;
  instructions: string;
  active?: boolean;
  id?: number;
  producerId: number;
}

export const createProduct = async (product: ProductProps) => {
  const response = await axios
    .post(
      `${baseURL}`,
      {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        defaultColorId: product.defaultColorId,
        image: product.image,
        sizes: product.sizes,
        defaultSizeId: product.defaultSize,
        colors: product.colors,
        details: product.details,
        notes: product.notes,
        instructions: product.instructions,
        active: product.active,
        producerId: product.producerId,
      },
      {
        headers,
      }
    )
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
    });
  return response;
};

export const updateProduct = async (product: ProductProps) => {
  const body = {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    image: product.image,
    colors: product.colors,
    defaultColorId: product.defaultColorId,
    sizes: product.sizes,
    defaultSizeId: product.defaultSize,
    active: product.active,
    details: product.details,
    notes: product.notes,
    instructions: product.instructions,
    producerId: product.producerId,
  };

  // console.log(body);
  // console.log(product.id);

  const response = await axios
    .put(`${baseURL}/${product.id}`, body, {
      headers,
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
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
    .catch((err) => console.log(err.response.data.message));
  return response;
};
