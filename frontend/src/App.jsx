import './App.css'
import ApplicationList from "./components/ApplicationList";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Job Application Tracker
        </h1>
      </header>
      <main>
        <ApplicationList />
      </main>
    </div>
  );
}

