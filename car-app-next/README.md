# Car API Next.js Application

Aplicación Next.js que consume la API de automóviles con interfaz moderna y responsiva.

## Instalación

```bash
cd car-app-next
npm install
```

## Configuración

El archivo `.env.local` ya está configurado con las credenciales. Si necesitas cambiarlas, edítalo:

```env
NEXT_PUBLIC_API_URL=https://clgqxx5idk.g4.sqlite.cloud:443/v2/functions/getcar
NEXT_PUBLIC_BEARER_TOKEN=sQZHtQhFSbz12LU5VoVWKiHPt3f4ECue92TUWez9hMc
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo producción
```bash
npm run build
npm run start
```

## Características

✅ **Interfaz intuitiva** - Formulario simple para seleccionar estado activo
✅ **API Route** - Endpoint seguro `/api/cars` que maneja la autenticación
✅ **Responsive** - Diseño adaptable a móvil y desktop
✅ **Manejo de errores** - Mensajes claros de error
✅ **Loading states** - Indicadores de carga durante las solicitudes

## Estructura del Proyecto

```
src/
├── pages/
│   ├── api/
│   │   └── cars.ts           # API route que consume la API externa
│   ├── _app.tsx              # Aplicación principal
│   └── index.tsx             # Página de inicio
└── styles/
    ├── globals.css           # Estilos globales
    └── Home.module.css       # Estilos de la página principal
```

## Cómo funciona

1. **Frontend**: El usuario selecciona un estado (Activo/Inactivo) y hace clic en "Fetch Cars"
2. **API Route**: La solicitud se envía a `/api/cars`
3. **Backend**: El servidor Next.js llama a la API externa con el Bearer token
4. **Response**: Los datos se muestran en la interfaz en formato JSON

## Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Lenguaje tipado
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos componibles

## Variables de Entorno

- `NEXT_PUBLIC_API_URL` - URL de la API externa
- `NEXT_PUBLIC_BEARER_TOKEN` - Token de autenticación Bearer
