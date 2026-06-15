import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrls, shortenUrl, editUrl, deleteUrl, getServerIp } from '../api/urlApi';
import { 
  Link2, Search, Upload, Check, AlertCircle, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import UrlForm from '../components/UrlForm';
import UrlCard from '../components/UrlCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverIp, setServerIp] = useState('');

  // Bulk CSV state
  const [csvFile, setCsvFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [activeQrUrl, setActiveQrUrl] = useState(null);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await getUrls();
      setUrls(data);
      try {
        const ipData = await getServerIp();
        setServerIp(ipData.serverIp);
      } catch (ipErr) {
        console.error('Failed to fetch server IP', ipErr);
      }
    } catch (err) {
      setError('Failed to fetch shortened links');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShortUrl = async (formData) => {
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const data = await shortenUrl(formData);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#06b6d4']
      });

      setSuccess('URL shortened successfully!');
      setUrls([data, ...urls]);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link and all its analytics?')) {
      return;
    }

    try {
      await deleteUrl(id);
      setUrls(urls.filter(url => url._id !== id));
      setSuccess('Link deleted successfully');
    } catch (err) {
      setError('Failed to delete shortened link');
    }
  };

  const handleEditClick = (url) => {
    setEditingUrl(url);
    setEditInputValue(url.originalUrl);
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const data = await editUrl(editingUrl._id, { originalUrl: editInputValue });
      setUrls(urls.map(item => item._id === editingUrl._id ? data : item));
      setEditingUrl(null);
      setSuccess('Destination URL updated successfully');
    } catch (err) {
      setEditError(err.response?.data?.msg || 'Failed to update URL');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setBulkLoading(true);
    setBulkResult('');
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      let successfulCount = 0;
      let failedCount = 0;
      const createdUrls = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.toLowerCase().startsWith('url,') || line.toLowerCase().startsWith('originalurl,')) {
          continue;
        }

        const parts = line.split(',');
        const targetUrl = parts[0]?.trim();
        const alias = parts[1]?.trim() || undefined;
        const expiry = parts[2]?.trim() || undefined;

        if (targetUrl) {
          try {
            const data = await shortenUrl({
              originalUrl: targetUrl,
              customAlias: alias || undefined,
              expiresAt: expiry || undefined
            });
            successfulCount++;
            createdUrls.push(data);
          } catch (err) {
            failedCount++;
          }
        }
      }

      setBulkLoading(false);
      setCsvFile(null);
      
      if (successfulCount > 0) {
        setUrls(prev => [...createdUrls, ...prev]);
        confetti({
          particleCount: 50,
          spread: 50,
          colors: ['#10b981', '#34d399']
        });
      }

      setBulkResult(`Bulk creation complete. Created: ${successfulCount}, Failed: ${failedCount}`);
      document.getElementById('csv-file-input').value = '';
    };

    reader.readAsText(csvFile);
  };

  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (url.customAlias && url.customAlias.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }} className="text-gradient">Link Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Generate short codes, manage links, and review analytics
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', ...window.innerWidth > 992 && { gridTemplateColumns: '380px 1fr' } }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link2 size={18} color="var(--primary)" />
              <span>Shorten URL</span>
            </h3>

            {error && (
              <div className="status-box status-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="status-box status-success">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            <UrlForm onSubmit={handleCreateShortUrl} loading={submitLoading} />
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="var(--accent-cyan)" />
              <span>Bulk Shorten CSV</span>
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
              Shorten links in bulk using a CSV file. Columns must be: <code>originalUrl, customAlias, expiresAt</code>
            </p>

            {bulkResult && (
              <div className="status-box status-success" style={{ fontSize: '13px' }}>
                <Check size={16} />
                <span>{bulkResult}</span>
              </div>
            )}

            <form onSubmit={handleCsvUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
              />
              <button 
                type="submit" 
                className="btn-secondary btn-small" 
                style={{ width: '100%' }}
                disabled={bulkLoading || !csvFile}
              >
                {bulkLoading ? 'Processing CSV...' : 'Upload & Shorten'}
              </button>
            </form>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by long URL or short code..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '0', fontSize: '14px' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="glass-card">
              <Loader message="Loading links..." />
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                {searchQuery ? 'No matching links found.' : 'You have not shortened any links yet.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredUrls.map(url => (
                <UrlCard 
                  key={url._id} 
                  url={url} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteUrl} 
                  onQrClick={setActiveQrUrl} 
                  onAnalyticsClick={(id) => navigate(`/analytics/${id}`)}
                  serverIp={serverIp}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {activeQrUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '90%', maxWidth: '340px', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setActiveQrUrl(null)} 
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>QR Code</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Scan to visit: <strong style={{ color: 'var(--accent-cyan)' }}>/{activeQrUrl.shortCode}</strong>
            </p>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <QRCodeSVG 
                value={`${(() => {
                  let base = import.meta.env.VITE_API_URL || '';
                  if (!base) {
                    base = `http://${window.location.hostname}:5000`;
                  }
                  if (serverIp && serverIp !== '127.0.0.1' && (base.includes('localhost') || base.includes('127.0.0.1'))) {
                    base = base.replace('localhost', serverIp).replace('127.0.0.1', serverIp);
                  }
                  return base.replace(/\/$/, '');
                })()}/${activeQrUrl.shortCode}`} 
                size={180} 
                bgColor="#ffffff" 
                fgColor="#090d16" 
                level="M" 
              />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.4 }}>
                Right-click the QR code image above to copy or download it.
              </p>
            </div>
          </div>
        </div>
      )}

      {editingUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '90%', maxWidth: '480px', position: 'relative' }}>
            <button 
              onClick={() => setEditingUrl(null)} 
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }} className="text-gradient">Edit Destination URL</h3>
            
            {editError && (
              <div className="status-box status-error" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                  Short Code: <strong style={{ color: 'var(--accent-cyan)' }}>/{editingUrl.shortCode}</strong>
                </p>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  New Destination URL
                </label>
                <input
                  type="url"
                  className="glass-input"
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditingUrl(null)} className="btn-secondary btn-small">
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-small" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
