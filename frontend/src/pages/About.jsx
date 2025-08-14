import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">About Us</h1>
        <p className="text-gray-600 mb-4 text-lg leading-relaxed">
          Welcome to <strong>Kartzy</strong>, your trusted partner in delivering quality products
          and exceptional service. Our mission is to provide customers with the best shopping
          experience — from browsing our platform to receiving their orders on time.
        </p>
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          Founded in 2025, we have built a reputation for reliability, innovation, and customer
          satisfaction. We believe in creating lasting relationships with our customers by ensuring
          every interaction is seamless and pleasant.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Values</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
          <li><strong>Customer First</strong> – We prioritize your needs above all else.</li>
          <li><strong>Quality Assurance</strong> – Only the best products make it to our shelves.</li>
          <li><strong>Transparency</strong> – Clear communication and honest pricing.</li>
          <li><strong>Innovation</strong> – Constantly improving our services to serve you better.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Journey</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          From a small local business to a trusted online platform, our growth is a reflection of
          our commitment to excellence. We are constantly evolving, adding new products, and
          expanding our reach to meet the demands of our ever-growing customer base.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Information</h2>
        <p className="text-gray-600 text-lg">📧 Email: <a href="mailto:support@kartzy.com" className="text-yellow-600 hover:underline">support@kartzy.com</a></p>
        <p className="text-gray-600 text-lg">📞 Phone: +91 98765 43210</p>
      </div>
    </div>
  );
}
