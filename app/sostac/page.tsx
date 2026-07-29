import { redirect } from "next/navigation";

// Generatorul SOSTAC nu mai traieste intr-o pagina separata: continutul apartine
// business-ului, deci se deschide din fisa lui (/strategie/[id], tabul SOSTAC),
// unde se si salveaza in tabela `strategii`. Ruta veche ramane doar ca sa nu se
// rupa bookmark-urile.
export default function SostacRedirect() {
  redirect("/strategie");
}
