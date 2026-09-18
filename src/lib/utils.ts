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

function whatsappDigits(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("54")) return digits;
  if (digits.length === 10 && digits.startsWith("11")) return `549${digits}`;
  if (digits.length === 10) return `54${digits}`;
  if (digits.length === 11 && digits.startsWith("9")) return `54${digits}`;
  return digits;
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

export function whatsappUrl(phone: string, text = "") {
  const digits = whatsappDigits(phone);
  if (digits.length < 10) return "";
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telUrl(phone: string) {
  const digits = whatsappDigits(phone);
  return digits.length >= 10 ? `tel:+${digits}` : "";
}

export function formatPhoneDisplay(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("549") && digits.length >= 12) digits = digits.slice(3);
  else if (digits.startsWith("54") && digits.length >= 11) digits = digits.slice(2);
  if (digits.startsWith("9") && digits.length === 11) digits = digits.slice(1);
  if (digits.length === 10) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  return digits || phone;
}

export function mailtoUrl(email: string) {
  const value = email.replace(/^mailto:/i, "").replace(/\s+/g, "").trim();
  if (!value.includes("@")) return "";
  return `mailto:${value}`;
}

export function instagramLabel(url: string) {
  if (!url.includes("instagram.com/")) return "Instagram";
  const handle = url.split("instagram.com/")[1]?.replace(/\/$/, "");
  return handle ? `@${handle}` : "Instagram";
}

export function statusLabel(value?: string) {
  const text = (value || "").trim();
  if (!text) return "";
  const key = text.toLowerCase();
  if (key === "proyecto") return "En proyecto";
  if (key === "obra" || key === "terminado" || key === "finalizado" || key === "construido") {
    return "Obra realizada";
  }
  if (key === "en obra" || key === "ejecucion" || key === "ejecución") return "En obra";
  return text;
}
