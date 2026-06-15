import React, { useState } from 'react';
import { Link2, Calendar } from 'lucide-react';

const UrlForm = ({ onSubmit, loading }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl) return;
    onSubmit({ originalUrl, customAlias, expiresAt });
    setOriginalUrl('');
    setCustomAlias('');
    setExpiresAt('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Destination URL *
        </label>
        <input
          type="url"
          className="glass-input"
          placeholder="https://example.com/very-long-path"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Custom Alias (Optional)
        </label>
        <input
          type="text"
          className="glass-input"
          placeholder="marketing-campaign"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Expiration Date (Optional)
        </label>
        <div style={{ position: 'relative' }}>
          <Calendar size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px' }} />
          <input
            type="datetime-local"
            className="glass-input"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten Link'}
      </button>
    </form>
  );
};

export default UrlForm;
