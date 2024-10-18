import "../../../css/carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Review } from "../../admin/Reviews";
// import { useState } from "react";
import Slider from "react-slick";
import { Rating } from "react-simple-star-rating";
import { NextArrow, PrevArrow } from "./LatestArrivalsCarousel";

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const settings = {
    // centerPadding: "50px",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
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
    <div className="slider-container">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className="text-sm m-auto px-12 sm:px-3 xl:px-0 xl:max-w-[208px] xl:ml-6">
            <div className="flex flex-col justify-between min-h-[327.75px] bg-[#f6f6f6] px-6 py-8 border-[1.5px] border-black rounded-xl border-opacity-25">
              <div>
                <Rating initialValue={Number(review.rating)} size={20} readonly={true} className="my-1" />
                <p className="font-semibold">{review.title}</p>
              </div>
              <p className="">{review.review}</p>
              <p className="font-semibold">{review.author}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ReviewsCarousel;
