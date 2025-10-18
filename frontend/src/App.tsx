import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationList from "./components/ApplicationList";
import ApplicationDetail from "./components/ApplicationDetail";



export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Job Application Tracker
          </h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<ApplicationList />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}