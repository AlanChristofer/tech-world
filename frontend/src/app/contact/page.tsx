import { redirect } from "next/navigation";

export const metadata = { title: "Contato / Contact" };

export default function ContactPage() {
  redirect("/?destination=contact");
}
