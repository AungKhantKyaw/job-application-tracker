import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated } from "../utils/auth";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="
      sticky top-0 z-50
      bg-white shadow-sm
      h-16
      flex items-center justify-between
      px-6
    ">
      <h1 className="text-xl font-bold text-gray-800 p-4">
        Job Application Tracker
      </h1>

      <div className="space-x-4">
        {isAuthenticated() ? (
          <button
            onClick={handleLogout}
            className="!bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="!bg-blue-500 text-white px-3 py-1 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="!bg-green-500 text-white px-3 py-1 rounded"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}
