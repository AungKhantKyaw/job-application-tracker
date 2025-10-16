import { useEffect, useState } from "react";
import axios from "axios";

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/applications/")
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gray-500">
            Keep track of all your job applications in one place.
          </p>
        </div>

        {/* Card List */}
        {applications.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
            No applications yet.  
            <span className="block text-gray-400 text-sm mt-1">
              Add some jobs through the Django admin or API.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {app.position}
                    </h2>
                    <p className="text-gray-500">{app.company}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      app.status === "Applied"
                        ? "bg-blue-100 text-blue-600"
                        : app.status === "Interviewing"
                        ? "bg-yellow-100 text-yellow-600"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {app.date_applied && (
                  <p className="mt-4 text-sm text-gray-400">
                    Applied on {new Date(app.date_applied).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
