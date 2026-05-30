# DSY2206 – Actividad Formativa 2 – Semana 2
## Tienda Don Pepe — Sistema Full Stack con IDaaS y API Manager

**Asignatura:** Desarrollo Cloud Native I (DSY2206)  
**Experiencia:** 1 — Semana 2  
**Integrantes:** Grupo 2  
**Tenant Azure B2C:** `CloudeGrupo2.onmicrosoft.com`

---

## Descripción

Aplicación web de tienda de productos comestibles construida como sistema Full Stack, que implementa autenticación y autorización mediante **Azure AD B2C (IDaaS)** en el frontend Angular, y protección de APIs mediante **JWT + Spring Security** en el backend.

---

## Estructura del proyecto

```
C:\cloud\
├── README.md
├── frontend\                               → Angular 17 + MSAL (Azure AD B2C)
│   └── src\
│       ├── app\
│       │   ├── app.component.ts            → Inicializa MSAL y maneja redirect de B2C
│       │   ├── app.config.ts               → Configuración MSAL (PublicClientApplication)
│       │   ├── app.routes.ts               → Rutas: /catalogo, /producto/:id, /carrito, /perfil
│       │   ├── components\
│       │   │   ├── navbar\                 → Barra de navegación con badge de carrito
│       │   │   ├── catalogo\               → Grid de productos con búsqueda y filtros
│       │   │   ├── producto-detalle\       → Vista detallada de un producto
│       │   │   ├── carrito\                → Carrito editable y generación de boleta
│       │   │   └── perfil\                 → Perfil editable del usuario autenticado
│       │   ├── models\
│       │   │   └── tienda.models.ts        → Interfaces TypeScript (Producto, Boleta, etc.)
│       │   └── services\
│       │       └── tienda.service.ts       → Servicio central: llamadas a la API y carrito reactivo
│       └── environments\
│           └── environment.ts              → Configuración Azure B2C (clientId, authority, scopes)
└── backend\                                → Spring Boot 3 + Spring Security + JWT
    └── src\main\java\com\tienda\bff\
        ├── BffApplication.java             → Punto de entrada de la aplicación
        ├── config\
        │   └── SecurityConfig.java         → Seguridad: validación JWT, CORS
        ├── controller\
        │   ├── ProductoController.java     → GET /api/productos
        │   └── BoletaController.java       → POST /api/boleta/generar
        └── model\
            ├── Producto.java
            ├── ItemBoleta.java
            ├── BoletaRequest.java
            └── Boleta.java
```

---

## Configuración Azure AD B2C

| Parámetro             | Valor                                                                                |
|-----------------------|--------------------------------------------------------------------------------------|
| Tenant                | `CloudeGrupo2.onmicrosoft.com`                                                       |
| Dominio B2C           | `CloudeGrupo2.b2clogin.com`                                                          |
| Aplicación registrada | `tienda-frontend` (tipo SPA)                                                         |
| Client ID             | `498e47b6-e1a3-4881-ad4f-f2859feb9004`                                               |
| Flujo de usuario      | `B2C_1_grupo2`                                                                       |
| Redirect URI          | `http://localhost:4200`                                                              |
| Scope API expuesto    | `https://CloudeGrupo2.onmicrosoft.com/498e47b6-e1a3-4881-ad4f-f2859feb9004/api.read` |
| JWK Set URI           | `https://CloudeGrupo2.b2clogin.com/CloudeGrupo2.onmicrosoft.com/B2C_1_grupo2/discovery/v2.0/keys` |

---

## Requisitos previos

- **Java 17+** y **Maven 3.8+**
- **Node.js 18+** y **Angular CLI 17+**
- Cuenta activa en Azure AD B2C (tenant `CloudeGrupo2`)

---

## Ejecución

### 1. Backend (Spring Boot)

```bash
cd C:\cloud\backend
mvn spring-boot:run
```

El backend queda disponible en `http://localhost:8080`

**Endpoints protegidos** (requieren header `Authorization: Bearer <token>`):

| Método | Endpoint              | Descripción                           |
|--------|-----------------------|---------------------------------------|
| GET    | `/api/productos`      | Retorna los 10 productos de la tienda |
| POST   | `/api/boleta/generar` | Genera boleta con subtotal e IVA 19%  |

Si se llama a estos endpoints sin token, el backend responde `401 Unauthorized`.

### 2. Frontend (Angular)

```bash
cd C:\cloud\frontend
npm install
ng serve
```

La app queda disponible en `http://localhost:4200`

Al abrir, si no hay sesión activa, MSAL redirige automáticamente al login de Azure B2C. Tras autenticarse, el JWT queda guardado en `localStorage` y se adjunta automáticamente en cada petición al backend.

---

## Flujo de seguridad implementado

```
Usuario abre localhost:4200
        │
        ▼
  ¿Hay sesión activa en localStorage?
        │
    NO  │  SÍ
        ▼    └──────────────────────────┐
Azure AD B2C (flujo B2C_1_grupo2)      │
  → Pantalla de login/registro          │
  → Usuario se autentica con email      │
  → B2C emite un token JWT              │
        │                               │
        ▼                               │
  Angular almacena el JWT ←─────────────┘
        │
        ▼
  Angular adjunta el JWT en cada petición:
  Authorization: Bearer <token>
        │
        ▼
  Backend Spring Boot (localhost:8080)
    SecurityConfig verifica la firma del JWT
    usando las claves públicas de Azure B2C
        │
    Token válido   → responde con los datos
    Token inválido → 401 Unauthorized
```

---

## Funcionalidades de la aplicación

| Vista     | Ruta            | Descripción                                                                                                     |
|-----------|-----------------|-----------------------------------------------------------------------------------------------------------------|
| Catálogo  | `/catalogo`     | Muestra todos los productos con búsqueda por texto y filtro por categoría. Permite agregar y quitar productos del carrito directamente desde la grilla. |
| Detalle   | `/producto/:id` | Vista completa del producto con descripción, stock disponible y precio. Control de cantidad con botones +/−.    |
| Carrito   | `/carrito`      | Lista editable de los productos seleccionados. Muestra precio unitario, cantidad y total por ítem. Calcula subtotal, IVA (19%) y total final. Genera la boleta de venta. |
| Perfil    | `/perfil`       | Muestra el nombre y email del usuario autenticado, extraídos desde el token de Azure B2C. Permite editar teléfono y dirección de despacho. |

---

## Criterios de evaluación (pauta DSY2206 Semana 2)

| Criterio                                | Estado | Implementación                                                                                      |
|-----------------------------------------|--------|------------------------------------------------------------------------------------------------------|
| Autenticación con IDaaS                 | ✅     | MSAL conectado a Azure AD B2C. Al abrir la app sin sesión, redirige al flujo `B2C_1_grupo2`. El JWT emitido se usa para todas las peticiones al backend. |
| Generación de boletas y resultado final | ✅     | El endpoint `POST /api/boleta/generar` recibe el carrito, calcula subtotal, IVA 19% y total, y retorna una boleta con número único y fecha. |
| Backend protegido con JWT               | ✅     | `SecurityConfig.java` configura Spring Security como servidor de recursos OAuth2. Valida la firma de cada JWT con las claves públicas de Azure B2C. Sin token válido, responde 401. |
| Selección de productos en frontend      | ✅     | Catálogo con búsqueda y filtros, vista detallada por producto, carrito reactivo con signals de Angular 17. |
| Repositorio Git colaborativo            | ✅     | https://github.com/cricamps/tienda_cloud                    |

---


## Tecnologías utilizadas

| Capa      | Tecnología                           | Versión |
|-----------|--------------------------------------|---------|
| Frontend  | Angular                              | 17      |
| Auth      | MSAL Angular (`@azure/msal-angular`) | 3.x     |
| IDaaS     | Azure Active Directory B2C           | —       |
| Backend   | Spring Boot                          | 3.2     |
| Seguridad | Spring Security OAuth2               | 3.2     |
| Build     | Maven                                | 3.8+    |
| Runtime   | Java                                 | 17      |

