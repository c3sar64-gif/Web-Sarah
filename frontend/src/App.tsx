import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import CartDrawer from './components/CartDrawer'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
