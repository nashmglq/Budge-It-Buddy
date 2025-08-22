import React from "react";

function UserAuthScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-2xl font-bold text-dark mb-6 text-center">
          Login
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary focus:outline-none"
          />
        </div>


        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary focus:outline-none"
          />
        </div>


        <button
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 
                     rounded-lg transition"
        >
          Login
        </button>


        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
          <a href="#" className="text-accent hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserAuthScreen;
