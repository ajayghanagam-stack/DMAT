import { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, assignLead, getUsers, exportLeads as exportLeadsAPI } from '../services/api';
import './LeadsPage.css';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, [statusFilter]);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

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

  const handleAssignmentChange = async (leadId, userId) => {
    try {
      const assigned_to = userId === '' ? null : parseInt(userId);
      const response = await assignLead(leadId, assigned_to);

      // Update the lead in the list
      setLeads(leads.map(lead =>
        lead.id === leadId ? {
          ...lead,
          assigned_to: response.data.assigned_to,
          assigned_user: response.data.assigned_user
        } : lead
      ));

      // Update selected lead if it's the one being assigned
      if (selectedLead?.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          assigned_to: response.data.assigned_to,
          assigned_user: response.data.assigned_user
        });
      }
    } catch (err) {
      alert(`Failed to assign lead: ${err.message}`);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }
      const blob = await exportLeadsAPI(params);
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
      lead.landing_page?.title?.toLowerCase().includes(query)
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
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhone = (phone) => {
    if (!phone || phone.trim() === '') return '-';

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // If no digits, return dash
    if (cleaned.length === 0) return '-';

    // Format based on length
    if (cleaned.length === 10) {
      // US format: (123) 456-7890
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      // US with country code: +1 (123) 456-7890
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length > 10) {
      // International: +XX XXX XXX XXXX
      return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
    } else {
      // Less than 10 digits: just add dashes
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    }
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
                  <th>Assigned To</th>
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
                    <td className="lead-phone">{formatPhone(lead.phone)}</td>
                    <td className="lead-source">
                      {lead.landing_page?.title || lead.source || 'Direct'}
                    </td>
                    <td className="lead-assigned">
                      {lead.assigned_user ? lead.assigned_user.name : '-'}
                    </td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td className="lead-date">{formatDate(lead.created_at)}</td>
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
                <span className="detail-label">Source:</span>
                <span className="detail-value">{selectedLead.landing_page?.title || selectedLead.source || 'Direct'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submitted:</span>
                <span className="detail-value">{formatDate(selectedLead.created_at)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Assignment</h3>
              <div className="detail-item">
                <span className="detail-label">Assigned To:</span>
                <select
                  className="assign-dropdown"
                  value={selectedLead.assigned_to || ''}
                  onChange={(e) => handleAssignmentChange(selectedLead.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
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

            {(selectedLead.ip_address || selectedLead.user_agent) && (
              <div className="detail-section">
                <h3>Metadata</h3>
                {selectedLead.ip_address && (
                  <div className="detail-item">
                    <span className="detail-label">IP Address:</span>
                    <span className="detail-value">{selectedLead.ip_address}</span>
                  </div>
                )}
                {selectedLead.user_agent && (
                  <div className="detail-item">
                    <span className="detail-label">User Agent:</span>
                    <span className="detail-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                      {selectedLead.user_agent}
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
