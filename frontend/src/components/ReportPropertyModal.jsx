import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

const ReportPropertyModal = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  });

  const reportMutation = useMutation({
    mutationFn: async (data) => {
      return api.post(`/properties/${property._id}/report`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['property-reports']);
      showToast.success('Property reported successfully');
      onClose();
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to report property');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    reportMutation.mutate({
      ...formData,
      reporterName: user.name,
      reporterEmail: user.email
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Report Property
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Report
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="input mt-1"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="fake_listing">Fake Listing</option>
                  <option value="incorrect_info">Incorrect Information</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="input mt-1"
                  placeholder="Please provide more details about your report..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportPropertyModal; 