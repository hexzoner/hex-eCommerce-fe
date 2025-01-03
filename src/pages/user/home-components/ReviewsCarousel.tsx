import "../../../css/carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Review } from "../../admin/Reviews";
// import { useState } from "react";
import Slider from "react-slick";
import { Rating } from "react-simple-star-rating";
import { NextArrow, PrevArrow } from "./LatestArrivalsCarousel";
import { formatDateShortWithMonthName } from "../../../utils/dateUtils";

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const settings = {
    // centerPadding: "50px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    autoplaySpeed: 1000,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
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
  return (
    <div className="slider-container mb-4">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className="text-sm m-auto  sm:px-3 xl:px-0 xl:max-w-[377px] xl:ml-6 mb-6">
            <div className="flex flex-col justify-between min-h-[379px]  px-16 py-12 border-[1.5px] border-[#1F3041] rounded-none border-opacity-25">
              <div>
                <Rating initialValue={Number(review.rating)} size={20} readonly={true} className="my-1" />
                <p className="font-bold text-[20px]">{review.title}</p>
              </div>
              <p className="">{review.review}</p>
              <div>
                <p className="font-semibold">{review.author}</p>
                <p>{formatDateShortWithMonthName(review.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ReviewsCarousel;
