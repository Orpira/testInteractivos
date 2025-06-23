# 🧠 WebWiz Quiz – Plataforma de Cuestionarios Interactivos

https://test-frontend-b6721.web.app/

Este proyecto es una plataforma interactiva de retos y quizzes de programación orientada a HTML, CSS y JavaScript. Permite a los usuarios practicar, validar y compartir soluciones en tiempo real, así como realizar quizzes para medir su progreso. El enfoque es educativo y está pensado para bootcamps y autoaprendizaje.

Desarrollada con tecnologías: React, Vite, Tailwind, Zustand, Axios, Firebase, Auth0 y más.

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
- ✅ Testing unitario
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
| Uso de API externa (quizapi.io con Axios)                 | ✅     |
| Formulario web con `formsubmit.co`                        | ✅     |
| Pruebas unitarias                                         | ✅     |
| Rutas públicas/privadas con OAuth (Auth0)                 | ✅     |

---

## 🛠️ Tecnologías utilizadas

| Tecnología          | Uso                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------- |
| **React + Vite**    | SPA rápida y modular                                                                  |
| **TypeScript**      | Tipado estático                                                                       |
| **Tailwind CSS**    | Estilos utilitarios modernos y responsivos                                            |
| **Zustand**         | Manejo global de estado                                                               |
| **Axios**           | Consumo de API externa                                                                |
| **Firebase**        | Backend: Firestore, Auth, Realtime, Hosting                                           |
| **Auth0**           | Autenticación OAuth2 segura                                                           |
| **formsubmit.co**   | Envío de formularios sin backend propio                                               |
| **Vitest**          | Testing unitario                                                                      |
| **Playwright**      | Testing end-to-end (E2E)                                                              |
| **Testing Library** | Testing unitario de componentes - Documentación en este documento [./README_TESTS.md] |

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
git clone https://github.com/tu-usuario/testInteractivos.git
cd testInteractivos
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

## Estado del proyecto

🚧 En desarrollo

## 🔗 Recursos útiles

- [Documentación React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios](https://axios-http.com/)
- [Firebase](https://firebase.google.com/)
- [Auth0](https://auth0.com/docs/quickstart/spa/react)
- [Quizapi API](https://quizapi.io)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

---

## 👨‍💻 Autor

Orlando – [github.com/orpira](https://github.com/orpira)

---
