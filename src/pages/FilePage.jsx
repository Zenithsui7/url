import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import QRCodeDisplay from '../components/QRCodeDisplay';

function formatBytes(b) {
  if (!b) return '—';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(2) + ' MB';
  return (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fileIcon(type = '') {
  if (type.startsWith('image/'))  return '🖼️';
  if (type.startsWith('video/'))  return '🎬';
  if (type.startsWith('audio/'))  return '🎵';
  if (type === 'application/pdf') return '📄';
  if (type.includes('zip'))       return '🗜️';
  return '📁';
}

export default function FilePage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [fileMeta, setFileMeta] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);

  // The shareable link IS the gofile.io download page
  const shareableLink = fileMeta?.downloadURL || '';

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('tun-sahur-history') || '[]');
      const found = history.find(f => f.id === id);
      if (found) setFileMeta(found);
    } catch {}
    setLoading(false);
  }, [id]);

  const copyLink = async () => {
    if (!shareableLink) return;
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      addToast('Link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const textMain  = isDark ? 'text-white'    : 'text-slate-900';
  const textMuted = isDark ? 'text-white/50'  : 'text-slate-400';

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#020510]' : 'bg-[#eef2ff]'}`}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 pt-24 pb-16 flex flex-col gap-6">

        {loading && (
          <div className="flex justify-center pt-20">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && !fileMeta && (
          <div className="glass rounded-3xl p-10 text-center flex flex-col items-center gap-4">
            <div className="text-5xl">🌫️</div>
            <p className={`text-lg font-semibold ${textMain}`}>File not found</p>
            <p className={`text-sm ${textMuted}`}>This file may only be viewable on the device that uploaded it.</p>
            <Link to="/" className="mt-2 px-6 py-2.5 btn-gradient text-white rounded-xl text-sm font-medium">
              Upload a new file
            </Link>
          </div>
        )}

        {!loading && fileMeta && (
          <>
            {/* File card */}
            <div className="glass shine-card rounded-3xl p-6 flex flex-col items-center gap-4 page-enter">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl shadow-lg">
                {fileIcon(fileMeta.fileType)}
              </div>
              <div className="text-center">
                <p className={`text-base font-semibold ${textMain} break-all`}>{fileMeta.fileName}</p>
                <p className={`text-xs ${textMuted} mt-1`}>
                  {formatBytes(fileMeta.fileSize)} · {formatDate(fileMeta.uploadedAt)}
                </p>
              </div>
            </div>

            {/* Shareable link */}
            <div className="glass rounded-3xl p-5 flex flex-col gap-3 page-enter">
              <p className={`text-xs font-semibold uppercase tracking-widest ${textMuted}`}>Shareable Link</p>
              <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <span className={`text-xs flex-1 truncate font-mono ${textMain}`}>{shareableLink}</span>
                <button onClick={copyLink}
                  className="shrink-0 px-3 py-1.5 btn-gradient rounded-xl text-white text-xs font-semibold transition-all active:scale-95">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <a href={shareableLink} target="_blank" rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl btn-gradient text-white font-semibold text-sm text-center tracking-wide">
                Open / Download File ↗
              </a>
            </div>

            {/* QR Code */}
            <div className="glass rounded-3xl p-6 page-enter">
              <p className={`text-xs font-semibold uppercase tracking-widest ${textMuted} mb-4`}>QR Code</p>
              <QRCodeDisplay url={shareableLink} fileName={fileMeta.fileName} />
            </div>

            {/* Upload another */}
            <Link to="/" className="w-full py-3 glass rounded-2xl text-center text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors page-enter">
              + Upload Another File
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
