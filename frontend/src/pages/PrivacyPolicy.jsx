import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4 text-gray-600">
          At Kartzy, we respect your privacy and are committed to protecting your personal data.
          This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="text-gray-600 mb-4">
          We may collect your name, email, phone number, shipping address, and payment details
          to process orders and improve our services.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>To process and deliver your orders.</li>
          <li>To provide customer support.</li>
          <li>To send you promotional offers (only if you opt-in).</li>
        </ul>
      </div>
    </div>
  );
}
