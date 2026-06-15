import React, { useState } from 'react';
import { Copy, Trash2, BarChart3, QrCode, Edit, Check, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '../utils/copyToClipboard';

const UrlCard = ({ url, onEdit, onDelete, onQrClick, onAnalyticsClick, serverIp }) => {
  const [copied, setCopied] = useState(false);
  const getShortUrl = (code) => {
    let base = import.meta.env.VITE_API_URL || '';
    if (!base) {
      base = `http://${window.location.hostname}:5000`;
    }
    if (serverIp && serverIp !== '127.0.0.1' && (base.includes('localhost') || base.includes('127.0.0.1'))) {
      base = base.replace('localhost', serverIp).replace('127.0.0.1', serverIp);
    }
    return `${base.replace(/\/$/, '')}/${code}`;
  };
  const fullShortUrl = getShortUrl(url.shortCode);
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  const handleCopyClick = () => {
    const success = copyToClipboard(fullShortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
      opacity: isExpired ? 0.6 : 1,
      position: 'relative'
    }}>
      {isExpired && (
        <span className="badge badge-error" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px' }}>
          Expired
        </span>
      )}

      <div>
        <h4 style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '6px'
        }}>
          Original Link
        </h4>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }} title={url.originalUrl}>
          {url.originalUrl}
        </p>
      </div>

      <div>
        <h4 style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '6px'
        }}>
          Shortened Link
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" style={{
            color: 'var(--accent-cyan)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>/{url.shortCode}</span>
            <ExternalLink size={12} />
          </a>
          <button 
            onClick={handleCopyClick} 
            className={`copy-tooltip ${copied ? 'show-tooltip' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} color="var(--text-muted)" />}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Created: </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {new Date(url.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clicks: </span>
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            {url.clicks}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
        <button onClick={() => onEdit(url)} className="btn-secondary btn-small" style={{ padding: '8px' }} title="Edit Target URL">
          <Edit size={14} />
        </button>
        <button onClick={() => onQrClick(url)} className="btn-secondary btn-small" style={{ padding: '8px' }} title="QR Code">
          <QrCode size={14} />
        </button>
        <button onClick={() => onAnalyticsClick(url._id)} className="btn-secondary btn-small" style={{ padding: '8px', color: '#a855f7' }} title="Analytics">
          <BarChart3 size={14} />
        </button>
        <button onClick={() => onDelete(url._id)} className="btn-danger btn-small" style={{ padding: '8px' }} title="Delete URL">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default UrlCard;
