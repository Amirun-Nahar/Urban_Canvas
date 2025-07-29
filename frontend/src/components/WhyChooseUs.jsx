import { 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  HomeModernIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Trusted Partners',
    description: 'All our properties and agents are thoroughly verified for your peace of mind.'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Best Deals',
    description: 'We negotiate the best prices and offer competitive rates in the market.'
  },
  {
    icon: UserGroupIcon,
    title: 'Expert Agents',
    description: 'Our professional agents provide personalized service to meet your needs.'
  },
  {
    icon: HomeModernIcon,
    title: 'Wide Selection',
    description: 'Browse through our extensive collection of premium properties.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Why Choose Us</h2>
          <p className="text-gray-600">Discover the advantages of working with our team</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 