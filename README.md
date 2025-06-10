# 🧠 Test Interactivos – Plataforma de Cuestionarios Interactivos

https://test-frontend-b6721.web.app/

Aplicación web educativa e interactiva para evaluar conocimientos en **HTML, CSS y JavaScript**, con autenticación OAuth, editor de código, ranking, formulario de contacto y pruebas automatizadas.

Desarrollada con tecnologías modernas: React, Vite, Tailwind, Zustand, Axios, Firebase, Auth0 y más.

---

## 🚀 Funcionalidades principales

- ✅ Realización de cuestionarios por categoría (HTML, CSS, JS, API externa)
- ✅ Acceso con o sin autenticación (Auth0)
- ✅ Resultados con puntuación y ranking en tiempo real
- ✅ Editor de código con soporte para HTML, CSS y JS
- ✅ Guardado de código y visualización de historial
- ✅ Formulario de contacto usando `formsubmit.co`
- ✅ Página de agradecimiento tras el envío del formulario
- ✅ Separación de rutas públicas y privadas
- ✅ Testing unitario, E2E y CI automatizado
- ✅ Google Analytics integrado

---

## 🏆 Competencias y necesidades cubiertas

| Competencia                                               | Estado |
| --------------------------------------------------------- | ------ |
| Interfaz adaptable con React                              | ✅     |
| Herramienta profesional de construcción (Vite)            | ✅     |
| Gestión de estado profesional (Zustand + Axios)           | ✅     |
| Estilos aislados con Tailwind                             | ✅     |
| Testing profesional (Testing Library, Playwright, Vitest) | ✅     |
| Uso de API externa (OpenTDB con Axios)                    | ✅     |
| Formulario web con `formsubmit.co`                        | ✅     |
| Pruebas unitarias y E2E                                   | ✅     |
| Rutas públicas/privadas con OAuth (Auth0)                 | ✅     |
| CI con GitHub Actions                                     | ✅     |

---

## 🛠️ Tecnologías utilizadas

| Tecnología          | Uso                                              |
| ------------------- | ------------------------------------------------ |
| **React + Vite**    | SPA rápida y modular                             |
| **TypeScript**      | Tipado estático                                  |
| **Tailwind CSS**    | Estilos utilitarios modernos y responsivos       |
| **Zustand**         | Manejo global de estado                          |
| **Axios**           | Consumo de API externa                           |
| **Firebase**        | Backend: Firestore, Auth, Realtime, Hosting      |
| **Auth0**           | Autenticación OAuth2 segura                      |
| **formsubmit.co**   | Envío de formularios sin backend propio          |
| **Vitest**          | Testing unitario                                 |
| **Playwright**      | Testing end-to-end (E2E)                         |
| **Testing Library** | Testing unitario de componentes                  |
| **GitHub Actions**  | Integración continua (CI) para tests automáticos |

---

## 📁 Estructura del proyecto

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Componentes reutilizables (AuthButton, ContactForm...)
│   ├── features/           # Features agrupadas (auth, editor, quiz, ranking)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas principales (Home, Quiz, Editor, Ranking...)
│   ├── router/             # Rutas de la app
│   ├── services/           # Servicios externos (firebase, auth0)
│   ├── store/              # Zustand store (quizStore)
│   ├── styles/             # Estilos globales
│   ├── test/               # Pruebas unitarias
│   └── vite-env.d.ts
├── tests/                  # Pruebas E2E (Playwright)
├── .husky/                 # Hooks de git (husky)
├── .github/                # Workflows de CI
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── ...
```

---

## 📦 Instalación y ejecución

```bash
git clone https://github.com/tu-usuario/quiz-app.git
cd quiz-app
npm install
npm run dev
```

### Variables de entorno necesarias

Crea un archivo `.env` en la raíz con:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_APP_ID=...
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...
```

---

## 🧪 Testing

- **Unitarios:**

```bash
npm run test
```

- **End-to-End:**

```bash
npx playwright test
```

---

## 🚀 Despliegue en Firebase Hosting

1. Instala la CLI de Firebase:

```bash
npm install -g firebase-tools
```

2. Inicia sesión y despliega:

```bash
firebase login
firebase init
firebase deploy
```

---

## Estructura básica del proyecto con Husky + Commitlint

- `1. package.json (fragmento relevante)`
  {
  "scripts": {
  "prepare": "husky install"
  },
  "devDependencies": {
  "@commitlint/cli": "^18.0.0",
  "@commitlint/config-conventional": "^18.0.0",
  "husky": "^9.0.0"
  }
  }

- `2. commitlint.config.cjs`
  module.exports = {
  extends: ['@commitlint/config-conventional'],
  };

- `3. .husky/commit-msg (bash script) #!/bin/sh`
  . "$(dirname "$0")/\_/husky.sh"

npx --no -- commitlint --edit "$1"

# Proyecto Base con Husky + Commitlint

Este repositorio incluye una configuración mínima para aplicar convenciones de commits usando Husky y Commitlint.

## Instalación

```bash
npm install
```

## Activar Husky

```bash
npx husky install
```

(Ya está definido en el script `prepare`, por lo que se ejecutará automáticamente tras `npm install` si clonas el repo correctamente.)

## Crear hook manualmente (si no existe)

```bash
mkdir -p .husky
chmod +x .husky/commit-msg
```

Contenido de `.husky/commit-msg`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

## Ejemplo de commit válido

```bash
git commit -m "feat: agrega validación con commitlint"
```

# 📘 Guía de Convenciones para Mensajes de Commits

Esta guía sigue la convención **Conventional Commits**, con algunos prefijos prácticos adicionales como `wip` para trabajo en progreso.

| Prefijo     | Significado                                   | Cuándo usarlo                                                      | Ejemplo                                                 |
| ----------- | --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| `feat:`     | **Feature** – Nueva funcionalidad             | Al agregar una nueva funcionalidad al sistema                      | `feat: añade formulario de contacto`                    |
| `fix:`      | **Bugfix** – Corrección de errores            | Al corregir un comportamiento que no funcionaba como se esperaba   | `fix: corrige validación de email en login`             |
| `docs:`     | **Documentación**                             | Cambios en README, comentarios, documentación técnica              | `docs: añade guía de instalación en README`             |
| `style:`    | **Estilo** – Sin afectar el comportamiento    | Cambios en espacios, indentación, formato                          | `style: reformatea el archivo App.js`                   |
| `refactor:` | **Reestructuración interna**                  | Cambios en código sin alterar comportamiento ni corregir bugs      | `refactor: simplifica la lógica de navegación`          |
| `test:`     | **Pruebas** – Añade o ajusta tests            | Agregar, eliminar o actualizar pruebas automáticas                 | `test: añade pruebas para componente Header`            |
| `ci:`       | **Integración continua**                      | Cambios en archivos o scripts de CI (GitHub Actions, Travis, etc.) | `ci: configura deploy automático en GitHub Actions`     |
| `build:`    | **Build system** – Dependencias y empaquetado | Cambios en `package.json`, Webpack, Vite, etc.                     | `build: actualiza versión de Tailwind`                  |
| `chore:`    | **Tareas varias** – Mantenimiento             | Tareas que no modifican el código fuente directamente              | `chore: limpia archivos temporales`                     |
| `wip:`      | **Work In Progress** – Trabajo en progreso    | Commits que **no están terminados** pero se quieren guardar        | `wip: comienza componente de registro, sin estilos aún` |

## 🧠 Recomendaciones

- Usa `wip:` para avances no terminados y **haz squash** antes de mergear a `main`.
- Usa mensajes en **imperativo**: `añade`, `corrige`, `refactoriza`.
- Evita mensajes genéricos como `cambios`, `update`, `avance`.

---

Puedes extender esta configuración con herramientas como lint-staged, prettier, ESLint, etc.

---

## 🔗 Recursos útiles

- [Documentación React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios](https://axios-http.com/)
- [Firebase](https://firebase.google.com/)
- [Auth0](https://auth0.com/docs/quickstart/spa/react)
- [OpenTDB API](https://opentdb.com/api_config.php)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

---

## 👨‍💻 Autor

Orlando – [github.com/tu-usuario](https://github.com/orpira)

---
