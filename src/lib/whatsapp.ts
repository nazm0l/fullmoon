import { event } from "@/content/event";

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || event.whatsappNumber;
}

export function buildWhatsAppLink(message: string, customNumber?: string): string {
  const number = customNumber || getWhatsAppNumber();
  // Strip non-digits
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppLink(): string {
  return buildWhatsAppLink(event.whatsappMessages.general);
}

export function getBookingSuccessWhatsAppLink(
  name: string,
  persons?: number,
  amount?: number,
  trxId?: string,
  method?: string
): string {
  let message = event.whatsappMessages.afterBooking
    .replace("{name}", name)
    .replace("{persons}", persons ? String(persons) : "1")
    .replace("{method}", method || "bKash")
    .replace("{trxId}", trxId || "N/A");
  return buildWhatsAppLink(message);
}

export function getFailureFallbackWhatsAppLink(): string {
  return buildWhatsAppLink(event.whatsappMessages.fallback);
}

