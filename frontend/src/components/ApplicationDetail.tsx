import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Application } from "../types/Application";

const API_URL = "http://127.0.0.1:8001/api/applications/";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get<Application>(`${API_URL}${id}/`);
        setApplication(res.data);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          &larr; Back to list
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">{application.position}</h1>
        <p className="text-gray-500">{application.company}</p>

        <div className="flex space-x-2 items-center">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
            {application.status}
          </span>
          {application.location && (
            <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-600">
              {application.location}
            </span>
          )}
        </div>

        <div className="space-y-2 text-gray-700 text-sm">
          {application.salary_range && (
            <p>
              <span className="font-medium">Salary:</span> {application.salary_range}
            </p>
          )}
          {application.job_url && (
            <p>
              <span className="font-medium">Job URL:</span>{" "}
              <a
                href={application.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {application.job_url}
              </a>
            </p>
          )}
          {application.description && (
            <p>
              <span className="font-medium">Description:</span> {application.description}
            </p>
          )}
          {application.notes && (
            <p>
              <span className="font-medium">Notes:</span> {application.notes}
            </p>
          )}
          <p>
            <span className="font-medium">Applied on:</span>{" "}
            {formatDate(application.applied_date)}
          </p>
          <p>
            <span className="font-medium">Follow-up date:</span>{" "}
            {formatDate(application.follow_up_date)}
          </p>
          <p>
            <span className="font-medium">Created at:</span>{" "}
            {formatDate(application.created_at)}
          </p>
          <p>
            <span className="font-medium">Updated at:</span>{" "}
            {formatDate(application.updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
