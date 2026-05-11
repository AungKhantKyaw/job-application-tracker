import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { Application } from "../types/Application";

const API_URL = import.meta.env.VITE_API_URL + 'applications/';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!application) return;

    try {
      const res = await api.patch<Application>(
        `applications/${application.id}/`,
        formData
      );

      setApplication(res.data);
      setIsEditing(false);
      setSuccessMessage("Application updated successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      alert("Failed to update application");
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get<Application>(`${API_URL}${id}/`);
        setApplication(res.data);
        setFormData(res.data);
      } catch {
        setError("Failed to load application.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-10 rounded-2xl shadow text-center text-red-600">
          {error || "Application not found."}
          <Link
            to="/"
            className="mt-4 block px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          &larr; Back to list
        </Link>

        {successMessage && (
          <div className="rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded !bg-blue-600 text-white hover:!bg-blue-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setFormData(application);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded !bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded !bg-green-600 text-white hover:!bg-green-700"
              >
                Save
              </button>
            </>
          )}
        </div>


        {isEditing ? (
          <input
            className="w-full text-2xl font-bold border rounded p-2"
            value={formData.position || ""}
            onChange={e =>
              setFormData({ ...formData, position: e.target.value })
            }
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-800">
            {application.position}
          </h1>
        )}

        {isEditing ? (
          <input
            className="w-full border rounded p-2"
            value={formData.company || ""}
            onChange={e =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
        ) : (
          <p className="text-gray-500">{application.company}</p>
        )}

        <div className="flex space-x-2 items-center">
          {isEditing ? (
            <select
              className="border rounded px-2 py-1"
              value={formData.status}
              onChange={e =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              {[
                "applied",
                "phone_screen",
                "interview",
                "coding_test",
                "second_interview",
                "offered",
                "rejected",
              ].map(s => (
                <option key={s} value={s}>
                  {s.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
              {application.status}
            </span>
          )}

          <div className="flex items-center gap-2">
            {!isEditing ? (
              application.location && (
                <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-600">
                  {application.location}
                </span>
              )
            ) : (
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
                className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <div className="space-y-3 text-gray-700 text-sm">
          <div>
            <span className="font-medium">Salary:</span>{" "}
            {!isEditing ? (
              application.salary_range || "—"
            ) : (
              <input
                value={formData.salary_range || ""}
                onChange={(e) =>
                  setFormData({ ...formData, salary_range: e.target.value })
                }
                className="ml-2 px-2 py-1 border rounded text-sm"
                placeholder="Salary range"
              />
            )}
          </div>
          
          <div>
            <span className="font-medium">Job URL:</span>{" "}
            {!isEditing ? (
              application.job_url ? (
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {application.job_url}
                </a>
              ) : (
                "—"
              )
            ) : (
              <input
                value={formData.job_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, job_url: e.target.value })
                }
                className="ml-2 px-2 py-1 border rounded text-sm w-full"
                placeholder="https://job-link"
              />
            )}
          </div>

          <div>
            <span className="font-medium block">Description:</span>
            {!isEditing ? (
              <p className="mt-1">{application.description || "—"}</p>
            ) : (
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="mt-1 w-full px-2 py-1 border rounded text-sm"
              />
            )}
          </div>

          <div>
            <span className="font-medium block">Notes:</span>
            {!isEditing ? (
              <p className="mt-1">{application.notes || "—"}</p>
            ) : (
              <textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="mt-1 w-full px-2 py-1 border rounded text-sm"
              />
            )}
          </div>

          <div>
            <span className="font-medium">Applied on:</span>{" "}
            {!isEditing ? (
              formatDate(application.applied_date)
            ) : (
              <input
                type="date"
                value={formData.applied_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, applied_date: e.target.value })
                }
                className="ml-2 px-2 py-1 border rounded text-sm"
              />
            )}
          </div>

          <div>
            <span className="font-medium">Follow-up date:</span>{" "}
            {!isEditing ? (
              formatDate(application.follow_up_date)
            ) : (
              <input
                type="date"
                value={formData.follow_up_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, follow_up_date: e.target.value })
                }
                className="ml-2 px-2 py-1 border rounded text-sm"
              />
            )}
          </div>

          <div>
            <span className="font-medium">Created at:</span>{" "}
            {formatDate(application.created_at)}
          </div>

          <div>
            <span className="font-medium">Updated at:</span>{" "}
            {formatDate(application.updated_at)}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Status Timeline
        </h2>

        {application.status_history?.length ? (
          <div className="relative pl-6">
            {/* vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300" />

            <div className="space-y-6">
              {application.status_history.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />

                  <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {entry.status.replace(/_/g, " ").toUpperCase()}
                      </span>

                      <span className="text-xs text-gray-500">
                        {formatDate(entry.changed_at)}
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No status updates yet.
          </p>
        )}
      </div>

    </div>
  );
}
