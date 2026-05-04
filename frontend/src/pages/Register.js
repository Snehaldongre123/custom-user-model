import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setMessage("Please fill username and password");
      return;
    }

    try {
      const res = await fetch("/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 700);
      }
    } catch (err) {
      setMessage("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Register to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-medium shadow-md"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}