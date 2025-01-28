import "../../../css/carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../admin/Products";
// import { useState } from "react";
import Slider from "react-slick";
// import { Rating } from "react-simple-star-rating";
import { useNavigate } from "react-router-dom";
import { NextArrow, PrevArrow } from "../home-components/LatestArrivalsCarousel";
import { getProductMainImageUrl } from "../../../utils/miscUtils";
import { calculatePriceRange } from "../../../utils/miscUtils";

function RugsByProducer({ products }: { products: Product[] }) {
  // if (products.length == 0) return <></>;
  const settings = {
    // centerPadding: "50px",
    // dots: products.length > 3 ? true : false,
    infinite: products.length > 3 ? true : false,
    speed: 500,
    slidesToShow: products.length > 3 ? 3 : products.length,
    slidesToScroll: products.length > 3 ? 3 : products.length,
    arrows: products.length > 3 ? true : false,
    autoplaySpeed: 1000,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const navigate = useNavigate();
  return (
    <div className={`slider-container lg:max-w-full sm:max-w-[25rem] max-w-[20rem]`}>
      {products.length > 0 && (
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="text-sm m-auto ">
              <div className="flex flex-col justify-between px-6 py-8 gap-4 items-start">
                <img
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer object-cover"
                  src={getProductMainImageUrl(product)}
                  alt="product image"
                />
                <div>
                  {/* <Rating initialValue={Number(product.rating)} size={20} readonly={true} className="my-1" /> */}
                  <p className="font-bold text-center text-[20px]">{product.name}</p>
                </div>
                <p className="text-center text-[16px] font-normal">{calculatePriceRange(product)}</p>

                {/* <p className="">{product.review}</p> */}
                {/* <p className="font-semibold">{product.author}</p> */}
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default RugsByProducer;
