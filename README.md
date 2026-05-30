# DSY2206 – Actividad Formativa 2 – Semana 2
## Tienda Don Pepe — Sistema Full Stack con IDaaS y API Manager

**Asignatura:** Desarrollo Cloud Native I (DSY2206)  
**Experiencia:** 1 — Semana 2  
**Integrantes:** Grupo 2  
**Tenant Azure B2C:** `CloudeGrupo2.onmicrosoft.com`

---

## Descripción

Aplicación web de tienda de productos comestibles construida como sistema Full Stack, que implementa autenticación y autorización mediante **Azure AD B2C (IDaaS)** en el frontend Angular y protección de APIs mediante **JWT + Spring Security** en el backend.

---

## Estructura del proyecto

```
C:\cloud\
├── README.md
├── frontend\                          → Angular 17 + MSAL (Azure AD B2C)
│   └── src\
│       ├── app\
│       │   ├── app.component.ts       → Inicializa MSAL y maneja redirect B2C
│       │   ├── app.config.ts          → Configuración MSAL (PublicClientApplication)
│       │   ├── app.routes.ts          → Rutas: /catalogo, /producto/:id, /carrito, /perfil
│       │   ├── components\
│       │   │   ├── navbar\            → Barra de navegación con badge de carrito
│       │   │   ├── catalogo\          → Grid de productos con búsqueda y filtros
│       │   │   ├── producto-detalle\  → Vista detallada de un producto
│       │   │   ├── carrito\           → Carrito editable + generación de boleta
│       │   │   └── perfil\            → Perfil editable del usuario
│       │   ├── models\
│       │   │   └── tienda.models.ts   → Interfaces TypeScript (Producto, Boleta, etc.)
│       │   └── services\
│       │       └── tienda.service.ts  → Servicio central: API calls + carrito reactivo
│       └── environments\
│           └── environment.ts         → Configuración Azure B2C (clientId, authority, scopes)
└── backend\                           → Spring Boot 3 + Spring Security + JWT
    └── src\main\java\com\tienda\bff\
        ├── BffApplication.java        → Entry point Spring Boot
        ├── config\
        │   └── SecurityConfig.java    → OAuth2 Resource Server, CORS, validación JWT
        ├── controller\
        │   ├── ProductoController.java → GET /api/productos (protegido con JWT)
        │   └── BoletaController.java   → POST /api/boleta/generar (protegido con JWT)
        └── model\
            ├── Producto.java
            ├── ItemBoleta.java
            ├── BoletaRequest.java
            └── Boleta.java
```

---

## Configuración Azure AD B2C

| Parámetro              | Valor                                                                          |
|------------------------|--------------------------------------------------------------------------------|
| Tenant                 | `CloudeGrupo2.onmicrosoft.com`                                                |
| Dominio B2C            | `CloudeGrupo2.b2clogin.com`                                                   |
| Aplicación registrada  | `tienda-frontend` (tipo SPA)                                                  |
| Client ID              | `498e47b6-e1a3-4881-ad4f-f2859feb9004`                                        |
| Flujo de usuario       | `B2C_1_grupo2` (Registrarse e iniciar sesión)                                 |
| Redirect URI           | `http://localhost:4200`                                                        |
| Scope API expuesto     | `https://CloudeGrupo2.onmicrosoft.com/498e47b6-e1a3-4881-ad4f-f2859feb9004/api.read` |
| JWK Set URI (backend)  | `https://CloudeGrupo2.b2clogin.com/CloudeGrupo2.onmicrosoft.com/B2C_1_grupo2/discovery/v2.0/keys` |

---

## Requisitos previos

- **Java 17+** y **Maven 3.8+**
- **Node.js 18+** y **Angular CLI 17+**
- Cuenta activa en Azure AD B2C (tenant `CloudeGrupo2`)

---

## Ejecución

### Backend (Spring Boot)

```bash
cd C:\cloud\backend
mvn spring-boot:run
```

El BFF queda disponible en `http://localhost:8080`

**Endpoints protegidos** (requieren header `Authorization: Bearer <jwt>`):

| Método | Endpoint               | Descripción                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/productos`       | Lista los 10 productos de la tienda  |
| POST   | `/api/boleta/generar`  | Genera boleta con subtotal e IVA 19% |

### Frontend (Angular)

```bash
cd C:\cloud\frontend
npm install
ng serve
```

La app queda disponible en `http://localhost:4200`

Al abrir, si no hay sesión activa, MSAL redirige automáticamente al login de Azure B2C (`cloudegrupo2.b2clogin.com`). Tras autenticarse, el JWT queda guardado en `localStorage` y se adjunta en cada petición al BFF.

---

## Flujo de seguridad implementado

```
Usuario abre localhost:4200
        │
        ▼
  ¿Hay sesión en localStorage?
        │
    NO  │  SÍ
        ▼    └─────────────────────────┐
Azure AD B2C (B2C_1_grupo2)           │
  → Pantalla de login/registro         │
  → Usuario se autentica               │
  → B2C emite JWT (idToken)            │
        │                              │
        ▼                              │
  Angular almacena JWT ←───────────────┘
        │
        ▼
  Angular adjunta JWT en cada request:
  Authorization: Bearer <jwt>
        │
        ▼
  Spring Boot BFF (localhost:8080)
    SecurityConfig verifica la firma del JWT
    usando el JWK Set de Azure B2C
        │
    JWT válido → responde con datos
    JWT inválido → 401 Unauthorized
```

---

## Funcionalidades de la aplicación

| Vista          | Ruta             | Descripción                                              |
|----------------|------------------|----------------------------------------------------------|
| Catálogo       | `/catalogo`      | Grid de productos con búsqueda por texto y filtro por categoría. Botones +/− para agregar directamente al carrito. |
| Detalle        | `/producto/:id`  | Vista completa del producto: descripción, stock disponible, precio con IVA. Control de cantidad y acceso al carrito. |
| Carrito        | `/carrito`       | Lista editable de productos seleccionados. Muestra cantidad, precio unitario y total por ítem. Resumen con subtotal, IVA (19%) y total. Genera boleta de venta. |
| Perfil         | `/perfil`        | Muestra nombre y email del usuario autenticado (extraídos del JWT de B2C). Permite editar teléfono y dirección de despacho. |

---

## Criterios de evaluación (pauta DSY2206 S2)

| Criterio                                    | Estado | Implementación                                                      |
|---------------------------------------------|--------|---------------------------------------------------------------------|
| Autenticación con IDaaS                     | ✅     | MSAL con Azure AD B2C. Login redirect a `B2C_1_grupo2`. JWT guardado en localStorage. |
| Generación de boletas y resultado final     | ✅     | POST `/api/boleta/generar` retorna boleta con numeración única, detalle de ítems, subtotal, IVA 19% y total. |
| Backend protegido con API Manager y JWT     | ✅     | `SecurityConfig` con `oauth2ResourceServer` valida firma JWT con JWK Set de Azure B2C. Todo endpoint requiere Bearer token válido. |
| Selección de productos en frontend          | ✅     | Catálogo con búsqueda, filtro por categoría, control de cantidad +/−, vista detallada y carrito reactivo con signals. |
| Repositorio Git colaborativo                | ✅     | Ver sección Git abajo. Ambos integrantes deben tener commits visibles. |

---

## Repositorio Git

```bash
cd C:\cloud
git init
git add .
git commit -m "feat: tienda fullstack DSY2206 - Azure B2C + Spring Boot BFF + Angular"
git remote add origin https://github.com/TU_USUARIO/tienda-cloud-dsy2206.git
git branch -M main
git push -u origin main
```

El segundo integrante debe clonar el repositorio, realizar al menos un commit propio y hacer push para que ambos aparezcan en el historial.

---

## Tecnologías utilizadas

| Capa       | Tecnología                          | Versión  |
|------------|-------------------------------------|----------|
| Frontend   | Angular                             | 17       |
| Auth       | MSAL Angular (`@azure/msal-angular`)| 3.x      |
| IDaaS      | Azure Active Directory B2C          | —        |
| Backend    | Spring Boot                         | 3.2      |
| Seguridad  | Spring Security OAuth2 Resource Server | 3.2   |
| Build      | Maven                               | 3.8+     |
| Runtime    | Java                                | 17       |

---

## Guión grabación Teams (5–10 min)

| Tiempo | Acción |
|--------|--------|
| 0:00   | Abrir `localhost:4200` — mostrar redirección automática a `cloudegrupo2.b2clogin.com` |
| 1:00   | Iniciar sesión con cuenta del IDaaS — mostrar nombre del usuario en la navbar |
| 2:00   | Navegar por el catálogo, usar filtros por categoría y búsqueda |
| 3:00   | Abrir detalle de un producto, agregar al carrito |
| 4:00   | Ir al carrito — modificar cantidades, ver totales actualizarse |
| 5:00   | Generar boleta — mostrar número, detalle, IVA y total |
| 6:00   | Abrir Postman: `GET /api/productos` sin token → `401 Unauthorized` |
| 7:00   | Mismo request con `Authorization: Bearer <jwt>` → `200 OK` con productos |
| 8:00   | Mostrar `SecurityConfig.java` explicando validación JWT con JWK Set de B2C |
| 9:00   | Mostrar GitHub con commits de ambos integrantes |
