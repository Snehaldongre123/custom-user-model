import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const logout = async () => {
    await fetch("http://127.0.0.1:8000/logout/", {
      credentials: "include"
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-black text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="space-x-4">

        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 px-6 py-2 rounded-lg hover:scale-105 transition"
        >
          Profile
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-6 py-2 rounded-lg hover:scale-105 transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;