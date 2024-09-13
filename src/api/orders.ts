import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/orders`;

export const getOrders = async (token: string) => {
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
