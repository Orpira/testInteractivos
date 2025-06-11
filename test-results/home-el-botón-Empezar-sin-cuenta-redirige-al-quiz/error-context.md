# Page snapshot

```yaml
- navigation:
  - link "Logo WebWiz Quiz":
    - /url: /
    - img "Logo"
    - paragraph: WebWiz Quiz
  - button "Iniciar sesión":
    - img
- heading "Configura tu Test" [level=2]
- heading "Selecciona una categoría:" [level=3]
- button "🌐 HTML"
- button "🎨 CSS"
- button "🧠 JavaScript"
- button "📝 Formularios"
- button "📱 Responsive"
- button "🐧 Linux"
- heading "Número de preguntas:" [level=3]
- combobox:
  - option "5 preguntas"
  - option "10 preguntas" [selected]
  - option "15 preguntas"
  - option "20 preguntas"
- button "Empezar test" [disabled]
- contentinfo:
  - paragraph:
    - text: © 2025
    - strong:
      - link "Test Interactivo de Programación":
        - /url: /
    - text: . Todos los derechos reservados. Desarrollador por
    - link "Orlando Pineda Raad - Fundación F5 Peñascal":
      - /url: https://github.com/orpira
```