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
import rounded_1 from "../assets/rounded-1.png";
import rounded_2 from "../assets/rounded-2.png";
import rounded_3 from "../assets/rounded-3.png";
import rounded_4 from "../assets/rounded-4.png";
import homeHeroImage from "../assets/home_hero_image.png";

export const homeMainBG = "bg-[#f5f6fa]";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { rooms, setFilter } = useShop();

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

  const buttonMarkup = "btn btn-neutral rounded-none mx-auto px-12 w-[247px] h-[49px] text-[14px] leading-5";
  // const titleText = "font-semibold text-4xl";

  function buttonNewArrivals() {
    setFilter({ type: "New Arrivals", id: 0, value: "true" });
    navigate("/products");
  }

  // function buttonShopAll() {
  //   setFilter({ type: "", id: 0, value: "" });
  //   navigate("/products");
  // }

  function bestSellers() {
    setFilter({ type: "Best Sellers", id: 0, value: "true" });
    navigate("/products");
  }

  const headerMarkup = " font-bold text-[40px] text-black ";
  const tipsSubHeader = "text-lg font-bold";
  const tipsText = "text-lg font-medium text-left w-full";
  // const numberMarkup = "text-xl bg-[#CECECE] rounded-full py-4";
  // const neutralButtonClass = "btn btn-lg btn-neutral rounded-none max-w-sm m-auto mt-12";
  // const headerMarkup = "font-semibold text-4xl";
  const outlineButtonClass = "btn btn-outline rounded-none w-fit  text-sm";

  return (
    <div className={"min-h-screen " + homeMainBG}>
      {/* Hero section */}
      <section className="mt-20 bg-[#ebf2f8]">
        <div className="max-w-[1206px] m-auto  flex flex-wrap gap-4 lg:gap-0 md:min-h-[435px] justify-center items-center text-black  ">
          <div className=" rounded-none w-full md:w-1/2 flex flex-col justify-center ">
            <div className=" max-w-[555px] m-auto">
              <p className={"w-fit mx-auto rounded-none py-2 " + headerMarkup}>Where Heritage Meets Home</p>
              <p className="text-[16px] leading-6 py-2 px-4 w-fit mx-auto rounded-xl">
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.
              </p>
              <div className="flex gap-2 mt-6 flex-wrap">
                <button onClick={buttonNewArrivals} className={buttonMarkup}>
                  New Arrivals
                </button>
                <button onClick={bestSellers} className={buttonMarkup}>
                  Best Sellers
                </button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 ">
            <img className="m-auto " src={homeHeroImage} alt="room example" />
            {/* <div className="hero-2-background h-[251px] gap-4 rounded-xl text-center flex flex-col justify-between py-4">
              <p></p>
              <button
                onClick={() => {
                  setFilter({ type: "Rug Types", id: 1, value: "Wool Rugs" });
                  navigate("/products");
                }}
                className="btn text-lg  mx-auto px-6 rounded-md py-2">
                Wool Rugs
              </button>
            </div> */}
            {/* <div className=" rounded-none text-center "> */}

            {/* <button
                onClick={() => {
                  setFilter({ type: "New Arrivals", id: 0, value: "true" });
                  navigate("/products");
                }}
                className="btn text-lg  mx-auto px-6 rounded-md py-2">
                New Arrivals
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </section>

      {/* Our Latest Arrivals */}
      <section className="pb-32">
        <div>
          <p className={"pt-20 " + headerMarkup}> Featured Rugs</p>
        </div>
        {/* <div className="m-auto w-80 md:w-full"></div> */}
        <div className="mt-12 m-auto w-80 md:w-full">
          <LatestArrivalsCarousel products={products} />
        </div>

        {/* <button onClick={() => navigate("/products")} className={"h-[50px] w-[194px] font-semibold text-[22px] "}>
          SEE ALL
        </button> */}
      </section>

      {/* Rooms and Sizes section */}
      <section className={"md:min-h-[696px]  px-4 py-12 md:px-0 bg-[#ebf2f8] "}>
        <div className="max-w-screen-xl m-auto gap-4 flex flex-col justify-between h-full ">
          <div className="flex flex-col">
            <p className={"max-w-[512px] m-auto " + headerMarkup}>Find the perfect rug size for your room.</p>
            <p className="m-auto text-justify">Our rugs come in a variety of sizes to fit any room in your home.</p>
          </div>
          <div className="flex  gap-4 flex-wrap ">
            {rooms.map((room, index) => {
              return (
                <div
                  onClick={() => {
                    navigate(`/products/`);
                    setFilter({ type: "Rug Sizes", id: room.id, value: room.name });
                  }}
                  key={index}
                  className="flex items-center justify-center gap-0 mt-4 m-auto cursor-pointer w-[306px] h-[141px] border-[1px] border-[#CCD4DD] hover:bg-white">
                  <img className="w-[60%]" src={room.image} alt={room.name} />
                  <p className="w-[40%] text-left text-black font-bold text-lg cursor-pointer   ">{room.name}</p>
                  {/* <p className="font-normal text-xl">Shop Now</p> */}
                </div>
              );
            })}
          </div>
          <button className={outlineButtonClass + " m-auto w-[378px] h-[49px] mt-3"}>To Size Selection</button>
        </div>
      </section>

      {/* Tips section */}
      <section className="text-left">
        <div className="max-w-screen-xl m-auto flex gap-10 h-full pb-20 flex-wrap md:flex-nowrap px-4 md:px-0">
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 h-full min-h-[572px] ">
            <p className={headerMarkup}>Perfect samples, perfect choices! Try our rugs sample service</p>
            <p className={tipsText}>
              Explore your favorites at home, stress-free – that’s our promise. Along with free expert advice, you can order a sample of any product
              in our shop. We pride ourselves on lightning-fast delivery, with our team processing your orders right away.
            </p>
            <button className={outlineButtonClass + " w-full mt-8"}>This is how it works</button>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between h-full min-h-[572px] py-16">
            <div className="flex items-center justify-between gap-2">
              <img className="w-[60px] h-[60px]" src={rounded_1} alt="1" />
              <div className="w-full">
                <p className={tipsSubHeader}>Explore Our Products</p>
                <p className={tipsText}>Browse through our wide range of products and choose your favorites.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <img className="w-[60px] h-[60px]" src={rounded_2} alt="2" />
              <div className="w-full">
                <p className={tipsSubHeader}>Order Your Samples</p>
                <p className={tipsText}>For each product, you can order a sample directly from our shop.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <img className="w-[60px] h-[60px]" src={rounded_3} alt="3" />
              <div className="w-full">
                <p className={tipsSubHeader}>Fast Processing</p>
                <p className={tipsText}>Once you place your order, our sample department processes it immediately.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <img className="w-[60px] h-[60px]" src={rounded_4} alt="4" />
              <div className="w-full">
                <p className={tipsSubHeader}>Did you like the sample?</p>
                <p className={tipsText}>Enjoy an special discount if you order the same rug as one of the samples you order.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Producer section */}
      <section className={"md:min-h-[629px] mb-12 bg-[#1f3041] text-[#CCD4DD]"}>
        <div className="max-w-screen-lg m-auto px-4 lg:px-0">
          <div className="flex justify-between pt-20 flex-wrap md:flex-nowrap gap-6 md:gap-6">
            <div className="m-auto">
              <img
                className="h-[437px] w-[395px] rounded-none object-cover"
                src="https://www.indianhandmaderugs.com/wp-content/uploads/2022/06/Quality-Control-carpet-rug-manufacturer-in-india.jpg"
                alt="Producer Image"
              />
            </div>
            <div className="flex flex-col gap-10 justify-start text-left max-w-[519px] m-auto">
              <p className={headerMarkup + " text-white"}>Meet Rajveer</p>
              <p className={tipsText}>
                Rajveer Bhardwaj, founder of Kaarigari Creations, blends traditional Indian rug craftsmanship with modern design. His passion for
                preserving heritage results in exquisite, handwoven rugs that celebrate India’s rich artistry.
              </p>
              <button className={outlineButtonClass + " text-[#CCD4DD] font-normal w-[366px] h-[49px] mb-6"}>Meet our Producers</button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className={"min-h-[721.75px] pt-20 text-left pb-28 " + homeMainBG}>
        <div className="max-w-screen-xl m-auto flex flex-col justify-between ">
          <p className={headerMarkup + " text-center"}>Here’s what our customers are saying</p>
          <div className="mt-12 m-auto w-full px-2">
            <ReviewsCarousel reviews={reviews} />
          </div>
          {/* <button className="text-center text-base font-semibold mt-14 w-fit m-auto">SEE ALL REVIEWS</button> */}
        </div>
      </section>
    </div>
  );
}
