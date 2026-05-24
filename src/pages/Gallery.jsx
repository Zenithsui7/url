import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import FilePreview from '../components/FilePreview';

function formatBytes(b) {
  if (!b) return '—';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = (Date.now() - new Date(isoString)) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Gallery() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = () => {
      try {
        const history = JSON.parse(localStorage.getItem('tun-sahur-history') || '[]');
        setFiles(history);
      } catch {
        setFiles([]);
      }
    };
    load();
  }, []);

  const clearHistory = () => {
    if (window.confirm('Clear all upload history? (Files on Firebase are not deleted)')) {
      localStorage.removeItem('tun-sahur-history');
      setFiles([]);
      addToast('History cleared', 'info');
    }
  };

  const copyLink = async (id) => {
    const link = `${window.location.origin}/file/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      addToast('Link copied!', 'success');
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const categories = {
    all:      files,
    images:   files.filter(f => f.fileType?.startsWith('image/')),
    videos:   files.filter(f => f.fileType?.startsWith('video/')),
    audio:    files.filter(f => f.fileType?.startsWith('audio/')),
    docs:     files.filter(f => f.fileType === 'application/pdf' || f.fileType?.includes('zip')),
  };

  const filtered = (categories[filter] || files).filter(f =>
    !search || f.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  const textMain  = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-white/50' : 'text-slate-400';
  const tabs = ['all','images','videos','audio','docs'];

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#020510]' : 'bg-[#eef2ff]'}`}>

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute rounded-full animate-float" style={{ width:450, height:450, top:'-12%', right:'-5%', background: isDark ? 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(249,168,212,0.2) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full animate-float2" style={{ width:400, height:400, bottom:'-10%', left:'-6%', background: isDark ? 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 pt-28 pb-16 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 page-enter">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${textMain}`}>Gallery</h1>
            <p className={`text-sm ${textMuted} mt-1`}>
              {files.length} file{files.length !== 1 ? 's' : ''} · stored on this device
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs px-3 py-2 glass-sm rounded-xl text-red-400 border border-red-500/20 hover:border-red-400/35 transition-all btn-glass"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Search + Filter row */}
        {files.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6 page-enter" style={{ animationDelay: '0.05s' }}>
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search files…"
                className={`
                  w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-sm
                  ${isDark ? 'text-white placeholder:text-white/30' : 'text-slate-800 placeholder:text-slate-400'}
                `}
              />
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 glass-sm rounded-xl p-1">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200
                    ${filter === t
                      ? 'btn-gradient text-white shadow-glow'
                      : `${textMuted} hover:text-white/80 btn-glass`
                    }
                  `}
                >
                  {t}
                  {t !== 'all' && categories[t]?.length > 0 && (
                    <span className="ml-1 opacity-60">({categories[t].length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 page-enter">
            <div className="text-6xl mb-4">📭</div>
            <h2 className={`text-xl font-semibold ${textMain} mb-2`}>No uploads yet</h2>
            <p className={`text-sm ${textMuted} mb-6 text-center max-w-xs`}>
              Files you upload will appear here so you can quickly copy their links.
            </p>
            <Link
              to="/"
              className="px-6 py-3 btn-gradient text-white font-semibold rounded-2xl text-sm"
            >
              Upload Your First File
            </Link>
          </div>
        )}

        {/* Search empty */}
        {files.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 page-enter">
            <div className="text-5xl mb-3">🔍</div>
            <p className={`text-base font-medium ${textMain}`}>No files match "{search}"</p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((file, i) => (
              <div
                key={file.id}
                className="glass shine-card rounded-2xl overflow-hidden flex flex-col page-enter"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Preview */}
                <Link to={`/file/${file.id}`} className="block">
                  <div className="h-44 overflow-hidden">
                    <FilePreview
                      url={file.downloadURL}
                      mimeType={file.fileType}
                      fileName={file.fileName}
                      compact
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3.5 flex flex-col gap-2">
                  <Link to={`/file/${file.id}`}>
                    <p className={`text-sm font-semibold ${textMain} truncate leading-tight`}>{file.fileName}</p>
                    <p className={`text-xs ${textMuted} mt-0.5`}>{formatBytes(file.fileSize)} · {timeAgo(file.uploadedAt)}</p>
                  </Link>

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => copyLink(file.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 glass-sm rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-400/35 transition-all btn-glass"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      Copy
                    </button>
                    <Link
                      to={`/file/${file.id}`}
                      className="flex items-center justify-center w-8 h-8 glass-sm rounded-lg text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/35 transition-all btn-glass"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
