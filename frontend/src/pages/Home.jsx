import HomeSlider from '../components/HomeSlider';
import AdvertisedProperties from '../components/AdvertisedProperties';
import LatestReviews from '../components/LatestReviews';
import WhyChooseUs from '../components/WhyChooseUs';
import NewsletterSection from '../components/NewsletterSection';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <HomeSlider />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Featured Properties */}
      <AdvertisedProperties />

      {/* Latest Reviews */}
      <LatestReviews />

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
};

export default Home; 