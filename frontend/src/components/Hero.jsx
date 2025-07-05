import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom'; 

// Import slick styles in App.js or index.js
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,   
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const slides = [
    {
      title: "Best deal on Electronics",
      img: "slider1.png",
      alt: "Electronics Sale ",
      link: "/products/electronics",
    },
    {
      title: "Trending Sale - up to 60% off",
      img: "slider2.png",
      alt: "Clothing Sale",
      link: "/products/clothing",
    },
    {
      title: "Gear Up - Sports Footwear",
      img: "slider3.jpg",
      alt: "Sports Footwear Sale",
      link: "/products/shoes",
    },
    {
      title: "Furnish Your Home in Style",
      img: "slider4.jpg",
      alt: "Furniture Collection",
      link: "/products/furniture",
    },
  ];

  return (
    <div className="bg-yellow-50 py-4">
      <div className="w-full max-w-[1200px] mx-auto rounded ">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => navigate(slide.link)}
              className="cursor-pointer relative"
            >
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-[400px]"
              />
              <div className="absolute top-6 left-6 bg-white bg-opacity-80 px-4 py-2 rounded shadow text-xl font-semibold text-gray-900">
                {slide.title}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;

