import React, { useState, useRef } from "react";
import {
  Swiper,
  SwiperSlide,
  SwiperRef,
  // useSwiper
} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../../css/ImageGallery.css";

import { Swiper as SwiperType } from "swiper/types";
import { Zoom, Thumbs, Navigation, Pagination } from "swiper/modules";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperRef>(null);
  const style = {
    "--swiper-navigation-color": "#000",
    "--swiper-pagination-color": "#000",
  } as React.CSSProperties;

  const handleMouseEnter = () => {
    if (mainSwiperRef.current?.swiper && mainSwiperRef.current.swiper.zoom) {
      mainSwiperRef.current.swiper.zoom.in(); // Access Swiper instance for zoom in
    }
  };

  const handleMouseLeave = () => {
    if (mainSwiperRef.current?.swiper && mainSwiperRef.current.swiper.zoom) {
      mainSwiperRef.current.swiper.zoom.out(); // Access Swiper instance for zoom out
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const swiperInstance = mainSwiperRef.current?.swiper;
    if (swiperInstance && swiperInstance.zoom) {
      const zoomScale = swiperInstance.zoom.scale;

      if (zoomScale && zoomScale > 1) {
        const slide = e.currentTarget;
        const rect = slide.getBoundingClientRect();

        // Calculate mouse position within the slide
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Calculate movement relative to slide size
        const moveX = (offsetX / rect.width - 0.5) * 2; // from -1 to 1
        const moveY = (offsetY / rect.height - 0.5) * 2;

        // Adjust the image position by changing the translate
        const zoomContainer = slide.querySelector(".swiper-zoom-container") as HTMLElement;
        if (zoomContainer) {
          zoomContainer.style.transform = `scale(${zoomScale}) translate(${-moveX * 50}%, ${-moveY * 50}%)`;
        }
      }
    }
  };

  return (
    <div className="w-full">
      {/* Main Swiper */}
      <Swiper
        ref={mainSwiperRef}
        style={style}
        spaceBetween={10}
        zoom={{
          maxRatio: 1.5,
        }}
        // navigation={true}
        // pagination={{
        //   clickable: true,
        // }}
        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} // Thumbs connection with check
        modules={[Thumbs, Zoom, Navigation, Pagination]} // Modules for the main Swiper
        className="mb-4 mySwiper">
        {images.map((src, index) => (
          <SwiperSlide
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            key={index}
            className="flex items-center justify-center">
            <div className="swiper-zoom-container">
              <img src={src} alt={`Slide ${index + 1}`} className="w-full h-[30rem] px-6" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails Swiper */}
      {images.length > 1 && (
        <div className="relative flex items-center w-full">
          <Swiper
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            spaceBetween={0}
            slidesPerView={4}
            // freeMode={true}
            watchSlidesProgress={true}
            slidesPerGroup={4}
            style={style}
            navigation={images.length > 4}
            modules={[Thumbs, Navigation, Pagination]}
            className="thumbs-carousel max-w-[40rem] relative">
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded-md border border-gray-300 w-24 h-20 object-cover cursor-pointer m-auto"
                />
              </SwiperSlide>
            ))}
            {/* <NavButtons /> */}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

// function NavButtons() {
//   const swiper = useSwiper();
//   return (
//     <div className="flex justify-between text-sm absolute bottom-5 z-50 w-[42rem]">
//       <button onClick={() => swiper.slidePrev()} className="btn btn-outline rounded-full btn-sm font-semibold text-lg px-[10px]">
//         &lt;
//       </button>
//       <button onClick={() => swiper.slideNext()} className="btn btn-outline rounded-full btn-sm font-semibold text-lg px-[10px] mr-8">
//         &gt;
//       </button>
//     </div>
//   );
// }
