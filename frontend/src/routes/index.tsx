import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Especialidades from '../pages/Especialidades'
import SobreMi from '../pages/SobreMi'
import Contacto from '../pages/Contacto'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/especialidades" element={<Especialidades />} />
      <Route path="/sobre-mi" element={<SobreMi />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
