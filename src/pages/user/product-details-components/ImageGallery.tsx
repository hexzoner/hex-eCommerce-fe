import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper"; // Import SwiperCore and modules
// Import Swiper styles

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import "./styles.css";

import { Swiper as SwiperType } from "swiper/types"; // Import the Swiper type for proper typing
import { Zoom, Thumbs, Navigation, Pagination } from "swiper/modules";

// Register Swiper modules
SwiperCore.use([Thumbs, Zoom]);

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full -z-50">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#000",
            "--swiper-pagination-color": "#000",
          } as React.CSSProperties
        }
        spaceBetween={10}
        // zoom={{ maxRatio: 3 }}
        zoom={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} // Thumbs connection with check
        modules={[Thumbs, Zoom, Navigation, Pagination]} // Modules for the main Swiper
        className="mb-4 mySwiper">
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="swiper-zoom-container">
              <img src={src} alt={`Slide ${index + 1}`} className="w-full h-96" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={(swiper) => setThumbsSwiper(swiper)} // Set Swiper instance
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Thumbs]} // Only Thumbs module needed here
        className="thumbs-carousel max-w-sm">
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Thumbnail ${index + 1}`} className="rounded-md border border-gray-300 w-20 h-20 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageGallery;
