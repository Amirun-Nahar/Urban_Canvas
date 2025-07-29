import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold">RealEstate</h2>
            <p className="mt-4 text-gray-400">
              Your trusted partner in finding the perfect property. We make real estate simple and accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-gray-400 hover:text-white">
                  Our Agents
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-400">
                123 Real Estate Street
              </li>
              <li className="text-gray-400">
                City, State 12345
              </li>
              <li className="text-gray-400">
                Phone: (123) 456-7890
              </li>
              <li className="text-gray-400">
                Email: info@realestate.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="mt-4 text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-l-md border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 