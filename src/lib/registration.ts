export type RegistrationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  isAssociate: "" | "yes" | "no";
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[0-9]{10}$/;

export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  isAssociate: boolean;
};

type ValidationResult =
  | { success: true; data: RegistrationPayload }
  | { success: false; message: string };

export function validateRegistration(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, message: "Los datos del registro no son válidos." };
  }

  const values = input as Record<string, unknown>;
  const fullName = typeof values.fullName === "string" ? values.fullName.trim() : "";
  const email = typeof values.email === "string" ? values.email.trim() : "";

  if (!fullName || fullName.length > 120) {
    return { success: false, message: "Ingresa tu nombre completo (máximo 120 caracteres)." };
  }
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, message: "Ingresa un correo electrónico válido (máximo 254 caracteres)." };
  }
  if (typeof values.phone !== "string" || values.phone.length !== 10 || !PHONE_PATTERN.test(values.phone)) {
    return { success: false, message: "El teléfono debe contener exactamente 10 dígitos." };
  }
  if (values.profession !== undefined && typeof values.profession !== "string") {
    return { success: false, message: "La profesión o cargo debe ser un texto de máximo 120 caracteres." };
  }

  const profession = typeof values.profession === "string" ? values.profession.trim() : "";
  if (profession.length > 120) {
    return { success: false, message: "La profesión o cargo debe tener máximo 120 caracteres." };
  }
  if (typeof values.isAssociate !== "boolean") {
    return { success: false, message: "Indica si eres asociado de ANPROGERI." };
  }

  return {
    success: true,
    data: { fullName, email, phone: values.phone, profession, isAssociate: values.isAssociate },
  };
}
