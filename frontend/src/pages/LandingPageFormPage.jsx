import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getLandingPage,
  createLandingPage,
  updateLandingPage,
  publishLandingPage,
  deleteLandingPage,
  getTemplates,
} from '../services/api';
import './LandingPageFormPage.css';

function LandingPageFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    template_id: null,
    headline: '',
    subheading: '',
    body_text: '',
    hero_image_url: '',
    cta_text: 'Submit',
    form_fields: {
      fields: [
        { name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your name' },
        { name: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'your@email.com' },
        { name: 'phone', type: 'tel', label: 'Phone Number', required: false, placeholder: '+1 (555) 000-0000' },
      ],
    },
  });

  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadPage();
    }
  }, [id]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadPage = async () => {
    try {
      setLoading(true);
      const response = await getLandingPage(id);
      setFormData(response.data);
      setSlugEdited(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await getTemplates();
      setTemplates(response.data);
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'title' && !slugEdited) {
      const newSlug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleSlugChange = (value) => {
    setSlugEdited(true);
    setFormData(prev => ({ ...prev, slug: value }));
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError(null);

      if (isEditMode) {
        await updateLandingPage(id, formData);
        alert('Landing page updated successfully!');
      } else {
        const response = await createLandingPage(formData);
        alert('Landing page created successfully!');
        navigate(`/landing-pages/${response.data.id}/edit`);
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isEditMode) {
      alert('Please save as draft first before publishing.');
      return;
    }

    if (!window.confirm('Are you sure you want to publish this landing page?')) {
      return;
    }

    try {
      setPublishing(true);
      setError(null);
      await publishLandingPage(id);
      alert('Landing page published successfully!');
      navigate('/landing-pages');
    } catch (err) {
      setError(err.message);
      alert(`Error publishing: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this landing page? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteLandingPage(id);
      alert('Landing page deleted successfully!');
      navigate('/landing-pages');
    } catch (err) {
      alert(`Error deleting: ${err.message}`);
    }
  };

  const handlePreview = () => {
    window.open(`/landing-pages/${id}/preview`, '_blank');
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <div>
          <h1>{isEditMode ? 'Edit Landing Page' : 'Create Landing Page'}</h1>
          <p>Fill in the details for your landing page</p>
        </div>
        {isEditMode && (
          <button
            className="secondary-button"
            onClick={handlePreview}
          >
            👁 Preview
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="form-content">
        {!isEditMode && (
          <div className="form-section">
            <h2>Choose Template</h2>
            <p className="section-description">
              Select a template for your landing page. This will determine the layout and design.
            </p>

            {loadingTemplates ? (
              <div className="templates-loading">
                <div className="loading-spinner"></div>
                <p>Loading templates...</p>
              </div>
            ) : (
              <div className="templates-grid">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`template-card ${formData.template_id === template.id ? 'selected' : ''}`}
                    onClick={() => handleChange('template_id', template.id)}
                  >
                    {template.thumbnail_url && (
                      <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="template-thumbnail"
                      />
                    )}
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      <p>{template.description}</p>
                    </div>
                    {formData.template_id === template.id && (
                      <div className="template-selected-badge">✓ Selected</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="form-section">
          <h2>Page Information</h2>

          <div className="form-field">
            <label htmlFor="title">
              Page Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Free Marketing Guide 2025"
              required
              maxLength={500}
            />
            <p className="field-help">
              Internal name for this landing page. Shown in browser tab.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="slug">
              URL Slug <span className="required">*</span>
            </label>
            <div className="slug-input-group">
              <span className="slug-prefix">/</span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="free-marketing-guide-2025"
                required
                maxLength={100}
              />
            </div>
            <p className="field-help">
              URL path for this page. Only letters, numbers, and hyphens.
            </p>
          </div>
        </div>

        <div className="form-section">
          <h2>Content</h2>

          <div className="form-field">
            <label htmlFor="headline">Headline</label>
            <input
              type="text"
              id="headline"
              value={formData.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="e.g., Download Your Free Marketing Guide"
              maxLength={500}
            />
            <p className="field-help">
              Main headline displayed at the top of the page.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="subheading">Subheading</label>
            <input
              type="text"
              id="subheading"
              value={formData.subheading || ''}
              onChange={(e) => handleChange('subheading', e.target.value)}
              placeholder="e.g., Learn the latest strategies that drive results"
              maxLength={500}
            />
            <p className="field-help">
              Secondary text below the headline.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="body_text">Body Text</label>
            <textarea
              id="body_text"
              value={formData.body_text || ''}
              onChange={(e) => handleChange('body_text', e.target.value)}
              placeholder="Enter the main content for your landing page..."
              rows={6}
            />
            <p className="field-help">
              Main content area. Can include multiple paragraphs.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="hero_image_url">Hero Image URL</label>
            <input
              type="url"
              id="hero_image_url"
              value={formData.hero_image_url || ''}
              onChange={(e) => handleChange('hero_image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="field-help">
              URL to an image to display at the top of the page.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="cta_text">Call-to-Action Button Text</label>
            <input
              type="text"
              id="cta_text"
              value={formData.cta_text}
              onChange={(e) => handleChange('cta_text', e.target.value)}
              placeholder="e.g., Get Free Guide"
              maxLength={100}
            />
            <p className="field-help">
              Text shown on the form submit button.
            </p>
          </div>
        </div>

        <div className="form-section">
          <h2>Form Configuration</h2>
          <p className="section-description">
            The form will include these fields. (Phase 1: Fixed fields - Name, Email, Phone)
          </p>

          <div className="form-fields-preview">
            {formData.form_fields.fields.map((field, index) => (
              <div key={index} className="field-preview">
                <span className="field-name">{field.label}</span>
                <span className="field-type">({field.type})</span>
                {field.required && <span className="field-required">Required</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <div className="actions-left">
          {isEditMode && (
            <button
              className="danger-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
        <div className="actions-right">
          <button
            className="secondary-button"
            onClick={() => navigate('/landing-pages')}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Draft'}
          </button>
          {isEditMode && (
            <button
              className="publish-button"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPageFormPage;
