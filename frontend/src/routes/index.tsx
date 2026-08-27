import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Especialidades from '../pages/Especialidades'
import Recetas from '../pages/Recetas'
import RecetaDetalle from '../pages/RecetaDetalle'
import SobreMi from '../pages/SobreMi'
import Contacto from '../pages/Contacto'
import Checkout from '../pages/Checkout'
import NotFound from '../pages/NotFound'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminProductos from '../pages/admin/AdminProductos'
import AdminProductoForm from '../pages/admin/AdminProductoForm'
import AdminOrdenes from '../pages/admin/AdminOrdenes'
import AdminRecetas from '../pages/admin/AdminRecetas'
import AdminRecetaForm from '../pages/admin/AdminRecetaForm'
import ProtectedRoute from '../components/admin/ProtectedRoute'
import AdminLayout from '../components/admin/AdminLayout'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/especialidades" element={<Especialidades />} />
      <Route path="/recetas" element={<Recetas />} />
      <Route path="/recetas/:id" element={<RecetaDetalle />} />
      <Route path="/sobre-mi" element={<SobreMi />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/ordenes" element={<AdminOrdenes />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
          <Route path="/admin/productos/:id/editar" element={<AdminProductoForm />} />
          <Route path="/admin/recetas" element={<AdminRecetas />} />
          <Route path="/admin/recetas/nuevo" element={<AdminRecetaForm />} />
          <Route path="/admin/recetas/:id/editar" element={<AdminRecetaForm />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
