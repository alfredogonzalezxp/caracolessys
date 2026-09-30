# Snail Racing - Documentación del Backend

Bienvenido a la documentación oficial del servidor de **Snail Racing**. Este proyecto es una API RESTful robusta construida para manejar la lógica de usuarios, autenticación, depósitos y carreras de caracoles.

## 🛠 1. Stack Tecnológico

El servidor está construido con tecnologías modernas y enfocadas en la seguridad y rendimiento:
- **Entorno de Ejecución:** Node.js (v24+)
- **Framework Web:** Express.js (v5)
- **Lenguaje:** TypeScript (v5.6.2)
- **Base de Datos:** PostgreSQL
- **Seguridad:** JSON Web Tokens (JWT), bcrypt (Hashing de contraseñas), Helmet (Cabeceras HTTP), Express Rate Limit (Protección DDoS).
- **Pruebas (Testing):** Jest, Supertest
- **Motor de Desarrollo:** `tsx` (TypeScript Execute)

---

## ⚙️ 2. Requisitos Previos

Para poder ejecutar este proyecto en tu máquina local o en un servidor, necesitas tener instalado:
1. **Node.js** (Versión 24.x o superior)
2. **NPM** (Normalmente se instala junto a Node.js)
3. **PostgreSQL** (Servidor de base de datos relacional en funcionamiento)

---

## 🚀 3. Instalación y Configuración

### Paso 1: Clonar e instalar dependencias
Abre una terminal en la carpeta del backend (`caracolesback`) y ejecuta:
```bash
npm install
```

### Paso 2: Variables de Entorno
Crea un archivo llamado `.env` en la raíz del backend (al mismo nivel que `package.json`) y configura las siguientes variables, reemplazando con tus datos reales:
```env
PORT=3001
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=caracoles_db
JWT_SECRET=tu_secreto_super_seguro
```

### Paso 3: Inicializar la Base de Datos
El proyecto cuenta con un sistema de inicialización automática. Al correr el servidor por primera vez, este se conectará a PostgreSQL y creará las tablas necesarias (Usuarios, Historial, etc.) si no existen.

---

## 🏃 4. Ejecución del Servidor

El proyecto incluye varios scripts (comandos) listos para usar:

- **Modo Desarrollo (Recomendado):** 
  ```bash
  npm run dev
  ```
  Esto inicia el servidor usando `tsx watch`. Cualquier cambio que hagas en el código reiniciará el servidor automáticamente.

- **Modo Producción:**
  Primero debes compilar el código TypeScript a JavaScript:
  ```bash
  npm run build
  ```
  Y luego iniciar el servidor ya compilado:
  ```bash
  npm start
  ```

- **Ejecutar Pruebas (Testing):**
  Para asegurarte de que todo funciona correctamente y que no hay bugs:
  ```bash
  npm run test
  ```

---

## 🏗 5. Arquitectura del Sistema

El backend sigue un patrón de diseño **MVC (Modelo-Vista-Controlador)** adaptado para APIs RESTful, separando claramente las responsabilidades.

```text
+---------------------+
| Cliente / Next.js   |
+---------+-----------+
          |
          | (Petición HTTP / REST)
          v
+---------------------+
| App Node + Express  |
+---------+-----------+
          |
          v
+---------------------+
|     Middlewares     | (Valida JWT, Rate Limit, Helmet)
+---------+-----------+
          |
          v
+---------------------+
|     Enrutadores     |
+----+-----------+----+
     |           |
     v           v
+-------+    +-------+
| Auth  |    | User  | (Controladores)
+-------+    +-------+
     |           |
     +-----+-----+
           |
           v
    (=============)
    | PostgreSQL  | (Base de Datos)
    (=============)
```

---

## 📁 6. Estructura del Proyecto

El código está organizado siguiendo buenas prácticas de separación de responsabilidades:

```text
caracolesback/
├── src/
│   ├── app.ts                 # Configuración principal de Express y Middlewares
│   ├── server.ts              # Punto de entrada (Arranca el servidor en el puerto)
│   ├── config/
│   │   ├── database.ts        # Conexión a PostgreSQL (Pool)
│   │   └── env.ts             # Carga y validación de variables de entorno
│   ├── controllers/           # Lógica de negocio (Qué hace cada ruta)
│   ├── middlewares/           # Funciones interceptoras (Auth, Seguridad, Errores)
│   ├── routes/                # Definición de las URLs de la API (Endpoints)
│   └── tests/                 # Archivos de pruebas automatizadas con Jest
├── .env                       # Variables de configuración (NO SE SUBE A GITHUB)
├── package.json               # Dependencias y scripts del proyecto
└── tsconfig.json              # Configuración del compilador de TypeScript
```

---

## 🌐 7. Endpoints Principales (API REST)

A continuación, un resumen de las rutas disponibles:

### Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registra un nuevo usuario (encripta contraseña).
- `POST /api/auth/login`: Autentica al usuario y devuelve un token JWT.

### Usuarios (`/api/users`)
- `GET /api/users/:id`: Obtiene el perfil de un usuario específico. *(Requiere Token)*

### Pagos e Historial (`/api/payment`)
- `POST /api/payment/deposit`: Añade saldo a la billetera de un usuario. *(Requiere Token)*
- `GET /api/payment/history/:id`: Obtiene el historial de movimientos de un usuario. *(Requiere Token)*

---

## 📜 8. Registro de Cambios Recientes (Changelog)

Para mantener un registro de cómo el backend ha evolucionado, estos son los hitos más recientes que se lograron en la reestructuración del sistema:

1. **Migración Completa a TypeScript:** Se abandonó JavaScript nativo para adoptar tipado estricto. Esto previene que el servidor "se caiga" por errores de variables no definidas o tipos incorrectos, brindando máxima estabilidad.
2. **Motor de Ejecución Modernizado:** Se reemplazó el antiguo `ts-node` por `tsx`, asegurando compatibilidad con Node.js v24+ y acelerando los tiempos de recarga en desarrollo.
3. **Escudo de Testing Implementado:** Se instaló Jest junto con Supertest. Se configuró un mock (simulador) de la base de datos para correr pruebas de los controladores sin afectar los datos reales de los usuarios.

**Estrategia de Mocking para Tests:**
```text
[Jest Test Runner]       [Supertest]           [Express]          [Mock BD]
        |                     |                    |                  |
        | 1. POST /login      |                    |                  |
        |-------------------->|                    |                  |
        |                     | 2. Petición HTTP   |                  |
        |                     |------------------->|                  |
        |                     |                    | 3. SELECT users  |
        |                     |                    |----------------->|
        |                     |                    |                  |
        |                     |                    |  4. Retorna []   |
        |                     |                    |<-----------------|
        |                     | 5. Responde 400    |                  |
        |                     |<-------------------|                  |
        | 6. Valida HTTP 400  |                    |                  |
        |<--------------------|                    |                  |
        |                     |                    |                  |
        v                     v                    v                  v
     ✅ Test Passed!
```

4. **Validación de Errores Robustecida:** Todos los bloques `catch` de la aplicación ahora validan de manera correcta la instancia de los errores antes de devolver un mensaje, evitando fugas de memoria o caídas inesperadas del proceso Node.
