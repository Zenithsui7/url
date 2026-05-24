import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import NavBar from './components/NavBar';
import ToastContainer from './components/Toast';
import Home from './pages/Home';
import FilePage from './pages/FilePage';
import Gallery from './pages/Gallery';

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/file/:id" element={<FilePage />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

function NotFound() {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#020510] text-white' : 'bg-[#eef2ff] text-slate-900'}`}>
      <div className="text-6xl mb-4">🌫️</div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <a href="/" className="mt-4 px-6 py-2.5 btn-gradient text-white rounded-xl font-medium text-sm">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
