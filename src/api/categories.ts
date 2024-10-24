import axios from "axios";
// import { Category } from "../pages/admin/Categories";
import { iTaxonomy } from "../pages/admin/Taxonomies";
// import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/categories`;

export const getCategories = async () => {
  const response = await axios
    .get(`${baseURL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data.message));
  return response;
};

export const updateCategory = async (data: iTaxonomy, id: number) => {
  const response = await axios
    .put(`${baseURL}/${id}`, data, {
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

export const createCategory = async (category: iTaxonomy) => {
  const response = await axios
    .post(
      `${baseURL}`,
      { name: category.name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restoreToken()}`,
        },
      }
    )
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data));

  return response;
};

export const deleteCategory = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err.data));

  return response;
};
