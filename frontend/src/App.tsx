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
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        
        <Route path="/about" element={<About />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
