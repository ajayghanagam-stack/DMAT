import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPreview } from '../services/api';

function PreviewPage() {
  const { id } = useParams();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPreview();
  }, [id]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      const htmlContent = await getPreview(id);
      setHtml(htmlContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading preview...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <p style={{ color: '#e53e3e' }}>Error loading preview: {error}</p>
        <button onClick={loadPreview}>Retry</button>
      </div>
    );
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default PreviewPage;
