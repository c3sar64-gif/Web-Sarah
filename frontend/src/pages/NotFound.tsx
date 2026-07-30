import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-neutral-600">Página no encontrada.</p>
      <Link to="/" className="text-red-600 underline">
        Volver al inicio
      </Link>
    </div>
  )
}
