import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

export default function NavBar() {
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navTextBase = isDark
    ? 'text-white/70 hover:text-white'
    : 'text-slate-600 hover:text-slate-900';

  const navTextActive = isDark
    ? 'text-white'
    : 'text-slate-900';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-safe-top">
      <div
        className={`glass ${isDark ? '' : 'glass-light'} rounded-2xl mt-3 mx-auto max-w-5xl px-5 py-3 flex items-center justify-between`}
        style={{ borderRadius: '18px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center btn-gradient shrink-0"
            style={{ boxShadow: '0 2px 12px rgba(139,92,246,0.45)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <span className={`font-semibold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Tun Sahur
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
              transition-all duration-200 btn-glass
              ${isActive('/') ? `${navTextActive} glass-sm` : navTextBase}
            `}
          >
            <HomeIcon />
            <span className="hidden sm:inline">Upload</span>
          </Link>
          <Link
            to="/gallery"
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
              transition-all duration-200 btn-glass
              ${isActive('/gallery') ? `${navTextActive} glass-sm` : navTextBase}
            `}
          >
            <GridIcon />
            <span className="hidden sm:inline">Gallery</span>
          </Link>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center
            glass-sm btn-glass transition-all duration-200
            ${isDark ? 'text-yellow-300/80 hover:text-yellow-300' : 'text-slate-500 hover:text-slate-800'}
          `}
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
}
