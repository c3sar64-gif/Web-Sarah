# Pagina Web para Sarah

E-commerce con frontend en React y backend en Django, siguiendo la arquitectura definida: SPA + API REST + PostgreSQL.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Router + Axios
- **Backend**: Django 5 + Django REST Framework + django-cors-headers
- **Base de datos**: PostgreSQL (o SQLite en desarrollo si no hay Postgres configurado)

## Estructura

```
frontend/    SPA en React (carrito, catálogo, navegación)
backend/     API REST en Django (productos, órdenes, panel admin)
```

## Backend — primeros pasos

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # completar si vas a usar PostgreSQL/Supabase
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

La API queda en `http://localhost:8000/api/` y el panel admin en `http://localhost:8000/admin/`.

Endpoints disponibles: `/api/products/`, `/api/categories/`, `/api/orders/`.

### Conectar a PostgreSQL / Supabase

En `backend/.env`, completar `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`. Si estos quedan vacíos, el proyecto usa SQLite automáticamente (útil para probar rápido sin instalar Postgres local).

## Frontend — primeros pasos

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`. La variable `VITE_API_URL` en `frontend/.env` apunta al backend (por defecto `http://localhost:8000/api`).

## Carga de productos

Los productos, categorías e imágenes se administran desde el panel de Django (`/admin/`) — no hace falta programar un panel aparte.

## Pendiente

- Reemplazar el contenido de `frontend/src/pages/Home.tsx` por el diseño definitivo (logo y paleta ya están en la carpeta del proyecto).
- Autenticación de usuarios para checkout (la app `accounts` está creada como punto de partida).
- Integración de pagos (Fase 2, según lo conversado).
