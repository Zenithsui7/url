import { useState, useRef, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { storage, db, isFirebaseConfigured } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const UPLOAD_TIMEOUT_MS = 30_000; // 30 s — if no progress, declare stuck

const ACCEPTED_TYPES = [
  'image/jpeg','image/png','image/gif','image/webp',
  'video/mp4','video/quicktime','video/mov','video/webm',
  'audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/flac',
  'application/pdf',
  'application/zip','application/x-rar-compressed',
];

const FILE_CHIPS = [
  { icon: '🖼️', label: 'JPG/PNG' },
  { icon: '🎬', label: 'MP4/MOV' },
  { icon: '🎵', label: 'MP3/WAV' },
  { icon: '📄', label: 'PDF' },
  { icon: '🗜️', label: 'ZIP' },
  { icon: '📁', label: 'Any' },
];

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export default function DropZone() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [state, setState] = useState('idle'); // idle | dragging | uploading | done | error
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = useCallback((file) => {
    if (!file) return;
    setSelectedFile(file);
    setErrorMsg('');

    // Generate local preview
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    } else {
      setPreviewUrl(null);
    }
    setState('ready');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setState('idle');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setState('dragging');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setState(prev => prev === 'dragging' ? (selectedFile ? 'ready' : 'idle') : prev);
  }, [selectedFile]);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    // 1. Guard: Firebase not configured yet
    if (!isFirebaseConfigured) {
      setErrorMsg(
        'Firebase is not configured. Open src/firebase.js and replace the placeholder values with your real project credentials.'
      );
      setState('error');
      addToast('Firebase not configured — see src/firebase.js', 'error');
      return;
    }

    setState('uploading');
    setProgress(0);

    // 2. Stuck-upload watchdog — if no progress fires within 30s, the upload is hanging
    let lastProgressTime = Date.now();
    let uploadTask;
    const watchdog = setInterval(() => {
      if (Date.now() - lastProgressTime > 30000) {
        clearInterval(watchdog);
        try { uploadTask?.cancel(); } catch (_) {}
        setErrorMsg(
          'Upload timed out at 0%. Possible causes: Storage bucket not enabled, CORS not configured, wrong storageBucket in firebase.js, or Storage rules blocking writes.'
        );
        setState('error');
        addToast('Upload timed out — check Firebase config', 'error');
      }
    }, 3000);

    try {
      const timestamp = Date.now();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/${timestamp}_${safeName}`;
      const storageRef = ref(storage, storagePath);
      uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          lastProgressTime = Date.now();
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          clearInterval(watchdog);
          console.error('Firebase Storage error:', err);
          const msg = {
            'storage/unauthorized': 'Permission denied. Update your Firebase Storage rules to allow writes.',
            'storage/canceled': 'Upload was cancelled.',
            'storage/unknown': 'Unknown error. Check your Firebase config and Storage bucket name.',
            'storage/retry-limit-exceeded': 'Upload failed after retries. Check your network connection.',
          }[err.code] ?? `Upload failed: ${err.message}`;
          setErrorMsg(msg);
          setState('error');
          addToast('Upload failed', 'error');
        },
        async () => {
          clearInterval(watchdog);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const docRef = await addDoc(collection(db, 'files'), {
              fileName:    selectedFile.name,
              fileType:    selectedFile.type,
              fileSize:    selectedFile.size,
              storagePath,
              downloadURL,
              uploadedAt:  serverTimestamp(),
            });

            const meta = {
              id:          docRef.id,
              fileName:    selectedFile.name,
              fileType:    selectedFile.type,
              fileSize:    selectedFile.size,
              downloadURL,
              uploadedAt:  new Date().toISOString(),
            };
            const prev = JSON.parse(localStorage.getItem('tun-sahur-history') || '[]');
            localStorage.setItem('tun-sahur-history', JSON.stringify([meta, ...prev].slice(0, 100)));

            setState('done');
            addToast('Upload complete! 🎉', 'success');
            setTimeout(() => navigate(`/file/${docRef.id}`), 700);
          } catch (e) {
            console.error('Firestore error:', e);
            setErrorMsg(
              e.code === 'permission-denied'
                ? 'Firestore permission denied. Update your Firestore rules to allow writes.'
                : `Failed to save metadata: ${e.message}`
            );
            setState('error');
            addToast('Metadata save failed', 'error');
          }
        }
      );
    } catch (e) {
      clearInterval(watchdog);
      console.error('Upload setup error:', e);
      setErrorMsg(`Upload failed: ${e.message}`);
      setState('error');
      addToast('Upload failed', 'error');
    }
  };

  const reset = () => {
    setState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setProgress(0);
    setErrorMsg('');
  };

  const textMuted = isDark ? 'text-white/50' : 'text-slate-400';
  const textMain  = isDark ? 'text-white' : 'text-slate-900';

  // ─── STATES ───
  const isIdle     = state === 'idle';
  const isDragging = state === 'dragging';
  const isReady    = state === 'ready';
  const isUploading= state === 'uploading';
  const isDone     = state === 'done';
  const isError    = state === 'error';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && !isDone && inputRef.current?.click()}
        className={`
          glass shine-card rounded-3xl p-8 flex flex-col items-center justify-center gap-5
          transition-all duration-300 cursor-pointer select-none
          ${isDragging ? 'dropzone-drag' : 'dropzone-idle'}
          ${(isUploading || isDone) ? 'cursor-default' : ''}
        `}
        style={{ minHeight: '280px' }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
        />

        {/* Idle state */}
        {(isIdle || isDragging) && (
          <div className="flex flex-col items-center gap-4 page-enter">
            <div
              className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center"
              style={{ boxShadow: '0 8px 24px rgba(139,92,246,0.5)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className={`text-lg font-semibold ${textMain} mb-1`}>
                {isDragging ? 'Drop it like it\'s hot 🔥' : 'Drop your file here'}
              </p>
              <p className={`text-sm ${textMuted}`}>or tap to browse from your device</p>
            </div>
          </div>
        )}

        {/* Ready state — file selected */}
        {isReady && selectedFile && (
          <div className="flex flex-col items-center gap-4 w-full page-enter">
            {previewUrl && selectedFile.type.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-36 max-w-full rounded-2xl object-contain shadow-glass"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg">
                {selectedFile.type.startsWith('video/') ? '🎬' :
                 selectedFile.type.startsWith('audio/') ? '🎵' :
                 selectedFile.type === 'application/pdf' ? '📄' :
                 selectedFile.type.includes('zip') ? '🗜️' : '📁'}
              </div>
            )}
            <div className="text-center">
              <p className={`text-sm font-semibold ${textMain} max-w-xs truncate`}>{selectedFile.name}</p>
              <p className={`text-xs ${textMuted} mt-0.5`}>{formatBytes(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className={`text-xs ${textMuted} hover:text-red-400 transition-colors mt-1`}
            >
              × Remove
            </button>
          </div>
        )}

        {/* Uploading state */}
        {isUploading && (
          <div className="flex flex-col items-center gap-5 w-full page-enter">
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center animate-pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              </svg>
            </div>
            <div className="w-full max-w-xs text-center">
              <p className={`text-sm font-semibold ${textMain} mb-3`}>Uploading… {progress}%</p>
              <div className="progress-bar-track h-2">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <p className={`text-xs ${textMuted} max-w-xs truncate`}>{selectedFile?.name}</p>
          </div>
        )}

        {/* Done state */}
        {isDone && (
          <div className="flex flex-col items-center gap-3 page-enter">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl shadow-lg">
              ✓
            </div>
            <p className={`text-base font-semibold ${textMain}`}>Upload complete!</p>
            <p className={`text-sm ${textMuted}`}>Redirecting…</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center gap-4 page-enter">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-red-400 mb-1">Upload failed</p>
              <p className={`text-xs ${textMuted} max-w-xs whitespace-pre-line`}>{errorMsg}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="px-4 py-2 glass-sm rounded-xl text-xs font-medium text-red-400 border border-red-500/25 hover:border-red-400/40 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {isReady && (
        <button
          onClick={uploadFile}
          className="w-full py-3.5 rounded-2xl btn-gradient text-white font-semibold text-base tracking-wide page-enter"
        >
          Upload & Get Link ↑
        </button>
      )}

      {/* File type chips */}
      {(isIdle || isDragging) && (
        <div className="flex flex-wrap gap-2 justify-center page-enter">
          {FILE_CHIPS.map(({ icon, label }) => (
            <span
              key={label}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-sm text-xs font-medium
                ${isDark ? 'text-white/60' : 'text-slate-500'}
              `}
            >
              <span>{icon}</span> {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
