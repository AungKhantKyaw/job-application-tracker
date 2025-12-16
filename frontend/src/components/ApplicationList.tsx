import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Application } from "../types/Application";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Briefcase } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = "http://127.0.0.1:8001/api/applications/";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string }
> = {
  applied: { bg: "bg-blue-100", text: "text-black" },
  phone_screen: { bg: "bg-green-400", text: "text-white" },
  interview: { bg: "bg-emerald-500", text: "text-white" },
  coding_test: { bg: "bg-amber-500", text: "text-white" },
  second_interview: { bg: "bg-teal-500", text: "text-white" },
  rejected: { bg: "bg-red-500", text: "text-white" },
  offered: { bg: "bg-green-100", text: "text-green" },
  default: { bg: "bg-gray-100", text: "text-gray" },
};

const STATUS_OPTIONS = [
  "all",
  "applied",
  "phone_screen",
  "interview",
  "coding_test",
  "second_interview",
  "offered",
  "rejected",
] as const;

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Application[]>(API_URL);
        const sortedApps = res.data.sort((a, b) => 
          new Date(b.applied_date || 0).getTime() - new Date(a.applied_date || 0).getTime()
        );
        setApplications(sortedApps);
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
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString('en-GB');
  };

  const getStatusClasses = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
    return `${config.bg} ${config.text}`;
  };

  // Compute stats for dashboard
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === "applied").length,
    inProgress: applications.filter(app => 
      ["phone_screen", "interview", "coding_test", "second_interview"].includes(app.status)
    ).length,
    offered: applications.filter(app => app.status === "offered").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };


  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const displayedApps = filteredApplications.filter(app =>
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = applications.length > 0 ? {
    labels: ["Applied", "In Progress", "Offered", "Rejected"],
    datasets: [{
      data: [stats.applied, stats.inProgress, stats.offered, stats.rejected],
      backgroundColor: ["#3B82F6", "#10B981", "#059669", "#EF4444"],
    }],
  } : null;

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
        <div className="text-center mb-6">
          <p className="text-gray-500">
            Keep track of all your job applications in one place.
          </p>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Company or Role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none mb-4"
          />
          <div className="flex justify-center space-x-4 text-sm text-gray-600 flex-wrap">
            <span>Total: {stats.total}</span>
            <span>Applied: {stats.applied}</span>
            <span>In Progress: {stats.inProgress}</span>
            <span>Offered: {stats.offered}</span>
            <span>Rejected: {stats.rejected}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 view-toggle">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border
                ${
                  viewMode === "cards"
                    ? "bg-blue-50 !border-blue-600 text-gray-900 shadow-sm"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800"
                }
              `}
            >
              Cards
            </button>            
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border
                ${
                  viewMode === "list"
                    ? "bg-blue-50 !border-blue-600 text-gray-900 shadow-sm"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800"
                }
              `}
            >
              List
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Filter by Status:
          </label>
          <div className="flex justify-center space-x-2 flex-wrap">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${
                    filterStatus === status
                      ? "bg-blue-50 !border-blue-600 text-black-700 shadow-sm"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800"
                  }`}
              >
                {status.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Cards or List View */}
        {displayedApps.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
            No applications found.
            <span className="block text-gray-400 text-sm mt-1">
              Try a different filter, search, or add some jobs through Django admin.
            </span>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedApps.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-start gap-2 mb-1 line-clamp-2">
                      <Briefcase className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                      {app.position}
                    </h2>
                    <p className="text-gray-500 flex items-center truncate">
                      <span className="w-6 h-6 mr-2 bg-gray-200 rounded flex items-center justify-center text-xs shrink-0">
                        {app.company.charAt(0)}
                      </span>
                      <span className="capitalize">
                        {app.company.toLowerCase()}
                      </span>
                    </p>
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
                  <p className="text-sm text-gray-400">
                    Applied on {formatDate(app.applied_date)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-700">Position</th>
                  <th className="p-4 text-left font-medium text-gray-700">Company</th>
                  <th className="p-4 text-left font-medium text-gray-700">Status</th>
                  <th className="p-4 text-left font-medium text-gray-700">Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {displayedApps.map((app) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4">
                      <Link to={`/applications/${app.id}`} className="text-blue-600 hover:underline">
                        {app.position}
                      </Link>
                    </td>
                    <td className="p-4">{app.company}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(app.status)}`}
                      >
                        {app.status.toUpperCase().replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{formatDate(app.applied_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {applications.length > 0 && chartData && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-2xl shadow-md">
            <h3 className="text-center mb-4 text-lg font-semibold text-gray-800">
              Status Breakdown
            </h3>
            <div className="h-64">
              <Pie
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}