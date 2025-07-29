import { HomeIcon, UserGroupIcon, ShieldCheckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      name: 'Trusted Properties',
      description: 'All our properties are thoroughly verified and inspected to ensure quality and authenticity.',
      icon: HomeIcon,
    },
    {
      name: 'Expert Agents',
      description: 'Our platform connects you with experienced real estate professionals who understand your needs.',
      icon: UserGroupIcon,
    },
    {
      name: 'Secure Transactions',
      description: 'Every transaction is protected with state-of-the-art security measures and encryption.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Wide Selection',
      description: 'Browse through thousands of properties across different locations and price ranges.',
      icon: BuildingOfficeIcon,
    },
  ];

  const stats = [
    { label: 'Properties Listed', value: '10,000+' },
    { label: 'Happy Customers', value: '25,000+' },
    { label: 'Expert Agents', value: '500+' },
    { label: 'Cities Covered', value: '50+' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Trusted Real Estate Partner
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're dedicated to making your property journey seamless and successful. Whether you're buying, selling, or renting, our platform provides the tools and expertise you need.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in real estate
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines cutting-edge technology with industry expertise to provide you with the best real estate experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by thousands of customers
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Our numbers speak for themselves
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-white p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-indigo-600">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 