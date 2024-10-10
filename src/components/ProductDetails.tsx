import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { FavIcon } from "./Home";
import { useShop } from "../context";
// import { updateCart } from "../api/cart";
// import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { wishlist, setWishlist, addToCart, cartLoading } = useShop();
  const [selectedSize, setSelectedSize] = useState<any>({});
  const [selectedColor, setSelectedColor] = useState<any>({});

  useEffect(() => {
    getProductById(Number(id))
      .then((res) => {
        setProduct(res);
        setSelectedSize(res.defaultSize);
        setSelectedColor(res.defaultColor);
        // console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleAddToCart() {
    addToCart(product, 1, selectedSize.id, selectedColor.id);
  }

  if (loading) return <LoadingSpinner />;

  function calcPrice() {
    const heightWidth = selectedSize.name.split("x");
    if (heightWidth.length == 2) return (product.price * (parseInt(heightWidth[0]) * parseInt(heightWidth[1]))).toFixed(2);
    else return product.price;
  }

  return (
    <div className="flex flex-col min-h-screen mt-16 max-w-[80rem] m-auto text-left">
      <div className="flex-col lg:flex-row flex gap-0 items-start">
        <img className="w-full lg:w-1/2 px-24 lg:px-0" src={product.image} alt="Product image" />
        <div className="flex flex-col w-full lg:w-1/2 px-4 lg:px-16 min-h-[55vh] justify-between gap-4 pb-6">
          <div className="flex justify-between items-center">
            <p className="text-3xl font-semibold">{product.name}</p>
            <FavIcon product={product} wishlist={wishlist} setWishlist={setWishlist} />
          </div>
          <p className="text-xl">€{calcPrice()}</p>
          <div className="flex gap-4 italic">
            <p>{product.category.name}</p>
          </div>
          <div className="font-semibold text-lg">
            <span>Size:</span> <span className="ml-1 ">{selectedSize.name}</span>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {product.sizes.map((size: any) => (
              <ProductSize size={size} setSelectedSize={setSelectedSize} selectedSize={selectedSize} key={size.id} />
            ))}
          </div>
          <p className="font-semibold text-lg">Color: {selectedColor.name}</p>
          {product.colors.length > 1 && (
            <div className="flex flex-wrap gap-3 items-center">
              {product.colors.map((color: any) => (
                <ProductColor color={color} setSelectedColor={setSelectedColor} selectedColor={selectedColor} key={color.id} />
              ))}
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className={`btn btn-primary mt-2 ${cartLoading ? "btn-disabled" : ""}`}
            // disabled={cartLoading}
          >
            {cartLoading ? "ADDING TO CART..." : "ADD TO CART"}
          </button>
        </div>
      </div>

      <div className="w-full">
        <div role="tablist" className="tabs tabs-bordered mb-16">
          {/* Tab 1 */}
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Description" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.description }}></div>
          </div>

          {/* Tab 2 */}
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Details" />
          <div role="tabpanel" className="tab-content p-10 w-full ">
            <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.details }}></div>
          </div>

          {/* Tab 3 */}
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Notes" />
          <div role="tabpanel" className="tab-content p-10">
            <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.notes }}></div>
          </div>

          {/* Tab 4 */}
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Instructions" />
          <div role="tabpanel" className="tab-content p-10">
            <div className="prose max-w-[100ch]" dangerouslySetInnerHTML={{ __html: product.instructions }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSize({ size, setSelectedSize, selectedSize }: { size: any; setSelectedSize: any; selectedSize: any }) {
  return (
    <button
      onClick={() => {
        setSelectedSize(size);
      }}
      key={size.id}
      className={`btn btn-sm py-0 px-5 ${selectedSize.id == size.id ? "btn-primary" : "btn-outline"}`}>
      {size.name}
    </button>
  );
}

function ProductColor({ color, setSelectedColor, selectedColor }: { color: any; setSelectedColor: any; selectedColor: any }) {
  return (
    <button
      onClick={() => {
        setSelectedColor(color);
      }}
      key={color.id}
      className={`btn btn-sm py-0 px-5 ${selectedColor.id == color.id ? "btn-primary" : "btn-outline"}`}>
      {color.name}
    </button>
  );
}
