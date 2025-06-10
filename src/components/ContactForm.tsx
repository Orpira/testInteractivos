// src/pages/ContactForm.tsx
export default function ContactForm() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Contacto</h2>
      <form
        action="https://formsubmit.co/orpira@gmail.com"
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" name="_captcha" value="false" />
        <input
          type="hidden"
          name="_next"
          value="http://localhost:5173/gracias"
        />

        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Tu correo"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Tu mensaje"
          required
          className="w-full border p-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
