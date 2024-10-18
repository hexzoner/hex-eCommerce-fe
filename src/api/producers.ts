import axios from "axios";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/producers`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${restoreToken()}`,
};

export interface iProducerAPI {
  name: string;
  description: string;
  image: string;
}

export const getProducers = async () => {
  const response = await axios
    .get(baseURL, {
      headers,
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    });
  return response;
};

export const createProducer = async (data: iProducerAPI) => {
  const response = await axios
    .post(`${baseURL}`, data, {
      headers,
    })
    .then((res) => {
      toast.success("Producer created successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};

export const updateProducer = async (data: iProducerAPI, id: number) => {
  const response = await axios
    .put(`${baseURL}/${id}`, data, {
      headers,
    })
    .then((res) => {
      toast.success("Producer updated successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};

export const deleteProducer = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers,
    })
    .then((res) => {
      toast.success("Producer deleted successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};
