// import { getProducts } from "../api/products";
import { getLatestArrivals } from "../api/latest";
import { getReviews } from "../api/reviews";
import { useState, useEffect } from "react";
import { Product } from "./admin-area/Products";
import { Review } from "../pages/admin/Reviews";
import LatestArrivalsCarousel from "../pages/user/home-components/LatestArrivalsCarousel";
import ReviewsCarousel from "../pages/user/home-components/ReviewsCarousel";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useShop } from "../context";

export const homeMainBG = "bg-[#eff2f6]";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { rooms, setFilter } = useShop();

  const tipsSubHeader = "text-lg font-bold";
  const tipsText = "text-lg font-medium";
  const numberMarkup = "text-xl bg-[#CECECE] rounded-full py-4";
  const neutralButtonClass = "btn btn-lg btn-neutral rounded-none max-w-sm m-auto mt-12";
  const headerMarkup = "font-semibold text-4xl";
  const outlineButtonClass = "btn btn-outline rounded-none w-fit btn-lg";
  const navigate = useNavigate();

  useEffect(() => {
    getLatestArrivals()
      .then((res) => {
        setProducts(res);
        getReviews({ page: 1, perPage: 10, sortBy: "rating", sort: "desc" })
          .then((res) => {
            setReviews(res.reviews);
          })
          .catch(() => toast.error("Oops! Something went wrong fetching reviews"));
      })
      .catch(() => toast.error("Oops! Something went wrong fetching products"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={"min-h-screen " + homeMainBG}>
      {/* Hero section */}
      <section className="max-w-[1115px] m-auto py-20">
        <div className="flex flex-wrap md:flex-nowrap md:h-[521px] justify-center gap-4  text-black">
          <div className="hero-1-background rounded-2xl w-full md:w-2/3 flex flex-col justify-evenly ">
            <p className="font-semibold text-5xl w-fit mx-auto text-outline rounded-xl py-2 px-12">Where Heritage Meets Home</p>
            <p className="font-semibold text-xl py-2 px-4 w-fit mx-auto text-outline  rounded-xl">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.
            </p>
            <button
              onClick={() => {
                setFilter({ type: "", id: 0, value: "" });
                navigate("/products");
              }}
              className="btn btn-neutral rounded-none max-w-[194px] mx-auto btn-lg px-12">
              Shop All
            </button>
          </div>
          <div className="flex flex-col gap-4 md:gap-0 w-full md:w-1/3 justify-between font-normal text-xl">
            <div className="hero-2-background h-[251px] gap-4 rounded-xl text-center flex flex-col justify-between py-4">
              <p></p>
              <button
                onClick={() => {
                  setFilter({ type: "Rug Types", id: 1, value: "Wool Rugs" });
                  navigate("/products");
                }}
                className="btn text-lg  mx-auto px-6 rounded-md py-2">
                Wool Rugs
              </button>
            </div>
            <div className="hero-3-background h-[251px] gap-4 rounded-xl text-center flex flex-col justify-between py-4">
              <p></p>
              <button
                onClick={() => {
                  setFilter({ type: "New Arrivals", id: 0, value: "true" });
                  navigate("/products");
                }}
                className="btn text-lg  mx-auto px-6 rounded-md py-2">
                New Arrivals
              </button>
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
      <section className={"md:h-[523px] mb-12 px-4 md:px-0  " + homeMainBG}>
        <div className="max-w-screen-lg m-auto gap-4 flex flex-col justify-between h-full ">
          <p className="font-semibold text-3xl max-w-96 m-auto">Find the perfect rug size for your room.</p>
          <p className="max-w-72 m-auto text-justify">Our rugs come in a variety of sizes to fit any room in your home.</p>
          <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap ">
            {rooms.map((room, index) => {
              return (
                <div
                  onClick={() => {
                    navigate(`/products/`);
                    setFilter({ type: "Rug Sizes", id: room.id, value: room.name });
                  }}
                  key={index}
                  className="flex flex-col justify-between gap-4 mt-4 m-auto cursor-pointer">
                  <img className="h-[8.25rem] w-[8.25rem]" src={room.image} alt={room.name} />
                  <p className="font-bold text-sm cursor-pointer">{room.name + " >"}</p>
                  {/* <p className="font-normal text-xl">Shop Now</p> */}
                </div>
              );
            })}
          </div>
          <button className={neutralButtonClass}>To Size Selection</button>
        </div>
      </section>

      {/* Tips section */}
      <section className="bg-white text-left">
        <div className="max-w-screen-xl m-auto flex gap-10 h-full pb-20 flex-wrap md:flex-nowrap px-4 md:px-0">
          <div className="w-full md:w-1/2 flex flex-col justify-evenly h-full min-h-[572px] pb-20">
            <p className={headerMarkup}>Perfect samples, perfect choices! Try our rugs sample service</p>
            <p className={tipsText}>
              Explore your favorites at home, stress-free – that’s our promise. Along with free expert advice, you can order a sample of any product
              in our shop. We pride ourselves on lightning-fast delivery, with our team processing your orders right away.
            </p>
            <button className={outlineButtonClass}>This is how it works</button>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between h-full min-h-[572px] py-16">
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

      {/* Featured Producer section */}
      <section className={"md:h-[629px] mb-12 " + homeMainBG}>
        <div className="max-w-[968.25px] m-auto px-4 lg:px-0">
          <div className="flex justify-between pt-20 flex-wrap md:flex-nowrap gap-6 md:gap-0">
            <div className="flex flex-col gap-10 justify-start text-left max-w-[519px] m-auto">
              <p className={headerMarkup}>Meet Rajveer</p>
              <p className={tipsText}>
                Rajveer Bhardwaj, founder of Kaarigari Creations, blends traditional Indian rug craftsmanship with modern design. His passion for
                preserving heritage results in exquisite, handwoven rugs that celebrate India’s rich artistry.
              </p>
              <button className={outlineButtonClass}>Meet our Producers</button>
            </div>
            <div className="m-auto">
              <img
                className="h-[437px] w-[395px] rounded-[15px] object-cover"
                src="https://www.indianhandmaderugs.com/wp-content/uploads/2022/06/Quality-Control-carpet-rug-manufacturer-in-india.jpg"
                alt="Producer Image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className="min-h-[721.75px] bg-white pt-20 text-left pb-28">
        <div className="max-w-screen-xl m-auto flex flex-col justify-between ">
          <p className={headerMarkup}>Here’s what our customers are saying…</p>
          <div className="mt-12">
            <ReviewsCarousel reviews={reviews} />
          </div>
          <button className="text-center text-base font-semibold mt-14 w-fit m-auto">SEE ALL REVIEWS</button>
        </div>
      </section>
    </div>
  );
}
