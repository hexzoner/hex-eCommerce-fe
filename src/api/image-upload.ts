import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/s3`;

export const getPresignedUrl = async (file: any) => {
  // console.log(file);
  const body = {
    fileName: file.name,
    fileType: file.type,
  };
  // console.log("----------getPresignedUrl--------");
  // console.log(body);
  const response = await axios.post(`${baseURL}`, body, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${restoreToken()}`,
    },
  });

  return response.data.uploadURL;
};

export const uploadImageToS3 = async (file: any) => {
  // console.log("----------uploadImageToS3--------");
  // console.log(file);
  const url = await getPresignedUrl(file);
  // console.log(url);

  await axios
    .put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  // Extract the URL without the signature
  const imageUrl = url.split("?")[0];
  // console.log(imageUrl);

  return imageUrl;
};
