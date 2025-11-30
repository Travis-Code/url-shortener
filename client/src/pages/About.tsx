import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About URL Shortener</h1>
          <p className="text-xl text-gray-600">
            A modern, full-stack URL shortening service with enterprise-level analytics
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">
            {/* What is it */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is URL Shortener?</h2>
              <p className="text-gray-700 leading-relaxed">
                URL Shortener transforms long URLs into short, shareable links while tracking engagement and providing 
                insights into how your links are performing. Create memorable short links and see where your traffic 
                is coming from with detailed analytics.
              </p>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">🔗 URL Management</h3>
                  <p className="text-gray-600 text-sm">
                    Create short, memorable links with optional titles, descriptions, and expiration dates
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">📊 Advanced Analytics</h3>
                  <p className="text-gray-600 text-sm">
                    Track clicks with geographic location, browser, OS, device type, and referrer data
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">🔒 Secure Access</h3>
                  <p className="text-gray-600 text-sm">
                    Password-protected accounts keep your links private and secure
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">⚡ Fast & Reliable</h3>
                  <p className="text-gray-600 text-sm">
                    Quick redirects and real-time tracking ensure optimal performance
                  </p>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use Cases</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span><strong>Marketing Campaigns:</strong> Track which channels drive the most traffic to your content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span><strong>Social Media:</strong> Share clean, professional links instead of long, unwieldy URLs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span><strong>Email Newsletters:</strong> Monitor engagement and click-through rates with detailed analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span><strong>QR Codes:</strong> Generate short links perfect for QR code campaigns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span><strong>Portfolio Projects:</strong> Organize and track your shared content and projects</span>
                </li>
              </ul>
            </section>

            {/* Analytics Dashboard */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
              <p className="text-gray-700 mb-4">
                Every shortened URL comes with a powerful analytics dashboard that tracks:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌍</span>
                  <span className="text-gray-700">Geographic location (country and city) of each visitor</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💻</span>
                  <span className="text-gray-700">Browser type (Chrome, Safari, Firefox, Edge, etc.)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-gray-700">Device type (Mobile, Desktop, Tablet)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🖥️</span>
                  <span className="text-gray-700">Operating system (Windows, macOS, iOS, Android, Linux)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔗</span>
                  <span className="text-gray-700">Referrer source (where clicks came from)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  <span className="text-gray-700">Timestamp of each click for trend analysis</span>
                </div>
              </div>
            </section>

            {/* Get Started */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-6">
                Create an account and start shortening your URLs today. Track your links, monitor engagement, 
                and gain insights into your audience with our comprehensive analytics platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up Free
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
