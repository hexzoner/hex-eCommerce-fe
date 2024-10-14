import axios from "axios";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/reviews`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${restoreToken()}`,
};

export interface iCreateReviewAPI {
  author: string;
  rating: string;
  title: string;
  review: string;
  image: string;
  productId: number;
  date: string;
}

export const getReviews = async (page?: number, perPage?: number, sort?: string, productId?: number) => {
  let url = `${baseURL}?`;
  if (page) url += `&page=${page}`;
  if (perPage) url += `&perPage=${perPage}`;
  if (sort) url += `&sort=${sort}`;
  if (productId) url += `&productId=${productId}`;

  const response = await axios
    .get(url, {
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

export const createReview = async (data: iCreateReviewAPI) => {
  const response = await axios
    .post(`${baseURL}`, data, {
      headers,
    })
    .then((res) => {
      toast.success("Review created successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};

export const updateReview = async (data: iCreateReviewAPI, id: number) => {
  const response = await axios
    .put(`${baseURL}/${id}`, data, {
      headers,
    })
    .then((res) => {
      toast.success("Review updated successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};

export const deleteReview = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers,
    })
    .then((res) => {
      toast.success("Review deleted successfully");
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.error);
    });
  return response;
};
