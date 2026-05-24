import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const fileCategories = {
  image:    ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','image/bmp'],
  video:    ['video/mp4','video/quicktime','video/webm','video/ogg','video/mov'],
  audio:    ['audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/flac','audio/aac'],
  pdf:      ['application/pdf'],
  archive:  ['application/zip','application/x-rar-compressed','application/x-7z-compressed'],
  document: ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

function getCategory(mimeType) {
  if (!mimeType) return 'other';
  for (const [cat, types] of Object.entries(fileCategories)) {
    if (types.includes(mimeType) || mimeType.startsWith(cat + '/')) return cat;
  }
  return 'other';
}

function FileIcon({ category, isDark }) {
  const iconMap = {
    image: { icon: '🖼️', label: 'Image', color: 'from-purple-500 to-pink-500' },
    video: { icon: '🎬', label: 'Video', color: 'from-blue-500 to-cyan-500' },
    audio: { icon: '🎵', label: 'Audio', color: 'from-green-500 to-teal-500' },
    pdf:   { icon: '📄', label: 'PDF',   color: 'from-red-500 to-orange-500' },
    archive: { icon: '🗜️', label: 'Archive', color: 'from-yellow-500 to-amber-500' },
    document: { icon: '📝', label: 'Document', color: 'from-indigo-500 to-blue-500' },
    other: { icon: '📁', label: 'File',  color: 'from-slate-500 to-gray-500' },
  };
  const { icon, label, color } = iconMap[category] || iconMap.other;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-4xl shadow-lg`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{label} file</span>
    </div>
  );
}

export default function FilePreview({ url, mimeType, fileName, compact = false }) {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const category = getCategory(mimeType);

  const containerCls = compact
    ? 'w-full h-48 flex items-center justify-center rounded-xl overflow-hidden'
    : 'w-full flex items-center justify-center rounded-2xl overflow-hidden';
  const containerStyle = compact
    ? {}
    : { minHeight: '240px', maxHeight: '520px' };

  const bgCls = isDark ? 'bg-white/5' : 'bg-black/5';

  if (!url) {
    return (
      <div className={`${containerCls} ${bgCls}`} style={containerStyle}>
        <FileIcon category={category} isDark={isDark} />
      </div>
    );
  }

  if (category === 'image' && !imgError) {
    return (
      <div className={`${containerCls} ${bgCls}`} style={containerStyle}>
        <img
          src={url}
          alt={fileName || 'Preview'}
          className="max-w-full max-h-full object-contain rounded-xl"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  if (category === 'video' && !videoError) {
    return (
      <div className={`${containerCls} ${bgCls} rounded-2xl`} style={containerStyle}>
        <video
          src={url}
          controls
          className="max-w-full max-h-full rounded-xl"
          style={{ maxHeight: compact ? '192px' : '460px' }}
          onError={() => setVideoError(true)}
        />
      </div>
    );
  }

  if (category === 'audio') {
    return (
      <div className={`${containerCls} ${bgCls} flex-col gap-4 py-8`} style={containerStyle}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-4xl shadow-lg animate-pulse-slow">
          🎵
        </div>
        <p className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'} max-w-xs truncate text-center px-4`}>
          {fileName}
        </p>
        <audio
          src={url}
          controls
          className="w-full max-w-sm"
          style={{ filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none', opacity: 0.85 }}
        />
      </div>
    );
  }

  if (category === 'pdf') {
    return (
      <div className={`${containerCls} ${bgCls} flex-col gap-4 py-8`} style={containerStyle}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
          📄
        </div>
        <p className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'} max-w-xs truncate text-center px-4`}>
          {fileName}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 glass-sm rounded-xl text-sm font-medium text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200"
        >
          Open PDF ↗
        </a>
      </div>
    );
  }

  return (
    <div className={`${containerCls} ${bgCls} flex-col gap-3 py-8`} style={containerStyle}>
      <FileIcon category={category} isDark={isDark} />
      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-400'} max-w-xs truncate px-4`}>
        {fileName}
      </p>
    </div>
  );
}
