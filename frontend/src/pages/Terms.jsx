import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Terms of Service</h1>
        <p className="text-gray-600 mb-4">
          By using our platform, you agree to our terms and conditions outlined below.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>All products are subject to availability.</li>
          <li>Prices may change without notice.</li>
          <li>Misuse of our platform will result in account termination.</li>
        </ul>
      </div>
    </div>
  );
}
