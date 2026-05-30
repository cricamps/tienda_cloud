# DSY2206 – Actividad Formativa 2 – Semana 2
## Tienda Don Pepe – Full Stack con IDaaS + API Manager
### Tenant: CloudeGrupo2.onmicrosoft.com

---

## Estructura del proyecto

```
C:\cloud\
├── README.md
├── frontend\          → Angular 17 + MSAL (Azure AD B2C)
└── bff\               → Spring Boot 3 + Spring Security + JWT
```

---

## ⚙️ PASO 1: Completar credenciales (2 archivos)

### 📄 `frontend\src\environments\environment.ts`

```
clientId: 'PEGAR_CLIENT_ID_AQUI'
```
→ Portal Azure → Azure AD B2C → **Registros de aplicaciones**
  → tu app → **Id. de aplicación (cliente)**

```
authority: '...B2C_1_signupsignin'
apiScopes: ['...bff-api/api.read']
```
→ Reemplaza `B2C_1_signupsignin` con el nombre de tu flujo de usuario
→ Reemplaza el scope con el que configuraste al exponer la API

---

### 📄 `bff\src\main\resources\application.properties`

```
...B2C_1_signupsignin/v2.0/
```
→ Mismo nombre de flujo de usuario (debe coincidir exactamente)

---

## 🚀 PASO 2: Ejecutar el Backend

Requisitos: **Java 17+**, **Maven**

```bash
cd C:\cloud\bff
mvn spring-boot:run
```

✅ BFF corriendo en: `http://localhost:8080`

Endpoints (requieren JWT en header `Authorization: Bearer <token>`):
- `GET  /api/productos`      → lista de 10 productos
- `POST /api/boleta/generar` → genera boleta con IVA 19%

---

## 🚀 PASO 3: Ejecutar el Frontend

Requisitos: **Node.js 18+**, **Angular CLI**

```bash
cd C:\cloud\frontend
npm install
ng serve
```

✅ App en: `http://localhost:4200`

Al abrir, el **MsalGuard** redirige automáticamente a Azure B2C para login.
Tras autenticarse, el **MsalInterceptor** adjunta el JWT en cada request al BFF.

---

## 🔐 Flujo de seguridad implementado

```
[Usuario] → [Angular :4200]
               ↓ (no logueado)
          [Azure AD B2C] ← IDaaS: gestiona login/registro
               ↓ (JWT)
          [Angular] adjunta JWT en Authorization header
               ↓
          [Azure API Manager] ← Nivel 1: valida suscripción/key
               ↓
          [Spring Boot BFF :8080] ← Nivel 2: valida JWT con B2C JWK
               ↓
          [Respuesta JSON al frontend]
```

---

## 🧾 Criterios de evaluación cubiertos

| Criterio pauta | Implementación |
|---|---|
| ✅ Autenticación con IDaaS | MsalGuard protege rutas; MsalInterceptor adjunta JWT |
| ✅ Selección de productos | Grid con +/− por producto, carrito lateral en tiempo real |
| ✅ Generación de boleta | POST al BFF → boleta con detalle, subtotal, IVA 19%, total |
| ✅ Backend protegido API Manager + JWT | SecurityConfig: oauth2ResourceServer + jwk-set-uri de B2C |
| ✅ Repositorio Git colaborativo | Ver PASO 4 |

---

## 📁 PASO 4: Git – Repositorio colaborativo

```bash
cd C:\cloud
git init
git add .
git commit -m "feat: tienda fullstack con Azure B2C IDaaS y Spring Boot BFF"

# Conectar con repositorio remoto (ambos integrantes deben tener commits)
git remote add origin https://github.com/TU_USUARIO/tienda-cloud-dsy2206.git
git push -u origin main
```

---

## 🎥 Guión para grabación Teams (5-10 min)

| Tiempo | Qué mostrar |
|---|---|
| 0:00 | App en localhost:4200 → redirige a Azure B2C (mostrar URL b2clogin.com) |
| 1:00 | Login con usuario del IDaaS → nombre aparece en navbar |
| 2:00 | Seleccionar productos con +/−, ver carrito actualizarse |
| 4:00 | Clic "Generar Boleta" → boleta con IVA y total |
| 5:30 | Postman: GET /api/productos SIN token → 401 Unauthorized |
| 6:30 | Postman: mismo request CON token → 200 OK con lista de productos |
| 7:30 | Mostrar application.properties explicando jwk-set-uri |
| 8:30 | Mostrar GitHub con commits de ambos integrantes |

---

## 🔑 Datos del tenant (ya integrados en el código)

| Campo | Valor |
|---|---|
| Tenant | `CloudeGrupo2.onmicrosoft.com` |
| Dominio B2C | `CloudeGrupo2.b2clogin.com` |
| Client ID | ⚠️ Pendiente (ver PASO 1) |
| Flujo de usuario | ⚠️ Pendiente (ver PASO 1) |
