import React from "react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shipping Information</h1>
        <p className="text-gray-600 mb-4">
          We currently ship all over India with an estimated delivery time of 3-7 business days.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Standard Shipping: Free for orders above ₹500.</li>
          <li>Express Shipping: Available at an extra cost.</li>
          <li>Tracking: A tracking link will be emailed to you after dispatch.</li>
        </ul>
      </div>
    </div>
  );
}
