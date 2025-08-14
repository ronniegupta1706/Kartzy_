import React from "react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Return Policy</h1>
        <p className="text-gray-600 mb-4">
          We want you to love your purchase! If you're not satisfied, you can return products
          within 7 days of delivery, provided they are unused and in original packaging.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Initiate a return request via your account dashboard.</li>
          <li>We will arrange a pickup at your address.</li>
          <li>Refunds will be processed within 5-7 business days after inspection.</li>
        </ul>
      </div>
    </div>
  );
}
