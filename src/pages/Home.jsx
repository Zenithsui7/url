import { useTheme } from '../context/ThemeContext';
import DropZone from '../components/DropZone';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#020510]' : 'bg-[#eef2ff]'}`}>

      {/* ── Animated orb background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: isDark
              ? 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="absolute rounded-full animate-float2"
          style={{
            width: 500, height: 500,
            bottom: '-10%', right: '-8%',
            background: isDark
              ? 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="absolute rounded-full animate-float3"
          style={{
            width: 400, height: 400,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: isDark
              ? 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(249,168,212,0.2) 0%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">

        {/* Hero */}
        <div className="text-center mb-10 page-enter">
          {/* Logo pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6">
            <span className="text-base">☁️</span>
            <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Tun Sahur
            </span>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Share any file,{' '}
            <span className="gradient-text-animated">instantly.</span>
          </h1>

          <p className={`text-base sm:text-lg max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
            Upload a photo, video, audio, document or any file — and get a
            shareable link + QR code in seconds.
          </p>
        </div>

        {/* Upload zone */}
        <div className="w-full max-w-xl page-enter" style={{ animationDelay: '0.1s' }}>
          <DropZone />
        </div>

        {/* Bottom note */}
        <p
          className={`mt-8 text-xs ${isDark ? 'text-white/30' : 'text-slate-400'} text-center page-enter`}
          style={{ animationDelay: '0.2s' }}
        >
          Files are stored securely on Firebase Storage · No size limit
        </p>
      </div>
    </div>
  );
}
