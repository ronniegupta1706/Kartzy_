import React from "react";

export default function FAQs() {
  const faqs = [
    { 
      q: "How can I check my orders?", 
      a: "You can view all your current and past orders by clicking the 'Orders' icon on your account dashboard." 
    },
    { 
      q: "What payment methods do you accept?", 
      a: "We accept credit/debit cards, UPI, net banking, and COD (Cash on Delivery)." 
    },
    { 
      q: "Can I return or exchange a product?", 
      a: "We accept returns or exchanges only for defective or damaged products, provided you contact us within 48 hours of delivery." 
    },
    { 
      q: "Do you offer international shipping?", 
      a: "Currently, we only ship within India. We are working to expand internationally soon." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Frequently Asked Questions
        </h1>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">❓ {faq.q}</h3>
            <p className="text-gray-600 text-lg">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
