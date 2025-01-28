import axios from "axios";
// import { toast } from "react-toastify";
// import { Product } from "../components/admin-area/Products";
import { toast } from "react-toastify";
import { restoreToken } from "../utils/storage";
import { iPattern } from "../pages/admin/modals/CreateProductModal";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
const baseURL = `${API_URL}/products`;

export const getProducts = async ({
  categories,
  colors,
  sizes,
  producers,
  shapes,
  techniques,
  materials,
  styles,
  rooms,
  features,
  page,
  perPage,
  isNew,
  isBestSeller,
}: {
  categories?: number[];
  colors?: number[];
  sizes?: number[];
  producers?: number[];
  shapes?: number[];
  techniques?: number[];
  materials?: number[];
  styles?: number[];
  rooms?: number[];
  features?: number[];
  page?: number;
  perPage?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}) => {
  //products?category=1,2&color=2
  let url = `${baseURL}?`;
  if (categories && categories.length > 0) url += `category=${categories.join(",")}&`;
  if (colors && colors.length > 0) url += `color=${colors.join(",")}&`;
  if (sizes && sizes.length > 0) url += `size=${sizes.join(",")}&`;
  if (shapes && shapes.length > 0) url += `shape=${shapes.join(",")}&`;
  if (techniques && techniques.length > 0) url += `technique=${techniques.join(",")}&`;
  if (materials && materials.length > 0) url += `material=${materials.join(",")}&`;
  if (styles && styles.length > 0) url += `style=${styles.join(",")}&`;
  if (rooms && rooms.length > 0) url += `room=${rooms.join(",")}&`;
  if (features && features.length > 0) url += `feature=${features.join(",")}&`;
  if (page) url += `page=${page}&`;
  if (perPage) url += `perPage=${perPage}&`;
  if (producers && producers.length > 0) url += `producer=${producers.join(",")}&`;
  if (isNew) url += `isNew=${isNew}&`;
  if (isBestSeller) url += `isBestSeller=${isBestSeller}&`;

  // console.log(url);
  const response = await axios
    .get(url, {
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
      toast.error(err.response.data.error);
      console.log(err.response.data.error);
    });
  return response;
};

interface ProductProps {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  defaultColorId: number;
  image: string;
  sizes: number[];
  defaultSize: number;
  colors: number[];
  details: string;
  notes: string;
  instructions: string;
  active?: boolean;
  id?: number;
  producerId: number;
  styleId: number;
  shapeId: number;
  techniqueId: number;
  materialId: number;
  rooms: number[];
  features: number[];
  new: boolean;
  bestSeller: boolean;
  patterns?: iPattern[];
  producerQuote: string;
  samplePrice: number;
  shippingDays: number;
}

function getBodyAPI(product: ProductProps) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    styleId: product.styleId,
    defaultColorId: product.defaultColorId,
    image: product.image,
    sizes: product.sizes,
    defaultSizeId: product.defaultSize,
    colors: product.colors,
    details: product.details,
    notes: product.notes,
    instructions: product.instructions,
    active: product.active,
    producerId: product.producerId,
    shapeId: product.shapeId,
    techniqueId: product.techniqueId,
    materialId: product.materialId,
    rooms: product.rooms,
    features: product.features,
    new: product.new,
    bestSeller: product.bestSeller,
    patterns: product.patterns,
    producerQuote: product.producerQuote,
    samplePrice: product.samplePrice,
    shippingDays: product.shippingDays,
  };
}

export const createProduct = async (product: ProductProps) => {
  const response = await axios
    .post(`${baseURL}`, getBodyAPI(product), {
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
      console.log(err.response.data.message);
    });
  return response;
};

export const updateProduct = async (product: ProductProps) => {
  // console.log(getBodyAPI(product));
  // console.log(product.id);

  const response = await axios
    .put(`${baseURL}/${product.id}`, getBodyAPI(product), {
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

export const deleteProduct = async (id: number) => {
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

export const getProductById = async (id: number) => {
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
    .catch((err) => console.log(err.response.data.message));
  return response;
};
