import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LandingPagesPage from './pages/LandingPagesPage';
import LandingPageFormPage from './pages/LandingPageFormPage';
import PreviewPage from './pages/PreviewPage';
import LeadsPage from './pages/LeadsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/landing-pages" replace />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing-pages"
            element={
              <ProtectedRoute>
                <Layout>
                  <LandingPagesPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing-pages/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <LandingPageFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing-pages/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <LandingPageFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/landing-pages/:id/preview"
            element={
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <LeadsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 catch-all */}
          <Route path="*" element={<Navigate to="/landing-pages" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
