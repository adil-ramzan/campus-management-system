import React from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

        <div className="bg-blue-600 text-white py-8 px-6 text-center">
          <h1 className="text-4xl font-bold">About Gomal University</h1>
          <p className="mt-2 text-lg text-gray-200">Empowering Education, Research, and Innovation</p>
        </div>

        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            Established in 1974, Gomal University is one of the oldest and most prestigious institutions
            of higher education in Pakistan. Located in the Khyber Pakhtunkhwa province, the university
            offers a diverse range of academic programs and is known for its commitment to excellence
            in education and research.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Gomal University strives to foster an environment of academic excellence and research
            innovation, aiming to produce highly skilled professionals equipped with ethical values
            and leadership qualities.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be a center of excellence in higher education, driving societal development
            through knowledge, innovation, and leadership.
          </p>

          <div className="bg-gray-200 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Facts</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Founded: 1974</li>
              <li>Location: Dera Ismail Khan, Khyber Pakhtunkhwa</li>
              <li>3 Campuses & 7 Faculties</li>
              <li>50+ Affiliated Colleges</li>
              <li>20+ Research Centers & Institutes</li>
              <li>Over 25,000 Students Enrolled</li>
            </ul>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Join Gomal University</h3>
            <p className="text-gray-600">Be part of a thriving academic community and shape your future.</p>
            <Link to="/contact" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
