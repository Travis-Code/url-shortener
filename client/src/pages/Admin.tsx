import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/client';

interface Stats {
  totalUsers: number;
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
  topUsers: Array<{ id: number; username: string; email: string; url_count: string }>;
  recentUsers: Array<{ id: number; username: string; email: string; created_at: string }>;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  url_count: string;
  total_clicks: string;
}

interface Url {
  id: number;
  short_code: string;
  original_url: string;
  title: string;
  clicks: number;
  created_at: string;
  expires_at: string | null;
  username: string;
  email: string;
}

interface Click {
  id: number;
  clicked_at: string;
  ip_address: string;
  country: string | null;
  city: string | null;
  browser: string;
  os: string;
  device_type: string;
  user_agent: string;
  referer: string | null;
  short_code: string;
  original_url: string;
  username: string;
  email: string;
  user_id: number;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'urls' | 'analytics'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [urls, setUrls] = useState<Url[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'all' | '7' | '30' | '90'>('all');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'urls') {
      fetchUrls();
    } else if (activeTab === 'analytics') {
      fetchClicks();
      if (users.length === 0) {
        fetchUsers();
      }
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStats();
      setStats(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      setUsers(response.data.users);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUrls();
      setUrls(response.data.urls);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const fetchClicks = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getClicks();
      setClicks(response.data.clicks);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load clicks');
    } finally {
      setLoading(false);
    }
  };

  // Filter clicks based on user and time range
  const filteredClicks = clicks.filter(click => {
    // User filter
    if (selectedUserId !== 'all' && click.user_id !== selectedUserId) {
      return false;
    }

    // Time range filter
    if (timeRange !== 'all') {
      const clickDate = new Date(click.clicked_at);
      const daysAgo = parseInt(timeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      if (clickDate < cutoffDate) {
        return false;
      }
    }

    return true;
  });

  const handleDeleteUrl = async (id: number) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await adminApi.deleteUrl(id);
      fetchUrls();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete URL');
    }
  };

  const handleBanUser = async (id: number) => {
    if (!confirm('Are you sure you want to ban this user? This will delete all their URLs.')) return;

    try {
      await adminApi.banUser(id, true);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to ban user');
    }
  };

  if (loading && !stats) {
    return <div className="max-w-7xl mx-auto py-8 px-4 text-center">Loading...</div>;
  }

  if (error && !stats) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'urls'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total URLs</div>
              <div className="text-3xl font-bold text-green-600">{stats.totalUrls}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
              <div className="text-3xl font-bold text-purple-600">{stats.totalClicks}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Active URLs</div>
              <div className="text-3xl font-bold text-emerald-600">{stats.activeUrls}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Expired URLs</div>
              <div className="text-3xl font-bold text-red-600">{stats.expiredUrls}</div>
            </div>
          </div>

          {/* Top Users */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Top Users by URLs</h2>
              </div>
              <div className="p-6">
                {stats.topUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">{user.url_count} URLs</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Signups</h2>
              </div>
              <div className="p-6">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URLs</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Clicks</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.is_admin ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.url_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.total_clicks}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {!user.is_admin && (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      )}

      {/* URLs Tab */}
      {activeTab === 'urls' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Short Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Original URL</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Owner</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Clicks</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Expires</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">
                    <a 
                      href={`http://localhost:5001/${url.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      title="Click to test shortened URL"
                    >
                      {url.short_code}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">
                    <a 
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      title={url.original_url}
                    >
                      {url.original_url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{url.username}</div>
                    <div className="text-xs text-gray-500">{url.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{url.clicks}</td>
                  <td className="px-6 py-4 text-sm">
                    {!url.expires_at || new Date(url.expires_at) > new Date() ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {url.expires_at ? (
                      <div>
                        <div>{new Date(url.expires_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(url.expires_at).toLocaleTimeString()}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(url.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteUrl(url.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Filters Row */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by User
                </label>
                <select
                  id="user-filter"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <select
                  id="time-range"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analytics Summary Stats */}
          {filteredClicks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Clicks</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">{filteredClicks.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Unique URLs</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {new Set(filteredClicks.map(c => c.short_code)).size}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Mobile Traffic</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {Math.round((filteredClicks.filter(c => c.device_type === 'mobile').length / filteredClicks.length) * 100)}%
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Unique Visitors</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {new Set(filteredClicks.map(c => c.ip_address)).size}
                </div>
              </div>
            </div>
          )}

          {/* Geographic & Device Breakdown */}
          {filteredClicks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Countries */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
                </div>
                <div className="p-6">
                  {Object.entries(
                    filteredClicks.reduce((acc, click) => {
                      const country = click.country || 'Unknown';
                      acc[country] = (acc[country] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">{country}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(count / filteredClicks.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Browser Distribution */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Browser Split</h3>
                </div>
                <div className="p-6">
                  {Object.entries(
                    filteredClicks.reduce((acc, click) => {
                      const browser = click.browser || 'Unknown';
                      acc[browser] = (acc[browser] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">{browser}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(count / filteredClicks.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
                </div>
                <div className="p-6">
                  {Object.entries(
                    filteredClicks.reduce((acc, click) => {
                      const device = click.device_type || 'desktop';
                      acc[device] = (acc[device] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700 capitalize">{device}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(count / filteredClicks.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Top URLs */}
          {filteredClicks.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing URLs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(
                      filteredClicks.reduce((acc, click) => {
                        if (!acc[click.short_code]) {
                          acc[click.short_code] = { count: 0, url: click.original_url };
                        }
                        acc[click.short_code].count++;
                        return acc;
                      }, {} as Record<string, { count: number; url: string }>)
                    )
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 10)
                      .map(([shortCode, data], idx) => (
                        <tr key={shortCode} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`http://localhost:5001/${shortCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {shortCode}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 truncate max-w-md" title={data.url}>
                              {data.url}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-semibold text-gray-900">{data.count}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {Math.round((data.count / filteredClicks.length) * 100)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Clicks Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Clicks</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedUserId === 'all' 
                  ? 'Latest 50 clicks across all URLs' 
                  : `Clicks from ${users.find(u => u.id === selectedUserId)?.username || 'selected user'}`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser/OS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClicks.map((click) => (
                    <tr key={click.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(click.clicked_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(click.clicked_at).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`http://localhost:5001/${click.short_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {click.short_code}
                        </a>
                        <div className="text-xs text-gray-500 truncate max-w-xs mt-1" title={click.original_url}>
                          {click.original_url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{click.username}</div>
                        <div className="text-xs text-gray-500">{click.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm text-gray-900 font-medium">{click.browser || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{click.os || 'Unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          click.device_type === 'mobile' ? 'bg-purple-100 text-purple-800' :
                          click.device_type === 'tablet' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {click.device_type || 'Desktop'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {click.city && click.country ? (
                          <div>
                            <div className="text-sm text-gray-900">📍 {click.city}</div>
                            <div className="text-xs text-gray-500">{click.country}</div>
                          </div>
                        ) : click.country ? (
                          <div className="text-sm text-gray-900">📍 {click.country}</div>
                        ) : (
                          <span className="text-sm text-gray-400">Unknown</span>
                        )}
                        <div className="text-xs text-gray-400 font-mono mt-1">{click.ip_address}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div className="text-center py-8 text-gray-500">Loading clicks...</div>}
              {filteredClicks.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📊</div>
                  <div className="text-gray-500">No clicks recorded yet</div>
                  <div className="text-sm text-gray-400 mt-1">Click data will appear here once users start using shortened URLs</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
