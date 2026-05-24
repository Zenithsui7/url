import { useToast } from '../context/ToastContext';

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
    </svg>
  ),
};

const colors = {
  success: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  error:   'from-red-500/20 to-rose-500/10 border-red-500/30 text-red-300',
  info:    'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
};

const iconColors = {
  success: 'text-emerald-400',
  error:   'text-red-400',
  info:    'text-blue-400',
};

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
      style={{ maxWidth: '360px' }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl
            glass-sm bg-gradient-to-r ${colors[toast.type]}
            ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
          `}
          style={{ minWidth: '220px' }}
        >
          <span className={iconColors[toast.type]}>{icons[toast.type]}</span>
          <span className="text-sm font-medium text-white/90 flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
