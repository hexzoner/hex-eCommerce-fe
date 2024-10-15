import { getProducts } from "../api/products";
import { useState, useEffect } from "react";
import { Product } from "./admin-area/Products";
import LatestArrivalsCarousel from "../pages/user/LatestArrivalsCarousel";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts([], [], [], 1, 5)
      .then((res) => {
        setProducts(res.results);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#eff2f6]">
      {/* Hero section */}
      <section className="max-w-[1115px] m-auto py-24">
        <div className="flex h-[521px] justify-center gap-4  text-black">
          <div className="hero-1-background rounded-2xl w-2/3 flex flex-col justify-evenly ">
            <p className="font-semibold text-5xl w-fit mx-auto text-outline rounded-xl py-2 px-12">Where Heritage Meets Home</p>
            <p className="font-semibold text-xl py-2 px-4 w-fit mx-auto text-outline  rounded-xl">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.
            </p>
            <button className="btn btn-neutral rounded-none max-w-[194px] mx-auto btn-lg px-12">Shop All</button>
          </div>
          <div className="flex flex-col w-1/3 justify-between font-normal text-xl">
            <div className="hero-2-background h-[251px] gap-4 rounded-xl text-center flex flex-col justify-between py-4">
              <p></p>
              <p className="bg-white w-fit mx-auto px-6 rounded-md py-2">Wool Rugs</p>
            </div>
            <div className="hero-3-background h-[251px] gap-4 rounded-xl text-center flex flex-col justify-between py-4">
              <p></p>
              <p className="bg-white w-fit mx-auto px-6 rounded-md py-2">New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Latest Arrivals */}
      <section className="bg-white h-[673.65px] mb-12">
        <div>
          <p className="font-semibold text-4xl pt-20"> Our Latest Arrivals</p>
        </div>

        <div className="mt-20">
          <LatestArrivalsCarousel products={products} />
        </div>

        <button className="h-[50px] w-[194px] font-semibold text-[22px]">SEE ALL</button>
      </section>
    </div>
  );
}
