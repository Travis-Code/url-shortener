import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/authContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
            <div className="space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 font-medium hover:text-blue-900"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">Shorten Your URLs</h2>
          <p className="text-xl text-gray-600 mb-8">
            Create short, shareable links and track their performance with real-time analytics
          </p>

          <div className="flex gap-4 justify-center mb-12">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-md font-medium hover:bg-blue-50 text-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Paste your long URL and get a short link instantly</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Track Clicks</h3>
              <p className="text-gray-600">Monitor your links with real-time click analytics</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your links are safe, secure, and always available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
