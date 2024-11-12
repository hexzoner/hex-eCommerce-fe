import axios from "axios";
import { Size } from "../components/admin-area/Sizes";
// import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/sizes`;

export const getSizes = async () => {
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

export const updateSize = async (size: Size) => {
  const response = await axios
    .put(
      `${baseURL}/${size.id}`,
      { name: size.name, squareMeters: size.squareMeters },
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
    .catch((err) => console.log(err));
  return response;
};

export const createSize = async (size: Size) => {
  const response = await axios
    .post(
      `${baseURL}`,
      { name: size.name, squareMeters: size.squareMeters },
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

export const deleteSize = async (id: number) => {
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

export const getSizeById = async (id: number) => {
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
    .catch((err) => console.log(err.data));
  return response;
};
