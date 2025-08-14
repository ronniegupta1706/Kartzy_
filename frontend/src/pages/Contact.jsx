import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center text-lg mb-6">
          We’re here to help! If you have any questions, concerns, or feedback, feel free to reach out to us.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📧 Email</h3>
            <p className="text-gray-600"><a href="mailto:support@kartzy.com" className="text-yellow-600 hover:underline">support@kartzy.com</a></p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📞 Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📍 Address</h3>
            <p className="text-gray-600">RICO Industrial Area, Ajmer Road, Jaipur, India</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">🕒 Working Hours</h3>
            <p className="text-gray-600">Monday - Saturday: 9:00 AM to 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
