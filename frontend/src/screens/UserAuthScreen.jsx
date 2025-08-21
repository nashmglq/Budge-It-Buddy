import React from "react";

function UserAuthScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-80">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🔑 UserAuthScreen
        </h1>
        <p className="text-gray-600">If you see colors & styling, Tailwind is working!</p>
        <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default UserAuthScreen;
