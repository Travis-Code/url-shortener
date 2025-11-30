import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlApi } from '../api/client';

interface Click {
  clicked_at: string;
  user_agent: string;
  ip_address: string;
  referer: string;
  country: string | null;
  city: string | null;
  browser?: string | null;
  os?: string | null;
  device_type?: string | null;
}

interface Location {
  country: string;
  city: string;
  count: number;
}

const Analytics: React.FC = () => {
  const { id } = useParams();
  const [shortCode, setShortCode] = useState('');
  const [totalClicks, setTotalClicks] = useState(0);
  const [recentClicks, setRecentClicks] = useState<Click[]>([]);
  const [topLocations, setTopLocations] = useState<Location[]>([]);
  const [topBrowsers, setTopBrowsers] = useState<{ browser: string; count: number }[]>([]);
  const [topOS, setTopOS] = useState<{ os: string; count: number }[]>([]);
  const [topDevices, setTopDevices] = useState<{ device_type: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      if (!id) return;
      const response = await urlApi.getAnalytics(parseInt(id));
      setShortCode(response.data.shortCode);
      setTotalClicks(response.data.totalClicks);
      setRecentClicks(response.data.recentClicks);
      setTopLocations(response.data.topLocations || []);
      setTopBrowsers(response.data.topBrowsers || []);
      setTopOS(response.data.topOS || []);
      setTopDevices(response.data.topDevices || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Analytics for {shortCode}</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-2xl font-bold text-blue-600">{totalClicks}</div>
        <div className="text-gray-600">Total Clicks</div>
      </div>

      {topLocations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🌍 Top Locations</h2>
          <div className="space-y-3">
            {topLocations.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {location.city ? `${location.city}, ` : ''}{location.country}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(location.count / topLocations[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                    {location.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(topBrowsers.length > 0 || topOS.length > 0 || topDevices.length > 0) && (
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {topBrowsers.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">🧭 Top Browsers</h2>
              <div className="space-y-3">
                {topBrowsers.map((b, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{b.browser || 'Unknown'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(b.count / topBrowsers[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{b.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topOS.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">💻 Top Operating Systems</h2>
              <div className="space-y-3">
                {topOS.map((o, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{o.os || 'Unknown'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(o.count / topOS[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{o.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topDevices.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">📱 Top Device Types</h2>
              <div className="space-y-3">
                {topDevices.map((d, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{d.device_type || 'Desktop'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-600 h-2 rounded-full"
                          style={{ width: `${(d.count / topDevices[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{d.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Clicks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">IP Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {recentClicks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No clicks yet
                  </td>
                </tr>
              ) : (
                recentClicks.map((click, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(click.clicked_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {click.city && click.country ? (
                        <span className="flex items-center">
                          🌍 {click.city}, {click.country}
                        </span>
                      ) : click.country ? (
                        <span className="flex items-center">🌍 {click.country}</span>
                      ) : (
                        <span className="text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{click.ip_address || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{click.referer || 'Direct'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
