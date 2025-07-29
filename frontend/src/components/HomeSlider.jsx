import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    title: 'Find Your Dream Home',
    description: 'Discover the perfect property that matches your lifestyle'
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    title: 'Luxury Properties',
    description: 'Experience luxury living at its finest'
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2029&auto=format&fit=crop',
    title: 'Modern Living',
    description: 'Contemporary homes for modern lifestyles'
  }
];

const HomeSlider = () => {
  return (
    <div className="relative h-[600px] w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50">
                <div className="container mx-auto flex h-full items-center px-4">
                  <div className="max-w-2xl text-white">
                    <h1 className="mb-4 text-5xl font-bold">{slide.title}</h1>
                    <p className="mb-8 text-xl">{slide.description}</p>
                    <button className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary-dark">
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider; 