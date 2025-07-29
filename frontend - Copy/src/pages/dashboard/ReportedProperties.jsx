import { useQuery } from '@tanstack/react-query';
import { FlagIcon } from '@heroicons/react/24/outline';
import api from '../../utils/axios';

const ReportedProperties = () => {
  // Fetch reported properties
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reportedProperties'],
    queryFn: async () => {
      const response = await api.get('/properties/reported');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg">Loading reported properties...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Reported Properties</h1>

      {reports.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No reported properties</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {report.property.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                    Reported
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Report Reason:</h4>
                  <p className="mt-1 text-gray-600">{report.reason}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Additional Details:</h4>
                  <p className="mt-1 text-gray-600">{report.details}</p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reported by:</p>
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={report.reporter.image}
                        alt={report.reporter.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {report.reporter.name}
                        </p>
                        <p className="text-xs text-gray-500">{report.reporter.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={report.property.agent.image}
                      alt={report.property.agent.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {report.property.agent.name}
                      </p>
                      <p className="text-xs text-gray-500">Property Agent</p>
                    </div>
                  </div>
                  <a
                    href={`/properties/${report.property._id}`}
                    className="text-sm font-medium text-primary hover:text-primary/90"
                  >
                    View Property
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedProperties; 