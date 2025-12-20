import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Application } from "../types/Application";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Briefcase, Trash2, Calendar } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL + 'applications/';

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

const getAccentBorder = (status: string) => {
  switch (status) {
    case "offered":
      return "border-l-green-400";
    case "rejected":
      return "border-l-red-400";
    case "applied":
      return "border-l-blue-300";
    default:
      return "border-l-gray-200";
  }
};

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({
    company: "",
    position: "",
    status: "applied",
    location: "",
    salary_range: "",
    job_url: "",
    description: "",
    applied_date: new Date().toISOString().slice(0, 10),
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application? This cannot be undone."
    );
    if (!confirmed) return;
    deleteApplication(id);
  };

  const addApplication = async () => {
    try {
      const res = await api.post<Application>("applications/", newApp);
      setApplications(prev => [res.data, ...prev]);
      setShowForm(false);
      setNewApp({
        company: "",
        position: "",
        status: "applied",
        location: "",
        salary_range: "",
        job_url: "",
        description: "",
        applied_date: new Date().toISOString().slice(0, 10),
      });
      setSuccessMessage("Application created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      alert("Failed to add application");
    }
  };

  const updateApplication = async (id: number, updates: Partial<Application>) => {
    const res = await api.patch<Application>(`applications/${id}/`, updates);
    setApplications(prev =>
      prev.map(app => (app.id === id ? res.data : app))
    );
  };

  const deleteApplication = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`applications/${id}/`);
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get<Application[]>("applications/");
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
    <div className="bg-[#f8fafc] p-8">
      <div className="max-w-4xl mx-auto">
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3">
          {successMessage}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Application</h2>

            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Company"
              value={newApp.company}
              onChange={e => setNewApp({ ...newApp, company: e.target.value })}
            />

            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Position"
              value={newApp.position}
              onChange={e => setNewApp({ ...newApp, position: e.target.value })}
            />

            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Location"
              value={newApp.location}
              onChange={e => setNewApp({ ...newApp, location: e.target.value })}
            />

            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Salary Range"
              value={newApp.salary_range}
              onChange={e => setNewApp({ ...newApp, salary_range: e.target.value })}
            />

            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Job URL"
              value={newApp.job_url}
              onChange={e => setNewApp({ ...newApp, job_url: e.target.value })}
            />

            <textarea
              className="w-full mb-3 p-2 border rounded resize-none"
              placeholder="Description"
              value={newApp.description}
              onChange={e => setNewApp({ ...newApp, description: e.target.value })}
              rows={4}
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={newApp.status}
              onChange={e => setNewApp({ ...newApp, status: e.target.value })}
            >
              {STATUS_OPTIONS.filter(s => s !== "all").map(s => (
                <option key={s} value={s}>
                  {s.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="w-full mb-4 p-2 border rounded"
              value={newApp.applied_date}
              onChange={e => setNewApp({ ...newApp, applied_date: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addApplication}
                className="px-4 py-2 rounded !bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-6 space-y-4">
        <p className="text-gray-500">
          Keep track of all your job applications in one place.
        </p>
      </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by Company or Role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
          />

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-3 !bg-gray-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          + Add Application
        </button>
        </div>


        <div className="mb-6">
          <div className="flex justify-center space-x-4 text-sm text-gray-600 flex-wrap">
            <span>Total: {stats.total}</span>
            <span>Applied: {stats.applied}</span>
            <span>In Progress: {stats.inProgress}</span>
            <span>Offered: {stats.offered}</span>
            <span>Rejected: {stats.rejected}</span>
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

        {displayedApps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <Briefcase className="w-10 h-10 text-gray-300" />
            </div>

            <h3 className="text-lg font-semibold text-gray-700">
              No applications yet
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Start by adding a job application or adjust your filters.
            </p>
          </div>
        ) : 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedApps.map((app) => (
               <div
                  onClick={() => navigate(`/applications/${app.id}`)}
                  key={app.id}                 
                    className={`block bg-white rounded-2xl shadow-md p-6 transition
                      hover:shadow-lg hover:-translate-y-0.5 cursor-pointer
                      border-l-4 ${getAccentBorder(app.status)}
                    `}
                >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-start gap-2 mb-1 line-clamp-2">
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
                </div>
                <hr className="my-3 border-gray-100" />

                {app.applied_date && (
                  <div className="flex items-center text-xs text-gray-400 mb-3 gap-1">
                    <Calendar size={14} />
                    Applied on {formatDate(app.applied_date)}
                  </div>
                )}

                <div className="flex items-center justify-between group">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full
                      transition-all duration-300 ease-in-out
                      ${getStatusClasses(app.status)}
                    `}
                  >
                    {app.status.toUpperCase().replace("_", " ")}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select
                      value={app.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateApplication(app.id, { status: e.target.value });
                      }}
                      className="px-2 py-1 text-xs rounded border border-gray-300 bg-white"
                    >
                      {STATUS_OPTIONS.filter(s => s !== "all").map(status => (
                        <option key={status} value={status}>
                          {status.toUpperCase().replace("_", " ")}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(app.id);
                      }}
                      className="
                        opacity-0 group-hover:opacity-100
                        text-red-500 hover:text-red-700
                        p-1 rounded-full hover:bg-red-50
                        transition-opacity transition-colors
                      "
                      aria-label="Delete application"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }

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