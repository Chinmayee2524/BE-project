
import React from "react";

export default function About() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">About Us</h1>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Our Mission</h2>
        <p className="text-lg text-gray-700">
          We are dedicated to promoting sustainable living through our AI-powered eco-friendly product finder. Our platform helps connect environmentally conscious consumers with sustainable alternatives to everyday products, making it easier for everyone to make eco-friendly choices that benefit our planet.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">For Sellers</h2>
        <p className="text-lg text-gray-700">
          Join our growing marketplace of eco-friendly products and reach environmentally conscious consumers. Our platform provides you with a dedicated space to showcase your sustainable products, complete with AI-powered scoring that helps validate your eco-friendly credentials. Benefit from increased visibility and connect with customers who value sustainability.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">For Customers</h2>
        <p className="text-lg text-gray-700">
          Make informed decisions about your purchases with our AI-powered eco-scoring system. Find sustainable alternatives to your everyday products, compare options easily, and contribute to environmental conservation through your shopping choices. Our platform ensures you have access to genuine eco-friendly products, making sustainable living more accessible than ever.
        </p>
      </section>
    </div>
  );
}
