import axios from "axios";
import { iTaxonomy } from "../pages/admin/Taxonomies";
// import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/colors`;

export const getColors = async () => {
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

export const updateColor = async (data: iTaxonomy, id: number) => {
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
    .catch((err) => console.log(err.data));
  return response;
};

export const createColor = async (data: iTaxonomy) => {
  const response = await axios
    .post(`${baseURL}`, data, {
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

export const deleteColor = async (id: number) => {
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
