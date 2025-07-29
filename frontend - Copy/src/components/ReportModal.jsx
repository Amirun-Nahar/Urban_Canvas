import { useState } from 'react';

const ReportModal = ({ onClose, onSubmit, isLoading }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reason, details });
  };

  const reportReasons = [
    'Fraudulent listing',
    'Incorrect information',
    'Inappropriate content',
    'Property not available',
    'Price misrepresentation',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Report Property</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Reason Selection */}
          <div className="mb-4">
            <label htmlFor="reason" className="mb-2 block font-medium">
              Reason for Report
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select a reason</option>
              {reportReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div className="mb-4">
            <label htmlFor="details" className="mb-2 block font-medium">
              Additional Details
            </label>
            <textarea
              id="details"
              rows="4"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Please provide more information about the issue..."
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 