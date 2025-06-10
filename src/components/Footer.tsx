export default function Footer() {
  return (
    <footer className="text-center p-4 mt-8 border-t text-sm text-gray-600">
      <p>
        © {new Date().getFullYear()}{" "}
        <strong>
          <a href="/">Test Interactivo de Programación</a>
        </strong>
        . Todos los derechos reservados. <br />
        Desarrollador por{" "}
        <a
          href="https://github.com/orpira"
          className="text-blue-600 hover:underline"
        >
          Orlando Pineda Raad - Fundación F5 Peñascal
        </a>
      </p>
    </footer>
  );
}
