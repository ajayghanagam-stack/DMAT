import { useState, useEffect } from 'react';
import {
  getLinkedInStatus,
  getLinkedInAuthUrl,
  disconnectLinkedIn,
  publishLinkedInPost,
  getLinkedInPosts,
  getLinkedInStats
} from '../services/api';
import './LinkedInPage.css';

function LinkedInPage() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Post composer state
  const [postContent, setPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishing, setPublishing] = useState(false);

  // Post history state
  const [posts, setPosts] = useState([]);
  const [postStats, setPostStats] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    checkConnectionStatus();

    // Check for OAuth callback success/error
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess('LinkedIn account connected successfully!');
      checkConnectionStatus();
      window.history.replaceState({}, '', '/linkedin');
    } else if (params.get('error')) {
      setError(decodeURIComponent(params.get('error')));
      window.history.replaceState({}, '', '/linkedin');
    }
  }, []);

  useEffect(() => {
    if (connectionStatus?.connected) {
      loadPostHistory();
      loadPostStats();
    }
  }, [connectionStatus]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const data = await getLinkedInStatus();
      setConnectionStatus(data);
    } catch (err) {
      setError('Failed to check LinkedIn connection status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setError(null);
      const data = await getLinkedInAuthUrl();

      // Redirect to LinkedIn OAuth
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.message || 'Failed to initiate LinkedIn connection');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your LinkedIn account?')) {
      return;
    }

    try {
      setError(null);
      await disconnectLinkedIn();
      setSuccess('LinkedIn account disconnected');
      setConnectionStatus(null);
      setPosts([]);
      setPostStats(null);
    } catch (err) {
      setError('Failed to disconnect LinkedIn account');
    }
  };

  const handlePublishPost = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    if (postContent.length > 3000) {
      setError('Post content exceeds 3000 character limit');
      return;
    }

    try {
      setPublishing(true);
      setError(null);

      await publishLinkedInPost({
        content: postContent,
        imageUrl: imageUrl || null
      });

      setSuccess('Post published successfully!');
      setPostContent('');
      setImageUrl('');

      // Reload post history and stats
      await loadPostHistory();
      await loadPostStats();
    } catch (err) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  const loadPostHistory = async () => {
    try {
      setLoadingPosts(true);
      const data = await getLinkedInPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load post history:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadPostStats = async () => {
    try {
      const data = await getLinkedInStats();
      setPostStats(data);
    } catch (err) {
      console.error('Failed to load post stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="linkedin-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="linkedin-page">
      <div className="page-header">
        <h1>LinkedIn Publishing</h1>
        <p>Publish content directly to your LinkedIn profile</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
          <button className="alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          {success}
          <button className="alert-close" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="card connection-card">
        <h2>Connection Status</h2>

        {!connectionStatus?.connected ? (
          <div className="connection-disconnected">
            <div className="status-icon">🔗</div>
            <p>LinkedIn account not connected</p>
            <button className="btn btn-primary" onClick={handleConnect}>
              Connect LinkedIn Account
            </button>
          </div>
        ) : (
          <div className="connection-connected">
            <div className="status-badge">
              <span className="status-dot"></span>
              Connected
            </div>
            <div className="connection-info">
              <p><strong>Account:</strong> {connectionStatus.linkedinUserName}</p>
              {connectionStatus.linkedinUserEmail && (
                <p><strong>Email:</strong> {connectionStatus.linkedinUserEmail}</p>
              )}
              <p><strong>Connected:</strong> {new Date(connectionStatus.connectedAt).toLocaleDateString()}</p>
            </div>
            {postStats && (
              <div className="post-stats">
                <div className="stat-item">
                  <div className="stat-value">{postStats.totalPosts}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{postStats.postsLast30Days}</div>
                  <div className="stat-label">Last 30 Days</div>
                </div>
              </div>
            )}
            <button className="btn btn-secondary" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Post Composer (only show if connected) */}
      {connectionStatus?.connected && (
        <div className="card composer-card">
          <h2>Create Post</h2>
          <form onSubmit={handlePublishPost}>
            <div className="form-group">
              <label>Post Content *</label>
              <textarea
                className="form-control"
                rows="6"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to share? (Max 3000 characters)"
                maxLength="3000"
              />
              <div className="char-count">
                {postContent.length} / 3000 characters
              </div>
            </div>

            {/* Image support disabled - LinkedIn requires images to be uploaded to their CDN first
            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled
              />
              <small className="form-hint" style={{color: '#666'}}>
                Note: Image support coming soon. LinkedIn requires images to be uploaded to their CDN first.
              </small>
            </div>
            */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={publishing || !postContent.trim()}
            >
              {publishing ? 'Publishing...' : 'Publish to LinkedIn'}
            </button>
          </form>
        </div>
      )}

      {/* Post History (only show if connected) */}
      {connectionStatus?.connected && (
        <div className="card history-card">
          <h2>Post History</h2>

          {loadingPosts ? (
            <div className="loading">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Create your first post above!</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post.id} className="post-item">
                  <div className="post-header">
                    <span className="post-date">
                      {new Date(post.published_at).toLocaleString()}
                    </span>
                    {post.post_url && (
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="post-link"
                      >
                        View on LinkedIn →
                      </a>
                    )}
                  </div>
                  <div className="post-content">
                    {post.post_content}
                  </div>
                  {post.image_url && (
                    <div className="post-image">
                      <img src={post.image_url} alt="Post" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LinkedInPage;
