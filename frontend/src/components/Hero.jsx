import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    appendDots: dots => (
      <div className="absolute bottom-4 w-full flex justify-center">{dots}</div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white rounded-full mx-1"></div>
    ),
  };

  const slides = [
    {
      title: "Upgrade Your Tech Today",
      img: "slider1.png",
      alt: "Electronics",
      link: "/products/electronics",
    },
    {
      title: "Style Reimagined for You",
      img: "slider2.png",
      alt: "Clothing",
      link: "/products/clothing",
    },
    {
      title: "Power Through with Premium Kicks",
      img: "slider3.jpg",
      alt: "Footwear",
      link: "/products/shoes",
    },
    {
      title: "Modern Comfort for Every Room",
      img: "slider4.jpg",
      alt: "Furniture",
      link: "/products/furniture",
    },
  ];

  return (
    <div className="bg-yellow-50 py-4">
      <div className="w-full max-w-[1200px] mx-auto rounded relative">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div key={idx} onClick={() => navigate(slide.link)} className="cursor-pointer relative">
              <img src={slide.img} alt={slide.alt} className="w-full h-[400px] object-cover rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg flex flex-col justify-center px-10 py-6 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                <button className="bg-white text-black px-4 py-2 rounded font-semibold w-fit" onClick={() => navigate(slide.link)}>
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
