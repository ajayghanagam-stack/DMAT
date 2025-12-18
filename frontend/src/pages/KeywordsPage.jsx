import { useState, useEffect } from 'react';
import {
  getKeywords,
  getTopKeywords,
  getDecliningKeywords,
  getSearchConsoleSites,
  syncKeywords,
  exportKeywords,
} from '../services/api';
import './KeywordsPage.css';

function KeywordsPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [decliningKeywords, setDecliningKeywords] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('clicks');
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load sites
      const sitesResponse = await getSearchConsoleSites();
      setSites(sitesResponse.data.sites || []);

      // Load keywords data
      const [keywordsRes, topRes, decliningRes] = await Promise.all([
        getKeywords({ limit: 100 }),
        getTopKeywords({ limit: 10, sortBy, days }),
        getDecliningKeywords({ limit: 10, days }),
      ]);

      setKeywords(keywordsRes.data.keywords || []);
      setTopKeywords(topRes.data.keywords || []);
      setDecliningKeywords(decliningRes.data.keywords || []);
    } catch (err) {
      console.error('Failed to load keywords data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedSite) {
      setError('Please select a site from the dropdown');
      return;
    }

    try {
      setSyncing(true);
      setError(null);

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await syncKeywords({
        siteUrl: selectedSite,
        startDate,
        endDate,
      });

      if (response.data.success) {
        alert(`Successfully synced ${response.data.rowsStored} keyword records`);
        await loadData();
      }
    } catch (err) {
      console.error('Failed to sync keywords:', err);
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    console.log('Export button clicked');

    if (keywords.length === 0) {
      setError('No keywords available to export. Please sync keyword data first.');
      return;
    }

    try {
      setExporting(true);
      setError(null);

      console.log('Calling exportKeywords API with params:', { keyword: searchTerm });
      const blob = await exportKeywords({ keyword: searchTerm });

      console.log('Received blob:', blob);

      if (!blob || blob.size === 0) {
        throw new Error('Export returned empty data');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keywords-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('Export completed successfully');
    } catch (err) {
      console.error('Failed to export keywords:', err);
      setError(`Export failed: ${err.message}`);
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const filteredKeywords = keywords.filter(k =>
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="keywords-page">
        <div className="loading">Loading keywords data...</div>
      </div>
    );
  }

  return (
    <div className="keywords-page">
      <div className="page-header">
        <h1>Keyword Performance</h1>
        <p className="page-description">
          Track keyword rankings, impressions, clicks, and CTR from Google Search Console
        </p>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Sync Section */}
      <div className="sync-section">
        <div className="sync-controls">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="site-select"
          >
            <option value="">Select Website...</option>
            {sites.map((site) => (
              <option key={site.siteUrl} value={site.siteUrl}>
                {site.siteUrl}
              </option>
            ))}
          </select>

          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="days-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button
            onClick={handleSync}
            disabled={syncing || !selectedSite}
            className="btn btn-primary"
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-value">{keywords.length}</div>
            <div className="card-label">Total Keywords</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-value">{topKeywords.length}</div>
            <div className="card-label">Top Performers</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <div className="card-value">{decliningKeywords.length}</div>
            <div className="card-label">Declining</div>
          </div>
        </div>
      </div>

      {/* Top & Declining Keywords */}
      <div className="keywords-grid">
        <div className="keywords-card">
          <h2>Top Performing Keywords</h2>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="clicks">Clicks</option>
              <option value="impressions">Impressions</option>
              <option value="ctr">CTR</option>
            </select>
          </div>
          <div className="keywords-list">
            {topKeywords.length === 0 ? (
              <p className="no-data">No data available. Sync keywords to see results.</p>
            ) : (
              topKeywords.map((kw, index) => (
                <div key={index} className="keyword-item">
                  <div className="keyword-rank">#{index + 1}</div>
                  <div className="keyword-details">
                    <div className="keyword-text">{kw.keyword}</div>
                    <div className="keyword-stats">
                      <span>Clicks: {kw.total_clicks}</span>
                      <span>Impressions: {kw.total_impressions}</span>
                      <span>CTR: {parseFloat(kw.avg_ctr).toFixed(2)}%</span>
                      <span>Pos: {parseFloat(kw.avg_position).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="keywords-card">
          <h2>Declining Keywords</h2>
          <p className="card-subtitle">Keywords losing ranking position</p>
          <div className="keywords-list">
            {decliningKeywords.length === 0 ? (
              <p className="no-data">No declining keywords found.</p>
            ) : (
              decliningKeywords.map((kw, index) => (
                <div key={index} className="keyword-item declining">
                  <div className="keyword-rank">📉</div>
                  <div className="keyword-details">
                    <div className="keyword-text">{kw.keyword}</div>
                    <div className="keyword-stats">
                      <span>Position change: +{parseFloat(kw.position_change).toFixed(1)}</span>
                      <span>Current: {parseFloat(kw.recent_position).toFixed(1)}</span>
                      <span>Previous: {parseFloat(kw.older_position).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Keywords Table */}
      <div className="keywords-table-section">
        <div className="table-header">
          <h2>All Keywords</h2>
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn btn-secondary"
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div className="table-container">
          {filteredKeywords.length === 0 ? (
            <p className="no-data">No keywords found. Try syncing data or adjusting your search.</p>
          ) : (
            <table className="keywords-table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>URL</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Avg Position</th>
                  <th>Data Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((kw, index) => (
                  <tr key={index}>
                    <td className="keyword-col">{kw.keyword}</td>
                    <td className="url-col">{kw.url || 'N/A'}</td>
                    <td>{kw.total_impressions}</td>
                    <td>{kw.total_clicks}</td>
                    <td>{parseFloat(kw.avg_ctr).toFixed(2)}%</td>
                    <td>{parseFloat(kw.avg_position).toFixed(1)}</td>
                    <td>{kw.data_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeywordsPage;
