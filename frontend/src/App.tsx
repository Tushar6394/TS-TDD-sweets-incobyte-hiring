import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Shop } from './pages/Shop';
import { CategoryShop } from './pages/CategoryShop';
import { SweetDetail } from './pages/SweetDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AddSweet } from './pages/AddSweet';
import { ManageCategories } from './pages/ManageCategories';
import { TotalSweets } from './pages/TotalSweets';
import { ManageInventory } from './pages/ManageInventory';
import { Cart } from './pages/Cart';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<CategoryShop />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/shop/add-sweet"
                element={
                  <ProtectedRoute requireAdmin>
                    <AddSweet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/categories"
                element={
                  <ProtectedRoute requireAdmin>
                    <ManageCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/total-sweets"
                element={
                  <ProtectedRoute requireAdmin>
                    <TotalSweets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/manage-inventory"
                element={
                  <ProtectedRoute requireAdmin>
                    <ManageInventory />
                  </ProtectedRoute>
                }
              />
              <Route path="/sweets/:id" element={<SweetDetail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
