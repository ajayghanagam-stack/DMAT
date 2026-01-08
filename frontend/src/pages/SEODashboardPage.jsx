import { useState, useEffect } from 'react';
import { getSeoDashboard } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './SEODashboardPage.css';

function SEODashboardPage() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [days]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSeoDashboard(days);
      setDashboard(response.data);
    } catch (err) {
      console.error('Failed to load SEO dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return 'N/A';
    return numValue.toLocaleString();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading && !dashboard) {
    return (
      <div className="seo-dashboard-page">
        <div className="page-header">
          <h1>SEO Insights Dashboard</h1>
        </div>
        <div className="loading-message">Loading SEO insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seo-dashboard-page">
        <div className="page-header">
          <h1>SEO Insights Dashboard</h1>
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadDashboard} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="seo-dashboard-page">
        <div className="page-header">
          <h1>SEO Insights Dashboard</h1>
        </div>
        <div className="info-message">
          <p>No SEO data available yet.</p>
          <p>
            Sync your Search Console and GA4 data to see insights here.
          </p>
        </div>
      </div>
    );
  }

  const { quickStats, trafficTrends, trafficSources, topKeywords, topPages, leadMetrics, keywordTrends } = dashboard;

  return (
    <div className="seo-dashboard-page">
      <div className="page-header">
        <h1>SEO Insights Dashboard</h1>
        <div className="header-actions">
          <div className="date-selector">
            <label>Time Range:</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <button onClick={loadDashboard} className="btn-primary" disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Keywords</div>
          <div className="stat-value">{formatNumber(quickStats.totalKeywords)}</div>
          <div className="stat-sublabel">Tracked in Search Console</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg Position</div>
          <div className="stat-value">{quickStats.avgPosition}</div>
          <div className="stat-sublabel">Average ranking position</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Impressions</div>
          <div className="stat-value">{formatNumber(quickStats.totalImpressions)}</div>
          <div className="stat-sublabel">{quickStats.avgCTR}% CTR</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Clicks</div>
          <div className="stat-value">{formatNumber(quickStats.totalClicks)}</div>
          <div className="stat-sublabel">From search results</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Page Views</div>
          <div className="stat-value">{formatNumber(quickStats.totalPageViews)}</div>
          <div className="stat-sublabel">{formatNumber(quickStats.totalSessions)} sessions</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-label">Leads Generated</div>
          <div className="stat-value">{formatNumber(quickStats.totalLeads)}</div>
          <div className="stat-sublabel">{quickStats.conversionRate}% conversion rate</div>
        </div>
      </div>

      {/* Charts Row 1: Traffic Trends */}
      <div className="chart-section">
        <h2>Traffic Trends ({days} days)</h2>
        <div className="chart-container">
          {trafficTrends && trafficTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageViews" stroke="#0088FE" name="Page Views" />
                <Line type="monotone" dataKey="uniqueViews" stroke="#00C49F" name="Unique Views" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">No traffic data available</div>
          )}
        </div>
      </div>

      {/* Charts Row 2: Keyword Rankings & Traffic Sources */}
      <div className="charts-row">
        <div className="chart-section half">
          <h2>Keyword Ranking Trends (Top 5)</h2>
          <div className="chart-container">
            {keywordTrends && keywordTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={keywordTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis reversed domain={[1, 100]} />
                  <Tooltip />
                  <Legend />
                  {Object.keys(keywordTrends[0])
                    .filter((key) => key !== 'date')
                    .map((keyword, index) => (
                      <Line
                        key={keyword}
                        type="monotone"
                        dataKey={keyword}
                        stroke={COLORS[index % COLORS.length]}
                        name={keyword}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">No keyword ranking data available</div>
            )}
          </div>
        </div>

        <div className="chart-section half">
          <h2>Traffic Sources</h2>
          <div className="chart-container">
            {trafficSources && trafficSources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    dataKey="sessions"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">No traffic source data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Metrics Section */}
      <div className="chart-section">
        <h2>Lead Funnel</h2>
        <div className="lead-funnel">
          <div className="funnel-stage">
            <div className="funnel-label">New</div>
            <div className="funnel-value">{formatNumber(leadMetrics.newLeads)}</div>
          </div>
          <div className="funnel-arrow">→</div>
          <div className="funnel-stage">
            <div className="funnel-label">Contacted</div>
            <div className="funnel-value">{formatNumber(leadMetrics.contactedLeads)}</div>
          </div>
          <div className="funnel-arrow">→</div>
          <div className="funnel-stage">
            <div className="funnel-label">Qualified</div>
            <div className="funnel-value">{formatNumber(leadMetrics.qualifiedLeads)}</div>
          </div>
          <div className="funnel-arrow">→</div>
          <div className="funnel-stage">
            <div className="funnel-label">Converted</div>
            <div className="funnel-value">{formatNumber(leadMetrics.convertedLeads)}</div>
          </div>
        </div>
      </div>

      {/* Tables Row: Top Keywords & Top Pages */}
      <div className="tables-row">
        <div className="table-section half">
          <h2>Top Performing Keywords</h2>
          {topKeywords && topKeywords.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Clicks</th>
                    <th>Impressions</th>
                    <th>CTR</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map((keyword, index) => (
                    <tr key={index}>
                      <td className="keyword-cell">{keyword.keyword}</td>
                      <td>{formatNumber(keyword.clicks)}</td>
                      <td>{formatNumber(keyword.impressions)}</td>
                      <td>{keyword.ctr}%</td>
                      <td>{keyword.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No keyword data available</div>
          )}
        </div>

        <div className="table-section half">
          <h2>Top Performing Pages</h2>
          {topPages && topPages.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Unique</th>
                    <th>Avg Time</th>
                    <th>Exit Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, index) => (
                    <tr key={index}>
                      <td className="page-cell" title={page.pagePath}>
                        {page.pageTitle}
                      </td>
                      <td>{formatNumber(page.views)}</td>
                      <td>{formatNumber(page.uniqueViews)}</td>
                      <td>{page.avgTime}s</td>
                      <td>{page.exitRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No page data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SEODashboardPage;
