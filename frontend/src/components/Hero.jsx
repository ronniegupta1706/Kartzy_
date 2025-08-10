import React from 'react';
import Slider from 'react-slick';

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400, // ⬅ slightly faster than 500
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500, // ⬅ reduced so it switches sooner
    arrows: true,
    fade: true,
    appendDots: dots => (
      <div className="absolute bottom-4 w-full flex justify-center">{dots}</div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-yellow-400 rounded-full mx-1"></div> // ⬅ changed color to yellow
    ),
  };

  const slides = [
    {
      headline: "🚀 Delivered Before You Miss Us",
      subtitle: "Lightning-fast shipping that’s always on time.",
      img: "/images/sliders/slider1.png",
      alt: "Fast Delivery",
    },
    {
      headline: "✨ Where Craft Meets Class",
      subtitle: "Every stitch, fold, and finish made with perfection.",
      img: "/images/sliders/slider2.jpg",
      alt: "Craftsmanship",
    },
    {
      headline: "🎨 Bags That Turn Heads",
      subtitle: "Bold, vibrant, and made to match your vibe.",
      img: "/images/sliders/slider3.jpg",
      alt: "Colorful Bags",
    },
    {
      headline: "❤️ Your Happiness, Our Promise",
      subtitle: "Because every smile is worth it.",
      img: "/images/sliders/slider4.jpg",
      alt: "Happy Customer",
    },
  ];

  return (
    <div className="bg-yellow-50 py-4">
      <div className="w-full max-w-[1200px] mx-auto rounded relative">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div key={idx} className="relative">
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg flex flex-col justify-center px-10 py-6 text-white">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
                  {slide.headline}
                </h2>
                <p className="text-lg md:text-xl max-w-[500px] font-medium">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
