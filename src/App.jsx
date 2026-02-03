import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Boleta from './pages/Boleta'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminCustomers from './pages/AdminCustomers'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas de Cliente (con Header normal) */}
            <Route path="/" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Home />
              </div>
            } />
            <Route path="/productos" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Products />
              </div>
            } />
            <Route path="/login" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Login />
              </div>
            } />
            <Route path="/registro" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Register />
              </div>
            } />
            <Route path="/carrito" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Cart />
              </div>
            } />
            <Route path="/checkout" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Checkout />
              </div>
            } />
            <Route path="/boleta/:orderId" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Boleta />
              </div>
            } />

            {/* Rutas de Admin (SIN Header normal, con AdminLayout) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<AdminProducts />} />
            <Route path="/admin/ordenes" element={<AdminOrders />} />
            <Route path="/admin/clientes" element={<AdminCustomers />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

