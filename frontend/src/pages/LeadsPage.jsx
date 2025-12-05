import { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, exportLeads as exportLeadsAPI } from '../services/api';
import './LeadsPage.css';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await getLeads(params);
      setLeads(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportLeadsAPI({ status: statusFilter !== 'all' ? statusFilter : undefined });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to export: ${err.message}`);
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.landing_page_title?.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status) => {
    const styles = {
      new: { bg: '#dbeafe', color: '#1e40af', label: 'New' },
      contacted: { bg: '#fef3c7', color: '#92400e', label: 'Contacted' },
      qualified: { bg: '#e0e7ff', color: '#4338ca', label: 'Qualified' },
      converted: { bg: '#d1fae5', color: '#065f46', label: 'Converted' },
    };
    const style = styles[status] || styles.new;
    return (
      <span
        className="status-badge"
        style={{ background: style.bg, color: style.color }}
      >
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="leads-page">
      <div className="leads-main">
        <div className="page-header">
          <div>
            <h1>Leads</h1>
            <p>Manage and track your leads</p>
          </div>
          <button className="export-button" onClick={handleExport}>
            📥 Export CSV
          </button>
        </div>

        <div className="page-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-button ${statusFilter === 'new' ? 'active' : ''}`}
              onClick={() => setStatusFilter('new')}
            >
              New
            </button>
            <button
              className={`filter-button ${statusFilter === 'contacted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('contacted')}
            >
              Contacted
            </button>
            <button
              className={`filter-button ${statusFilter === 'qualified' ? 'active' : ''}`}
              onClick={() => setStatusFilter('qualified')}
            >
              Qualified
            </button>
            <button
              className={`filter-button ${statusFilter === 'converted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('converted')}
            >
              Converted
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">Loading leads...</div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={loadLeads}>Retry</button>
          </div>
        )}

        {!loading && !error && filteredLeads.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No leads found</h3>
            <p>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Leads will appear here when visitors submit your landing page forms'}
            </p>
          </div>
        )}

        {!loading && !error && filteredLeads.length > 0 && (
          <div className="leads-table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={selectedLead?.id === lead.id ? 'selected' : ''}
                  >
                    <td className="lead-name">{lead.name}</td>
                    <td className="lead-email">{lead.email}</td>
                    <td className="lead-phone">{lead.phone || '-'}</td>
                    <td className="lead-source">
                      {lead.landing_page_title || 'Unknown'}
                    </td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td className="lead-date">{formatDate(lead.submitted_at)}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="lead-detail-panel">
          <div className="panel-header">
            <h2>Lead Details</h2>
            <button
              className="close-button"
              onClick={() => setSelectedLead(null)}
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedLead.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">
                  <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
                </span>
              </div>
              {selectedLead.phone && (
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a>
                  </span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>Source</h3>
              <div className="detail-item">
                <span className="detail-label">Landing Page:</span>
                <span className="detail-value">{selectedLead.landing_page_title || 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submitted:</span>
                <span className="detail-value">{formatDate(selectedLead.submitted_at)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Status</h3>
              <div className="detail-item">
                <span className="detail-label">Current Status:</span>
                <span className="detail-value">{getStatusBadge(selectedLead.status)}</span>
              </div>
              <div className="status-actions">
                <button
                  className="status-action-button"
                  onClick={() => handleStatusChange(selectedLead.id, 'new')}
                  disabled={selectedLead.status === 'new'}
                >
                  New
                </button>
                <button
                  className="status-action-button"
                  onClick={() => handleStatusChange(selectedLead.id, 'contacted')}
                  disabled={selectedLead.status === 'contacted'}
                >
                  Contacted
                </button>
                <button
                  className="status-action-button"
                  onClick={() => handleStatusChange(selectedLead.id, 'qualified')}
                  disabled={selectedLead.status === 'qualified'}
                >
                  Qualified
                </button>
                <button
                  className="status-action-button"
                  onClick={() => handleStatusChange(selectedLead.id, 'converted')}
                  disabled={selectedLead.status === 'converted'}
                >
                  Converted
                </button>
              </div>
            </div>

            {selectedLead.metadata && (
              <div className="detail-section">
                <h3>Metadata</h3>
                {selectedLead.metadata.ip_address && (
                  <div className="detail-item">
                    <span className="detail-label">IP Address:</span>
                    <span className="detail-value">{selectedLead.metadata.ip_address}</span>
                  </div>
                )}
                {selectedLead.metadata.user_agent && (
                  <div className="detail-item">
                    <span className="detail-label">User Agent:</span>
                    <span className="detail-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                      {selectedLead.metadata.user_agent}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;
