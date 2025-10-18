import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Application } from "../types/Application";

const API_URL = "http://127.0.0.1:8001/api/applications/";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string }
> = {
  applied: { bg: "bg-blue-100", text: "text-blue-600" },
  phone_screen: { bg: "bg-green-400", text: "text-white-600" },
  interviewing: { bg: "bg-yellow-100", text: "text-yellow-600" },
  rejected: { bg: "bg-red-100", text: "text-red-600" },
  offered: { bg: "bg-green-100", text: "text-green-600" },
  default: { bg: "bg-gray-100", text: "text-gray-600" },
};

const STATUS_OPTIONS = [
  "all",
  "applied",
  "phone_screen",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Application[]>(API_URL);
        setApplications(res.data);
      } catch {
        setError("Failed to load applications. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  const getStatusClasses = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
    return `${config.bg} ${config.text}`;
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow text-center text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-gray-500">
            Keep track of all your job applications in one place.
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
            Filter by Status:
        </label>
        <div className="flex justify-center space-x-2 flex-wrap">
            {STATUS_OPTIONS.map((status) => (
            <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterStatus === status
                    ? "bg-blue-600 text-black hover:bg-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
                {status.toUpperCase().replace("_", " ")}
            </button>
            ))}
        </div>
        </div>

        {/* Card List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
            No applications found.
            <span className="block text-gray-400 text-sm mt-1">
              Try a different filter or add some jobs through Django admin.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredApplications.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {app.position}
                    </h2>
                    <p className="text-gray-500">{app.company}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                      app.status
                    )}`}
                  >
                    {app.status.toUpperCase().replace("_", " ")}
                  </span>
                </div>

                {app.applied_date && (
                  <p className="mt-4 text-sm text-gray-400">
                    Applied on {formatDate(app.applied_date)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}