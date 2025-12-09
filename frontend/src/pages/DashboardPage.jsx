import { useState, useEffect } from 'react';
import { getDashboardAnalytics } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6',
      contacted: '#8b5cf6',
      qualified: '#06b6d4',
      in_progress: '#f59e0b',
      converted: '#10b981',
      closed_won: '#059669',
      closed_lost: '#ef4444',
      unqualified: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const formatStatus = (status) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={loadAnalytics} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { totals, statusBreakdown, leadsOverTime, topLandingPages } = analytics;

  // Calculate total leads from status breakdown for chart percentages
  const totalLeadsForChart = statusBreakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <button onClick={loadAnalytics} className="refresh-button">
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Leads</h3>
            <p className="stat-value">{totals.totalLeads.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <h3>New Leads (7 days)</h3>
            <p className="stat-value">{totals.newLeads.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Converted Leads</h3>
            <p className="stat-value">{totals.convertedLeads.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Conversion Rate</h3>
            <p className="stat-value">{totals.conversionRate}%</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>Assigned Leads</h3>
            <p className="stat-value">{totals.assignedLeads.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Unassigned Leads</h3>
            <p className="stat-value">{totals.unassignedLeads.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Status Breakdown */}
        <div className="chart-card">
          <h2>Leads by Status</h2>
          <div className="status-breakdown">
            {statusBreakdown.map((item) => {
              const percentage = totalLeadsForChart > 0
                ? ((item.count / totalLeadsForChart) * 100).toFixed(1)
                : 0;

              return (
                <div key={item.status} className="status-item">
                  <div className="status-header">
                    <span className="status-label">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      ></span>
                      {formatStatus(item.status)}
                    </span>
                    <span className="status-count">{item.count}</span>
                  </div>
                  <div className="status-bar-container">
                    <div
                      className="status-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(item.status)
                      }}
                    ></div>
                  </div>
                  <span className="status-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads Over Time */}
        <div className="chart-card">
          <h2>Leads Over Time (30 Days)</h2>
          <div className="timeline-chart">
            {leadsOverTime.length > 0 ? (
              <>
                <div className="timeline-bars">
                  {leadsOverTime.map((item, index) => {
                    const maxCount = Math.max(...leadsOverTime.map(d => d.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                    return (
                      <div key={index} className="timeline-bar-container">
                        <div className="timeline-bar-wrapper">
                          <div
                            className="timeline-bar"
                            style={{ height: `${height}%` }}
                            title={`${formatDate(item.date)}: ${item.count} leads`}
                          >
                            <span className="bar-value">{item.count}</span>
                          </div>
                        </div>
                        <span className="timeline-label">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="no-data">No lead data available for the last 30 days</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Landing Pages */}
      <div className="chart-card top-pages-card">
        <h2>Top Landing Pages by Lead Count</h2>
        {topLandingPages.length > 0 ? (
          <div className="top-pages-list">
            {topLandingPages.map((page, index) => (
              <div key={page.id} className="top-page-item">
                <div className="page-rank">{index + 1}</div>
                <div className="page-info">
                  <h3>{page.title}</h3>
                  <span className="page-slug">/{page.slug}</span>
                </div>
                <div className="page-leads">
                  <span className="lead-count">{page.leadCount}</span>
                  <span className="lead-label">leads</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No landing pages with leads yet</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
