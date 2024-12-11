import { Product } from "../components/admin-area/Products";

export function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

//Calculate price range based on the price per square meter and min and max sizes.
export function calculatePriceRange(_product: Product) {
  let minPrice = 0;
  let maxPrice = 0;

  // console.log(_product);
  const sizesInSquareMeters = _product.sizes.map((size) => {
    // const heightWidth = size.name.split("x");
    // const squareMeters = parseInt(heightWidth[0]) * parseInt(heightWidth[1]);
    return size.squareMeters;
  });

  minPrice = Math.min(...sizesInSquareMeters) * _product.price;
  maxPrice = Math.max(...sizesInSquareMeters) * _product.price;

  return "€" + minPrice.toFixed(0) + " - " + "€" + maxPrice.toFixed(0);
}

export function getProductMainImageUrl(product: Product) {
  const url = product.patterns.find((x) => x.order === 0)?.images.find((x) => x.order === 0)?.imageURL;
  if (url) return url;
  return "https://placehold.co/200";
}
