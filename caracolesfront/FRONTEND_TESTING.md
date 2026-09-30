# Pruebas del Frontend (Frontend Testing)

Este proyecto utiliza un stack moderno y estándar para realizar pruebas unitarias y de componentes en React/Next.js. 

## 🛠 Herramientas Utilizadas

1. **Jest**: Nuestro "Test Runner". Es el motor principal que busca, ejecuta y reporta el resultado de nuestras pruebas. (Paquetes: `jest`, `ts-jest`).
2. **React Testing Library**: Librería diseñada para probar componentes de React de la forma en que los usuarios los usarían. En lugar de probar la implementación técnica, prueba la accesibilidad y lo que se renderiza en la pantalla (Ej: *¿Existe un botón con el texto "Enter Pit"?*). (Paquetes: `@testing-library/react`).
3. **JSDOM**: Un entorno simulado del navegador que funciona dentro de Node.js, necesario ya que las pruebas se corren en la terminal y no en un navegador real. (Paquetes: `jest-environment-jsdom`).
4. **Jest DOM**: Conjunto de matchers personalizados para Jest que hacen que las aserciones sobre el DOM sean mucho más legibles (Ej: `.toBeInTheDocument()`, `.toBeVisible()`, `.toHaveTextContent()`). (Paquetes: `@testing-library/jest-dom`).

## 📁 Dónde Encontrar las Pruebas

Los archivos de prueba deben estar ubicados junto al componente que están probando y deben llevar el sufijo `.test.tsx` o `.test.ts`. 

Ejemplos actuales en el proyecto:
- `app/auth/LoginForm.test.tsx` (Pruebas del formulario de inicio de sesión)
- `app/dashboard/dashboard.test.tsx` (Pruebas de visualización del dashboard)
- `app/users/manage_usr.test.tsx` (Pruebas del modal de administración de usuarios)
- `api/api.test.ts` (Pruebas de las funciones que llaman al backend)

## 🚀 Cómo Ejecutar las Pruebas

Para ejecutar las pruebas en tu entorno local, asegúrate de estar dentro del directorio `caracolesfront` y utiliza los siguientes comandos:

### 1. Ejecutar todas las pruebas una sola vez
Este comando buscará todos los archivos `*.test.tsx` o `*.test.ts`, los ejecutará y te mostrará un reporte de cobertura y éxito/fracaso en la consola.
```bash
npm run test
```

### 2. Ejecutar pruebas en modo "Watch" (Observación)
Este es el modo recomendado mientras estás desarrollando. Jest se quedará corriendo en la terminal y volverá a ejecutar las pruebas automáticamente cada vez que guardes un cambio en tus archivos de código.
```bash
npm run test:watch
```

## 🧠 ¿Qué hacen nuestras pruebas actuales?

Nuestras pruebas aseguran que la experiencia de usuario y las reglas de negocio principales funcionen correctamente, incluso si cambiamos el código subyacente. 

Por ejemplo, en `LoginForm.test.tsx`:
- **Renderizado Correcto**: Comprobamos que el formulario muestra los campos "Comms Email", "Access Code" y el botón "Enter Pit".
- **Interacción del Usuario**: Simulamos que un usuario escribe su email y contraseña, asegurándonos de que los inputs guarden esos valores.
- **Flujo de Envío (Mocking)**: Simulamos hacer clic en el botón de ingresar y "moqueamos" (fingimos) la respuesta de la API para asegurarnos de que la aplicación muestre la pantalla de éxito (`Success!`) si las credenciales son correctas, o muestre el mensaje de error si fallan.

En `manage_usr.test.tsx`:
- **Carga de Datos**: Simulamos una respuesta del backend con una lista de usuarios y validamos que se muestren correctamente en la tabla.
- **Creación y Eliminación**: Simulamos interacciones para crear un usuario, verificando que los datos enviados a la API sean los correctos.
