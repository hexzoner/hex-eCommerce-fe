import axios from "axios";
import { LatestArrivalInputs } from "../pages/admin/HomeArrivals";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/latest`;

export const getLatestArrivals = async () => {
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
    .catch((err) => {
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};

export const createLatestArrival = async (product: LatestArrivalInputs) => {
  const body = {
    name: product.name,
    link: product.link,
    image: product.image,
  };
  const response = await axios
    .post(`${baseURL}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};

export const updateLatestArrival = async (product: any, id: number) => {
  // console.log(product);
  const response = await axios
    .put(`${baseURL}/${id}`, product, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};

export const deleteLatestArrival = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};
