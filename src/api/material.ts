import axios from "axios";
// import { Material } from "../pages/admin/Material";
import { restoreToken } from "../utils/storage";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/materials`;

export const getMaterials = async () => {
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
      toast.error(err.response.data.message);
      console.log(err);
    });
  return response;
};

export const getMaterialById = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err);
    });
  return response;
};

export interface iMaterialAPI {
  name: string;
  image: string;
}

export const createMaterial = async (data: iMaterialAPI) => {
  const response = await axios
    .post(`${baseURL}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err);
    });
  return response;
};

export const updateMaterial = async (data: iMaterialAPI, id: number) => {
  const response = await axios
    .put(`${baseURL}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err);
    });
  return response;
};

export const deleteMaterial = async (id: number) => {
  const response = await axios
    .delete(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restoreToken()}`,
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err);
    });
  return response;
};
