import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
