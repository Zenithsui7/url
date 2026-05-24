import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function QRCodeDisplay({ url, fileName = 'qrcode' }) {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: {
        dark: '#ffffff',
        light: '#00000000',
      },
      errorCorrectionLevel: 'H',
    })
      .then(dataUrl => {
        setQrDataUrl(dataUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${fileName.replace(/\.[^.]+$/, '')}-qr.png`;
    a.click();
    addToast('QR code downloaded!', 'success');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`glass shine-card rounded-3xl p-4 flex items-center justify-center`}
        style={{
          width: 200,
          height: 200,
          background: isDark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.7)',
        }}
      >
        {loading ? (
          <div className="w-8 h-8 rounded-full border-2 border-purple-400/40 border-t-purple-400 animate-spin" />
        ) : qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="w-full h-full object-contain"
            style={{
              filter: isDark ? 'none' : 'invert(1)',
              imageRendering: 'pixelated',
            }}
          />
        ) : (
          <span className="text-white/40 text-sm">QR Error</span>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={loading || !qrDataUrl}
        className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          glass-sm btn-glass text-sm font-medium
          text-purple-400 hover:text-purple-300
          border border-purple-500/25 hover:border-purple-400/40
          transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download PNG
      </button>
    </div>
  );
}
