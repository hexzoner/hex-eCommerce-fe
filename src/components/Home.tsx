export const mainMakrupColors = "bg-white text-[#363636]";
import { getProducts } from "../api/products";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Product } from "./admin-area/Products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await getProducts("token");
        setProducts(products);
        // console.log(products);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className={mainMakrupColors}>
        <LoadingSpinner />
      </div>
    );

  return (
    <div className={mainMakrupColors + " min-h-screen"}>
      <section className="my-12 px-12">
        <div className="grid grid-cols-4 gap-2">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>
    </div>
  );
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="card bg-base-100 w-80">
      <figure>
        <img src={product.image} alt="Rug Image" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {/* <div className="badge badge-secondary">NEW</div> */}
        </h2>
        <p>{product.description}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{product.category.name}</div>
          <div className="badge badge-outline">{product.color.name}</div>
        </div>
      </div>
    </div>
  );
};
