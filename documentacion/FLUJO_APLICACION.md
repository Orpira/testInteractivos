# 📄 Explicación del flujo de la aplicación

## 1. Inicio y navegación

- El usuario accede a la página principal (Home).
- Puede elegir entre iniciar un cuestionario, probar el editor de código (requiere login) o ver el ranking.
- El botón de login/logout está siempre visible (Auth0).

## 2. Cuestionarios

- El usuario selecciona una categoría (HTML, CSS, JavaScript o API externa) y la cantidad de preguntas.
- Si elige una categoría local, las preguntas se obtienen de Firebase Firestore.
- Si elige "API (quizapi.io)", las preguntas se obtienen de la API externa usando Axios y se adaptan al formato interno.
- El estado del quiz (pregunta actual, score, selección, feedback) se gestiona globalmente con Zustand.

## 3. Proceso de preguntas

- El usuario responde cada pregunta y recibe feedback inmediato (correcta/incorrecta).
- Al finalizar, se calcula el puntaje y se muestra el resultado.
- El resultado se guarda en Firebase si el usuario está autenticado.

## 4. Resultados y ranking

- El usuario ve su resultado y puede acceder al ranking general.
- El ranking se obtiene en tiempo real desde Firestore y se muestra en una tabla ordenada.

## 5. Editor de código (En desarrollo)

- El usuario puede acceder al editor de código (HTML, CSS, JS) si está autenticado.
- Puede guardar sus envíos, que quedan asociados a su cuenta y pueden verse en el historial.

## 6. Historial y contacto

- El usuario autenticado puede ver su historial de envíos de código.
- Hay un formulario de contacto que usa formsubmit.co para enviar mensajes sin backend propio.

## 7. Seguridad y rutas

- Las rutas sensibles (editor, dashboard) están protegidas y requieren autenticación (Auth0).
- El resto de la app es accesible sin login.

## 8. Testing y CI

- Pruebas unitarias con Testing Library y Vitest.
- CI automatizado con Firebase.

## 9. Despliegue

- El proyecto se despliega fácilmente en Firebase Hosting.

---

**Resumen:**
La app es una SPA moderna, segura y profesional, con estado global, consumo de API externa, autenticación, pruebas y despliegue automatizado. El flujo es intuitivo y cubre todas las competencias solicitadas para un entorno profesional de desarrollo FrontEnd.
