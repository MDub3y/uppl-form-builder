import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { store } from './store';
import BackgroundGradient from './components/Layout/BackgroundGradient';
import Index from './pages/Index';
import CreatePage from './pages/CreatePage';
import PreviewPage from './pages/PreviewPage';
import MyFormsPage from './pages/MyFormsPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Create MUI theme that works with our design system
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(261, 60%, 35%)',
      light: 'hsl(261, 60%, 45%)',
      dark: 'hsl(261, 60%, 25%)',
    },
    secondary: {
      main: 'hsl(22, 100%, 56%)',
    },
    background: {
      default: 'transparent',
      paper: 'hsl(0, 0%, 100%)',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px -2px hsl(261, 60%, 35%, 0.1)',
        },
      },
    },
  },
});

// Separate component for router content to ensure clean context
const AppContent: React.FC = () => {
  const Navigation = React.lazy(() => import('./components/Layout/Navigation'));
  
  return (
    <div className="min-h-screen relative">
      <BackgroundGradient />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Navigation />
      </React.Suspense>
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/my-forms" element={<MyFormsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('upliance-theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <BrowserRouter>
            <AppContent />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;