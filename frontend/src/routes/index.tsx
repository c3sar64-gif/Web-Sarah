import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Especialidades from '../pages/Especialidades'
import SobreMi from '../pages/SobreMi'
import Contacto from '../pages/Contacto'
import NotFound from '../pages/NotFound'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminProductos from '../pages/admin/AdminProductos'
import AdminProductoForm from '../pages/admin/AdminProductoForm'
import ProtectedRoute from '../components/admin/ProtectedRoute'
import AdminLayout from '../components/admin/AdminLayout'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/especialidades" element={<Especialidades />} />
      <Route path="/sobre-mi" element={<SobreMi />} />
      <Route path="/contacto" element={<Contacto />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
          <Route path="/admin/productos/:id/editar" element={<AdminProductoForm />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
