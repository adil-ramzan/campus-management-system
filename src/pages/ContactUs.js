import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-blue-600 text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-200 mb-6">
            Have questions? Feel free to reach out to us anytime!
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-xl" />
              <p>Gomal University, KPK, Pakistan</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-xl" />
              <p>+92 (966) 750-424-29</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-xl" />
              <p>info@gu.edu.pk</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
