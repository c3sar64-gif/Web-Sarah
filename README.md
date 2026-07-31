# Pagina Web para Sarah

E-commerce con frontend en React y backend en ASP.NET Core, siguiendo la arquitectura definida: SPA + API REST + PostgreSQL (Supabase).

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Router + Axios
- **Backend**: ASP.NET Core Web API (.NET 8) + Entity Framework Core + Npgsql
- **Base de datos**: PostgreSQL en Supabase
- **Storage**: Supabase Storage (S3-compatible), bucket `media`

## Estructura

```
frontend/         SPA en React (carrito, catálogo, navegación)
backend-dotnet/   API REST en ASP.NET Core (categorías, productos) — backend activo
backend/          Backend anterior en Django — reemplazado, pendiente de borrar manualmente
```

> `backend/` (Django) quedó obsoleto tras el cambio a .NET. El entorno donde se generó el proyecto no pudo borrar la carpeta automáticamente — bórrala tú desde el explorador de archivos cuando quieras, y si prefieres, renombra `backend-dotnet` a `backend`.

## Backend — primeros pasos

Ver `backend-dotnet/README.md` para el detalle completo. Resumen:

```powershell
cd backend-dotnet
dotnet restore
dotnet ef database update
dotnet run
```

La API queda en `http://localhost:8002/api/` (Swagger en `/swagger`).

Endpoints disponibles: `/api/productos`, `/api/categorias`.

La cadena de conexión a Supabase ya está configurada en `backend-dotnet/appsettings.Development.json` (no se sube a git).

## Frontend — primeros pasos

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5175` (ajustado porque 5173/5174 estaban ocupados). La variable `VITE_API_URL` en `frontend/.env` apunta a `http://localhost:8002/api`.

## Carga de productos

El backend .NET no trae panel de administración incluido (a diferencia de Django). Por ahora, productos y categorías se cargan vía la API (Swagger en `/swagger`) o directo en la base de Supabase.

## Pendiente

- **Frontend desalineado con el nuevo backend**: `frontend/src/types/product.ts`, `src/api/products.ts` y `ProductCard.tsx` esperan campos en inglés (`name`, `imageUrl`, `stock`, `category.name`) pero la API .NET devuelve español (`Nombre`, `ImagenUrl`, `Disponible`, `Categoria.Nombre`) y ya no expone `/api/orders/`. Falta actualizar el frontend para consumir el nuevo contrato.
- Reemplazar el contenido de `frontend/src/pages/Home.tsx` por el diseño definitivo (logo y paleta ya están en la carpeta del proyecto).
- Autenticación para checkout y gestión de órdenes (el backend Django tenía esto vía `orders`/`accounts`; el backend .NET todavía no).
- Integración de pagos (Fase 2, según lo conversado).
- Borrar manualmente `backend/` (Django, ya no se usa) y los artefactos de compilación `backend-dotnet/bin` y `backend-dotnet/obj`.
