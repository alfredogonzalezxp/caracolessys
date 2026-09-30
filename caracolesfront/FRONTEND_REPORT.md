# 🐌 Snail Racing - Documentación del Frontend

Bienvenido a la documentación oficial de la interfaz de usuario (Frontend) de **Snail Racing**. Este proyecto está diseñado para ofrecer una experiencia inmersiva "Cyberpunk", siendo altamente reactivo, responsivo y respaldado por una sólida cobertura de pruebas.

## 🛠 1. Stack Tecnológico

El Frontend está construido con tecnologías modernas enfocadas en la máxima velocidad de renderizado y la mejor experiencia de usuario:
- **Core Framework:** Next.js (v16.3) con *App Router*
- **Librería UI:** React (v19)
- **Lenguaje:** TypeScript (v5+)
- **Estilos:** Tailwind CSS (v4)
- **Peticiones HTTP:** Axios (v1.13)
- **Pruebas (Testing):** Jest, React Testing Library, jsdom

---

## ⚙️ 2. Requisitos Previos

Para poder ejecutar este proyecto en tu máquina local, necesitas:
1. **Node.js** (Versión 20.x o superior)
2. **NPM** (Instalado con Node.js)
3. **Backend Corriendo** (El servidor Express de Snail Racing debe estar encendido para que el frontend pueda iniciar sesión y cargar datos).

---

## 🚀 3. Instalación y Configuración

### Paso 1: Clonar e instalar dependencias
Abre una terminal en la carpeta del frontend (`caracolesfront`) y ejecuta:
```bash
npm install
```

### Paso 2: Conexión al Backend
Normalmente, este frontend está configurado a través de `api/api.ts` o variables de entorno para apuntar a la URL de tu backend (por defecto `http://localhost:3001/api`). Si necesitas cambiarlo, revisa la configuración de Axios.

---

## 🏃 4. Ejecución del Proyecto

El proyecto incluye los siguientes scripts listos para usar:

- **Modo Desarrollo (Recomendado):** 
  ```bash
  npm run dev
  ```
  Esto inicia la aplicación en `http://localhost:3000`. Cualquier cambio visual o de código se reflejará al instante (Fast Refresh).

- **Ejecutar Pruebas Automatizadas (Testing):**
  Para asegurarte de que ningún botón o flujo se haya roto:
  ```bash
  npm run test
  ```

- **Modo Producción:**
  Compila Next.js a una versión ultra-rápida y la ejecuta:
  ```bash
  npm run build
  npm start
  ```

---

## 🏗 5. Arquitectura del Sistema

El frontend utiliza el patrón **Component-Based Architecture** mediante el *App Router* de Next.js, separando las páginas de la lógica reutilizable de componentes.

```text
+-----------------------+
| Usuario (Navegador)   |
+-----------+-----------+
            |
            | (Interacción UI / Clics)
            v
+-----------------------+
|  Next.js App Router   | (Rutas: /auth, /dashboard, etc)
+-----------+-----------+
            |
            v
+-----------------------+
| Componentes React     | (Formularios, Tarjetas, Header)
+-----------+-----------+
            |
            | (Llama a Axios)
            v
+-----------------------+
| Módulo API (api.ts)   | (Inyecta el Token JWT en el Header)
+-----------+-----------+
            |
            | (Petición HTTP a :3001)
            v
      [ BACKEND API ]
```

---

## 📁 6. Estructura del Proyecto

El código está estructurado para maximizar el orden y la escalabilidad:

```text
caracolesfront/
├── app/                       # Rutas de la aplicación (Next.js App Router)
│   ├── auth/                  # Páginas de Login y Registro
│   ├── dashboard/             # Panel principal (Privado)
│   ├── users/                 # Gestión de usuarios
│   ├── layout.tsx             # Plantilla HTML global (Inyecta Header general)
│   └── page.tsx               # Landing Page (Página de inicio)
├── api/
│   └── api.ts                 # Configuración de Axios y llamadas al backend
├── public/                    # Imágenes estáticas (Logos de caracoles, fondos)
├── package.json               # Dependencias del proyecto
└── tailwind.config.ts         # Configuración de colores y estilos Cyberpunk
```

---

## 🧪 7. Estrategia de Pruebas (Frontend Testing)

Dado que un error visual o un botón roto espanta a los usuarios, el Frontend tiene un escudo protector implementado con **React Testing Library**. 

**¿Cómo funcionan los Tests en el Frontend?**
En lugar de depender de que un humano haga clic, el entorno simula un "Navegador Virtual" (jsdom) e interactúa con los componentes como lo haría una persona (buscando textos por pantalla).

```text
[Jest Test Runner]      [React Testing Lib]         [Axios Mock]
        |                        |                        |
        | 1. Renderiza Login     |                        |
        |----------------------->|                        |
        |                        | 2. Encuentra Inputs    |
        |                        | (Escribe credenciales) |
        |                        |                        |
        | 3. Simula Clic en Botón|                        |
        |----------------------->|                        |
        |                        | 4. Petición Intercept. |
        |                        |----------------------->|
        |                        |                        |
        |                        | 5. Devuelve Token Falso|
        |                        |<-----------------------|
        | 6. Valida que el       |                        |
        | Dashboard se Muestre   |                        |
        |<-----------------------|                        |
        v                        v                        v
     ✅ Test Passed!
```

---

## 📜 8. Registro de Cambios Recientes (Changelog)

1. **Rediseño Cyberpunk Implementado:** Se actualizaron todos los estilos globales utilizando TailwindCSS para incorporar gradientes, sombras neón y colores de alto contraste (Fucsia/Cyan) siguiendo la temática "Snail Racing".
2. **Corrección de Componentes:** Se actualizó el Header global, cambiando el branding de *DevCourses* a **SnailSite**.
3. **Escudo de Tests Actualizado:** Los archivos de pruebas (`LoginForm.test.tsx`, `Header.test.tsx`, `dashboard.test.tsx`, etc.) fueron refactorizados. Se ajustaron las palabras clave (ahora buscan textos temáticos como *"Comms Email"*, *"Enter Pit"*, *"Access Code"*) para que los tests aprueben a pesar del agresivo rediseño visual.
