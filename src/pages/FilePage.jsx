import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import FilePreview from '../components/FilePreview';
import QRCodeDisplay from '../components/QRCodeDisplay';

function formatBytes(b) {
  if (!b) return '—';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(2) + ' MB';
  return (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function FilePage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [fileMeta, setFileMeta] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);

  const shareableLink = `${window.location.origin}/file/${id}`;

  useEffect(() => {
    // First try localStorage cache
    try {
      const history = JSON.parse(localStorage.getItem('tun-sahur-history') || '[]');
      const cached = history.find(f => f.id === id);
      if (cached) setFileMeta(cached);
    } catch {}

    // Then fetch from Firestore
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'files', id));
        if (snap.exists()) {
          setFileMeta({ id: snap.id, ...snap.data() });
        } else {
          setError('File not found or has been deleted.');
        }
      } catch (e) {
        console.error(e);
        if (!fileMeta) setError('Could not load file. Check your Firebase config.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      addToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const textMain  = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-white/50' : 'text-slate-400';

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#020510]' : 'bg-[#eef2ff]'}`}>

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute rounded-full animate-float" style={{ width:500, height:500, top:'-10%', right:'-8%', background: isDark ? 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(147,197,253,0.25) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full animate-float2" style={{ width:400, height:400, bottom:'-10%', left:'-8%', background: isDark ? 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-28 pb-16">

        {loading && (
          <div className="flex flex-col items-center gap-4 mt-20">
            <div className="w-12 h-12 rounded-full border-2 border-purple-400/40 border-t-purple-400 animate-spin" />
            <p className={textMuted}>Loading file…</p>
          </div>
        )}

        {!loading && error && !fileMeta && (
          <div className="glass rounded-3xl p-10 text-center max-w-md page-enter">
            <div className="text-5xl mb-4">😶‍🌫️</div>
            <p className={`text-lg font-semibold ${textMain} mb-2`}>File not found</p>
            <p className={`text-sm ${textMuted} mb-6`}>{error}</p>
            <Link to="/" className="px-5 py-2.5 btn-gradient text-white rounded-xl font-medium text-sm">
              Upload a File
            </Link>
          </div>
        )}

        {fileMeta && (
          <div className="w-full max-w-2xl flex flex-col gap-5 page-enter">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${textMain} truncate max-w-xs sm:max-w-md`}>
                  {fileMeta.fileName}
                </h1>
                <p className={`text-sm ${textMuted} mt-0.5`}>
                  {formatBytes(fileMeta.fileSize)} · {formatDate(fileMeta.uploadedAt)}
                </p>
              </div>
              <Link
                to="/"
                className={`shrink-0 px-3 py-2 glass-sm rounded-xl text-xs font-medium ${textMuted} hover:text-white transition-colors btn-glass`}
              >
                ← New Upload
              </Link>
            </div>

            {/* File Preview */}
            <div className="glass shine-card rounded-3xl overflow-hidden p-1">
              <FilePreview
                url={fileMeta.downloadURL}
                mimeType={fileMeta.fileType}
                fileName={fileMeta.fileName}
              />
            </div>

            {/* Shareable Link + QR row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Shareable Link Card */}
              <div className="glass shine-card rounded-3xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <span className={`text-sm font-semibold ${textMain}`}>Shareable Link</span>
                </div>

                <div className={`glass-input rounded-xl px-3 py-2 text-xs break-all font-mono ${isDark ? 'text-white/70' : 'text-slate-600'} select-all`}>
                  {shareableLink}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyLink}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                      transition-all duration-200
                      ${copied
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'btn-gradient text-white'
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        Copy Link
                      </>
                    )}
                  </button>

                  <a
                    href={fileMeta.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={fileMeta.fileName}
                    className="flex items-center justify-center w-10 h-10 glass-sm rounded-xl btn-glass"
                    title="Download file"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'rgba(255,255,255,0.6)' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* QR Code Card */}
              <div className="glass shine-card rounded-3xl p-5 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 mb-1 self-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><rect x="16" y="16" width="5" height="5"/><line x1="10" y1="5" x2="10" y2="5"/></svg>
                  </div>
                  <span className={`text-sm font-semibold ${textMain}`}>QR Code</span>
                </div>
                <QRCodeDisplay url={shareableLink} fileName={fileMeta.fileName} />
              </div>
            </div>

            {/* File meta chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: fileMeta.fileType || 'Unknown type', icon: '📋' },
                { label: formatBytes(fileMeta.fileSize), icon: '💾' },
                { label: formatDate(fileMeta.uploadedAt), icon: '🕐' },
              ].map(({ label, icon }) => (
                <span
                  key={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-sm text-xs ${textMuted}`}
                >
                  <span>{icon}</span> {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
