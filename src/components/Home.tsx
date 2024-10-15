import { getProducts } from "../api/products";
import { useState, useEffect } from "react";
import { Product } from "./admin-area/Products";
import LatestArrivalsCarousel from "../pages/user/LatestArrivalsCarousel";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

export const Rooms: string[] = ["Living Room", "Bedroom", "Dining Room", "Kitchen", "Hallway", "Balcony", "Bathroom"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const homeMainBG = "bg-[#eff2f6]";
  const tipsSubHeader = "text-lg font-bold";
  const tipsText = "text-lg font-medium";
  const numberMarkup = "text-xl bg-[#CECECE] rounded-full py-4";
  const navigate = useNavigate();

  useEffect(() => {
    getProducts([], [], [], 1, 5)
      .then((res) => {
        setProducts(res.results);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={"min-h-screen " + homeMainBG}>
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

        <button onClick={() => navigate("/products")} className={"h-[50px] w-[194px] font-semibold text-[22px] "}>
          SEE ALL
        </button>
      </section>

      {/* Rooms and Sizes section */}
      <section className={"h-[523px] mb-12 " + homeMainBG}>
        <div className="max-w-screen-lg m-auto gap-4 flex flex-col justify-between h-full">
          <p className="font-semibold text-3xl max-w-96 m-auto">Find the perfect rug size for your room.</p>
          <p className="max-w-72 m-auto text-justify">Our rugs come in a variety of sizes to fit any room in your home.</p>
          <div className="flex justify-between items-center gap-4">
            {Rooms.map((room, index) => {
              return (
                <div key={index} className="flex flex-col justify-between gap-4 mt-4">
                  <img src="https://placehold.co/200x200/png" alt={room} />
                  <p className="font-bold text-sm cursor-pointer">{room + " >"}</p>
                  {/* <p className="font-normal text-xl">Shop Now</p> */}
                </div>
              );
            })}
          </div>
          <button className="btn btn-lg btn-neutral rounded-none max-w-sm m-auto mt-12">To Size Selection</button>
        </div>
      </section>

      {/* Tips section */}
      <section className="bg-white text-left">
        <div className="max-w-screen-xl m-auto flex gap-10 h-full pb-20">
          <div className="w-1/2 flex flex-col justify-evenly h-full min-h-[572px] pb-20">
            <p className="font-semibold text-4xl">Perfect samples, perfect choices! Try our rugs sample service</p>
            <p className={tipsText}>
              Explore your favorites at home, stress-free – that’s our promise. Along with free expert advice, you can order a sample of any product
              in our shop. We pride ourselves on lightning-fast delivery, with our team processing your orders right away.
            </p>
            <button className="btn btn-outline rounded-none w-fit btn-lg">This is how it works</button>
          </div>
          <div className="w-1/2 flex flex-col justify-between h-full min-h-[572px] py-16">
            <div className="flex items-center justify-between gap-2">
              <p className={numberMarkup + "  px-[26px]"}>1</p>
              <div>
                <p className={tipsSubHeader}>Explore Our Products</p>
                <p className={tipsText}>Browse through our wide range of products and choose your favorites.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className={numberMarkup + "  px-[24px]"}>2</p>
              <div>
                <p className={tipsSubHeader}>Order Your Samples</p>
                <p className={tipsText}>For each product, you can order a sample directly from our shop.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className={numberMarkup + "  px-[24px]"}>3</p>
              <div>
                <p className={tipsSubHeader}>Fast Processing</p>
                <p className={tipsText}>Once you place your order, our sample department processes it immediately.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className={numberMarkup + "  px-[23px]"}>4</p>
              <div>
                <p className={tipsSubHeader}>Did you like the sample?</p>
                <p className={tipsText}>Enjoy an special discount if you order the same rug as one of the samples you order.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
