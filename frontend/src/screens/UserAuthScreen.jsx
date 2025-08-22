import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import LandingImage from "../assets/images/LandingImage.png"

export default function UserAuthScreen() {
  const { loginUser, registerUser } = useContext(UserContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password1: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await registerUser(form.name, form.email, form.password1, form.password2);
        setIsRegister(false);
        setForm({ name: "", email: "", password1: "", password2: "" });
      } else {
        await loginUser(form.email, form.password1);
        setForm({ name: "", email: "", password1: "", password2: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setForm({ name: "", email: "", password1: "", password2: "" });
    setError("");
  };

  return (
    <section className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center w-full max-w-6xl">
        {/* Left image */}
        <div className="hidden md:block w-6/12 lg:w-5/12 mb-8 md:mb-0">
          <img
            src={LandingImage}
            className="w-full h-auto max-h-96 object-contain"
            alt="Sample"
          />
        </div>

        {/* Right form */}
        <div className="w-full max-w-md mx-4 md:w-6/12 lg:w-5/12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            {isRegister ? "Register" : "Login"}
          </h1>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
            />
            <input
              type="password"
              name="password1"
              placeholder="Password"
              value={form.password1}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
            />
            {isRegister && (
              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={form.password2}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-gray-500 dark:text-gray-400">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={toggleForm} className="text-primary font-semibold">
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
