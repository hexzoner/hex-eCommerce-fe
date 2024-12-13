import "../../../css/carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Review } from "../../admin/Reviews";
// import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
import { NextArrow, PrevArrow } from "../home-components/LatestArrivalsCarousel";
import { formatDateShortWithMonthName } from "../../../utils/dateUtils";

export default function FeaturedReviewsCarousel({ reviews }: { reviews: Review[] }) {
  // if (products.length == 0) return <></>;
  const settings = {
    // centerPadding: "50px",
    dots: false,
    infinite: reviews.length > 2 ? true : false,
    speed: 500,
    slidesToShow: reviews.length > 2 ? 2 : reviews.length,
    slidesToScroll: reviews.length > 2 ? 2 : reviews.length,
    arrows: reviews.length > 2 ? true : false,
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

  // const navigate = useNavigate();
  return (
    <div className={`slider-container ${settings.slidesToShow > 1 ? "max-w-[40rem]" : "max-w-[20rem]"} `}>
      {reviews.length > 0 && (
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index} className="text-sm m-auto ">
              <div className="flex gap-2 flex-col justify-between px-6 py-8 flex-wrap ">
                {/* <img
                  onClick={() => {
                    navigate(`/product/${review.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer object-cover"
                  src={review.image}
                  alt="review image"
                /> */}
                <div>
                  <Rating initialValue={Number(review.rating)} size={20} readonly={true} className="my-1" />
                  {/* <p className="font-semibold text-center">{review.author}</p> */}
                </div>

                <p className="text-justify">{review.review}</p>
                <div>
                  <p className="font-semibold text-left">{review.author}</p>
                  <p className="text-xs mt-1">{formatDateShortWithMonthName(review.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
