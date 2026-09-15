export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function whatsappDigits(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("54")) return digits;
  if (digits.length === 10 && digits.startsWith("11")) return `549${digits}`;
  if (digits.length === 10) return `54${digits}`;
  if (digits.length === 11 && digits.startsWith("9")) return `54${digits}`;
  return digits;
}

export function whatsappUrl(phone: string, text = "") {
  const digits = whatsappDigits(phone);
  if (digits.length < 10) return "";
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function contactWhatsAppText(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const lines = [`Hola, soy ${input.name}.`];
  if (input.email) lines.push(`Email: ${input.email}`);
  if (input.phone) lines.push(`Teléfono: ${input.phone}`);
  lines.push("", input.message);
  return lines.join("\n").trim();
}
