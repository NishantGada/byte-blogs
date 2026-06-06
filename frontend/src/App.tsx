import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from "react";
import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AdminDashboardPage from "./pages/AdminPage/AdminPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import BlogListPage from './pages/BlogListPage/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage/BlogDetailPage';
import Navbar from './components/Navbar';
import About from './pages/About/About';
import theme from './theme/theme';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // ProtectedRoute wrapper for admin pages
  const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Routes>
        {/* Public home and blog routes */}
        <Route path="/" element={<BlogListPage />} />
        <Route path="/blogs" element={<Navigate to="/" replace />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/about" element={<About />} />

        {/* Auth (only the admin needs this) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes - gated */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Anything else falls back to the public home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
