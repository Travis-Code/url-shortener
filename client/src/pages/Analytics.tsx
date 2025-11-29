import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlApi } from '../api/client';
import { useAuth } from '../utils/authContext';

interface Click {
  clicked_at: string;
  user_agent: string;
  ip_address: string;
  referer: string;
}

const Analytics: React.FC = () => {
  const { id } = useParams();
  const [shortCode, setShortCode] = useState('');
  const [totalClicks, setTotalClicks] = useState(0);
  const [recentClicks, setRecentClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

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

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Clicks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
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
