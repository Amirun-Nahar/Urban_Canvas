import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { showToast } from '../utils/toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      showToast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <EnvelopeIcon className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
          <p className="mb-8 text-lg">
            Subscribe to our newsletter to receive the latest updates about new properties,
            market trends, and exclusive offers.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-lg bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="mt-4 text-sm opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 