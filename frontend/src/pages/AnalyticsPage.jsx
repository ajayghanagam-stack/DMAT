import { useState, useEffect } from 'react';
import {
  getGA4Properties,
  addGA4Property,
  syncGA4Analytics,
  getGA4Dashboard,
} from '../services/api';
import './AnalyticsPage.css';

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [days, setDays] = useState(30);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    propertyId: '',
    propertyName: '',
    websiteUrl: '',
    timezone: '',
    currencyCode: 'USD',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadDashboard();
    }
  }, [selectedProperty, days]);

  const loadData = async () => {
    try {
      console.log('[AnalyticsPage] Loading data...');
      setLoading(true);
      setError(null);

      const propertiesResponse = await getGA4Properties();
      console.log('[AnalyticsPage] Properties response:', propertiesResponse);
      setProperties(propertiesResponse.data?.properties || []);

      // Auto-select first property if available
      if (propertiesResponse.data?.properties?.length > 0) {
        console.log('[AnalyticsPage] Auto-selecting property:', propertiesResponse.data.properties[0].property_id);
        setSelectedProperty(propertiesResponse.data.properties[0].property_id);
      }
    } catch (err) {
      console.error('Failed to load GA4 properties:', err);
      setError(err.message);
    } finally {
      console.log('[AnalyticsPage] Loading complete');
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!selectedProperty) return;

    try {
      console.log('[AnalyticsPage] Loading dashboard for property:', selectedProperty, 'days:', days);
      setLoading(true);
      setError(null);

      const response = await getGA4Dashboard({ propertyId: selectedProperty, days });
      console.log('[AnalyticsPage] Dashboard response:', response);
      setDashboard(response.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message);
    } finally {
      console.log('[AnalyticsPage] Dashboard loading complete');
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedProperty) {
      setError('Please select a property');
      return;
    }

    // Check if this is the sample property
    if (selectedProperty === 'properties/456789012') {
      alert('Cannot sync sample data property.\n\nThis is test data already loaded in the database.\n\nTo sync real data, add your actual GA4 property using the "+ Add Property" button.');
      return;
    }

    try {
      setSyncing(true);
      setError(null);

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const response = await syncGA4Analytics({
        propertyId: selectedProperty,
        startDate,
        endDate,
        dataTypes: ['metrics', 'pageViews', 'events'],
      });

      if (response.success) {
        alert(`Successfully synced ${response.data.totalRowsStored} records`);
        await loadDashboard();
      }
    } catch (err) {
      console.error('Failed to sync analytics:', err);
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const response = await addGA4Property(newProperty);

      if (response.success) {
        alert('Property added successfully');
        setShowAddProperty(false);
        setNewProperty({
          propertyId: '',
          propertyName: '',
          websiteUrl: '',
          timezone: '',
          currencyCode: 'USD',
        });
        await loadData();
      }
    } catch (err) {
      console.error('Failed to add property:', err);
      setError(err.message);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return 'N/A';
    return new Intl.NumberFormat().format(Math.round(numValue));
  };

  const formatPercent = (num) => {
    if (!num && num !== 0) return 'N/A';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(2)}%`;
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const numValue = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    if (isNaN(numValue)) return 'N/A';
    const mins = Math.floor(numValue / 60);
    const secs = Math.floor(numValue % 60);
    return `${mins}m ${secs}s`;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numValue)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue);
  };

  console.log('[AnalyticsPage] Render - loading:', loading, 'dashboard:', !!dashboard, 'error:', error, 'properties:', properties.length);

  if (loading && !dashboard) {
    console.log('[AnalyticsPage] Showing loading state');
    return <div className="analytics-page"><div className="loading">Loading analytics data...</div></div>;
  }

  console.log('[AnalyticsPage] Rendering main content');
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Google Analytics</h1>
          <p>View and analyze your website analytics data from GA4</p>
        </div>
        <button
          className="btn-add-property"
          onClick={() => setShowAddProperty(!showAddProperty)}
        >
          {showAddProperty ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showAddProperty && (
        <div className="add-property-form">
          <h3>Add GA4 Property</h3>
          <form onSubmit={handleAddProperty}>
            <div className="form-row">
              <div className="form-group">
                <label>Property ID *</label>
                <input
                  type="text"
                  placeholder="properties/123456789"
                  value={newProperty.propertyId}
                  onChange={(e) => setNewProperty({ ...newProperty, propertyId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Property Name</label>
                <input
                  type="text"
                  placeholder="My Website"
                  value={newProperty.propertyName}
                  onChange={(e) => setNewProperty({ ...newProperty, propertyName: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newProperty.websiteUrl}
                  onChange={(e) => setNewProperty({ ...newProperty, websiteUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <input
                  type="text"
                  placeholder="America/New_York"
                  value={newProperty.timezone}
                  onChange={(e) => setNewProperty({ ...newProperty, timezone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <input
                  type="text"
                  placeholder="USD"
                  value={newProperty.currencyCode}
                  onChange={(e) => setNewProperty({ ...newProperty, currencyCode: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">Add Property</button>
          </form>
        </div>
      )}

      <div className="sync-controls">
        <div className="control-group">
          <label htmlFor="property-select">Select Property:</label>
          <select
            id="property-select"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option value="">-- Select a GA4 Property --</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.property_id}>
                {prop.property_name || prop.property_id} ({prop.website_url})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="days-select">Time Period:</label>
          <select
            id="days-select"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <button
          className="btn-sync"
          onClick={handleSync}
          disabled={syncing || !selectedProperty}
        >
          {syncing ? 'Syncing...' : 'Sync Analytics Data'}
        </button>
      </div>

      {dashboard && dashboard.summary && (
        <>
          <div className="summary-section">
            <h2>Overview - Last {days} Days</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <div className="card-label">Total Users</div>
                  <div className="card-value">{formatNumber(dashboard.summary.total_users)}</div>
                  <div className="card-sub">New: {formatNumber(dashboard.summary.total_new_users)}</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-label">Sessions</div>
                  <div className="card-value">{formatNumber(dashboard.summary.total_sessions)}</div>
                  <div className="card-sub">Engagement: {formatPercent(dashboard.summary.avg_engagement_rate)}</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon">⏱️</div>
                <div className="card-content">
                  <div className="card-label">Avg. Session Duration</div>
                  <div className="card-value">{formatDuration(dashboard.summary.avg_session_duration)}</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <div className="card-label">Conversions</div>
                  <div className="card-value">{formatNumber(dashboard.summary.total_conversions)}</div>
                  <div className="card-sub">Revenue: {formatCurrency(dashboard.summary.total_revenue)}</div>
                </div>
              </div>
            </div>

            <div className="device-breakdown">
              <h3>Device Breakdown</h3>
              <div className="device-stats">
                <div className="device-stat">
                  <span className="device-icon">🖥️</span>
                  <span className="device-label">Desktop:</span>
                  <span className="device-value">{formatNumber(dashboard.summary.desktop_users)}</span>
                </div>
                <div className="device-stat">
                  <span className="device-icon">📱</span>
                  <span className="device-label">Mobile:</span>
                  <span className="device-value">{formatNumber(dashboard.summary.mobile_users)}</span>
                </div>
                <div className="device-stat">
                  <span className="device-icon">📲</span>
                  <span className="device-label">Tablet:</span>
                  <span className="device-value">{formatNumber(dashboard.summary.tablet_users)}</span>
                </div>
              </div>
            </div>
          </div>

          {dashboard.topPages && dashboard.topPages.length > 0 && (
            <div className="data-section">
              <h2>Top Pages</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Page Title</th>
                      <th>Page Path</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.topPages.map((page, index) => (
                      <tr key={index}>
                        <td>{page.page_title || 'N/A'}</td>
                        <td className="path">{page.page_path}</td>
                        <td>{formatNumber(page.total_views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {dashboard.topEvents && dashboard.topEvents.length > 0 && (
            <div className="data-section">
              <h2>Top Events</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Total Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.topEvents.map((event, index) => (
                      <tr key={index}>
                        <td>{event.event_name}</td>
                        <td>{formatNumber(event.total_count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!dashboard && selectedProperty && !loading && (
        <div className="empty-state">
          <p>No analytics data available. Click "Sync Analytics Data" to fetch data from Google Analytics.</p>
        </div>
      )}

      {!selectedProperty && !loading && (
        <div className="empty-state">
          <p>Please select a GA4 property or add a new one to get started.</p>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
