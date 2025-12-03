import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlApi } from '../api/client';
import { useAuth } from '../utils/authContext';

// Get the base URL for shortened links from environment or use production Railway URL
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://url-shortener-production-c83f.up.railway.app';

interface URL {
  id: number;
  short_code: string;
  original_url: string;
  title: string;
  description: string;
  clicks: number;
  created_at: string;
  expires_at: string | null;
}

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlApi.getUrls();
      setUrls(response.data);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    }
  };

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await urlApi.createUrl(originalUrl, customShortCode || undefined, title, description, expiresAt || undefined);
      setSuccess('Short URL created successfully!');
      setOriginalUrl('');
      setCustomShortCode('');
      setTitle('');
      setDescription('');
      setExpiresAt('');
      fetchUrls();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUrl = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await urlApi.deleteUrl(id);
        setUrls(urls.filter((u) => u.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete URL');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.username}</span>
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 mr-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Admin Panel
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Create URL Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create a Short URL</h2>
          <form onSubmit={handleCreateUrl} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{success}</div>}

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Original URL *
              </label>
              <input
                type="url"
                id="url"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
                Custom Short Code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="my-custom-link"
                value={customShortCode}
                onChange={(e) => setCustomShortCode(e.target.value)}
                pattern="[a-zA-Z0-9-_]+"
                title="Only letters, numbers, hyphens, and underscores allowed"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty to generate a random code</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title (optional)
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="My awesome link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                Expiration Date (optional)
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              />
              <p className="mt-1 text-sm text-gray-500">Link will become inaccessible after this date</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Short URL'}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Your Short URLs</h2>
          </div>
          {urls.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No short URLs created yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Short Code</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Original URL</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Clicks</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => {
                    const isExpired = url.expires_at && new Date(url.expires_at) < new Date();
                    return (
                    <tr key={url.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        <button
                          onClick={() => copyToClipboard(`${BASE_URL}/${url.short_code}`)}
                          className="hover:underline"
                        >
                          {url.short_code}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{url.original_url}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{url.clicks}</td>
                      <td className="px-6 py-4 text-sm">
                        {isExpired ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Expired
                          </span>
                        ) : url.expires_at ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Expires {new Date(url.expires_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(url.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/analytics/${url.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Analytics
                        </button>
                        <button
                          onClick={() => handleDeleteUrl(url.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
