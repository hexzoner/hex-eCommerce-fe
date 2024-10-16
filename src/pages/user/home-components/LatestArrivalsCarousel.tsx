import "../../../css/carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const LatestArrivalsCarousel = ({ products }: { products: any[] }) => {
  // State to track the current slide
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  // Number of total slides
  const totalSlides = products.length;
  const slideToShow = 5;

  const settings = {
    initailSlide: 0,
    dots: false, // Disable dots navigation
    infinite: true, // Infinite scrolling
    speed: 500,
    slidesToShow: slideToShow, // Adjust to show 5 items at a time (center + sides)
    slidesToScroll: 1,
    centerMode: true, // Enables center item
    centerPadding: "0px", // No padding around the center item
    arrows: true, // Show arrows for navigation
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex: number, newIndex: number) => {
      if (oldIndex > 0) oldIndex = 0;
      setCurrent(newIndex);
    }, // Update current slide on change
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  // Function to calculate the correct scaling factor
  const getScale = (index: number) => {
    // const normalizedIndex = (index + slideToShow) % slideToShow; // Ensure the index is within bounds
    // const relativePos = (normalizedIndex - current + slideToShow) % slideToShow; // Calculate the relative position
    const relativePos = (index - current + totalSlides) % totalSlides; // Calculate the relative position

    if (relativePos === 0) return "scale-[101%]"; // Center slide
    if (relativePos === 1 || relativePos === totalSlides - 1) return "scale-[80%]"; // Sides around center
    return "scale-[60%]"; // Outermost slides
  };

  return (
    <div className="max-w-screen-xl m-auto slider-container px-0">
      <Slider {...settings}>
        {products.map((product, index) => {
          // Getting the last element of the link to use as the product ID
          const productId = product.link.split("/").pop();

          return (
            <div key={product.id} className="relative cursor-pointer">
              <div className={`transition-transform duration-300 ${getScale(index)} overflow-visible`}>
                <img
                  onClick={() => navigate(`/product/${productId}`)}
                  src={product.image}
                  alt={`Product ${productId}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};
// Custom arrows for the carousel
export const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow right-arrow text-center" onClick={onClick}>
      &#10095; {/* Right arrow symbol */}
    </div>
  );
};

export const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow left-arrow text-center" onClick={onClick}>
      &#10094; {/* Left arrow symbol */}
    </div>
  );
};

export default LatestArrivalsCarousel;
