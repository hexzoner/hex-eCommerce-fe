import axios from "axios";

// import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/email`;

export const verifyEmailToken = async (token: string) => {
  const response = await axios
    .get(`${baseURL}/confirm?token=${token}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      // toast.error(err.response.data.message);
      return err.response.data;
    });
  return response;
};
