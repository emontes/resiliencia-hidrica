"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowUpRight, CheckCircle2, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { EMAIL_PATTERN, PHONE_PATTERN, type RegistrationFormValues } from "@/lib/registration";

export function RegistrationForm() {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationFormValues>({
    defaultValues: { fullName: "", email: "", phone: "", profession: "", isAssociate: "" },
  });

  async function onSubmit(values: RegistrationFormValues) {
    setSubmitError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, isAssociate: values.isAssociate === "yes" }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "ok") {
        setSubmitError(result.message || "No pudimos completar tu registro. Inténtalo de nuevo.");
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.");
    }
  }

  if (success) {
    return (
      <div className="success-panel" role="status" aria-live="polite">
        <span className="success-icon"><CheckCircle2 size={34} /></span>
        <p className="eyebrow">EL PRIMER PASO ESTÁ HECHO</p>
        <h3>¡Registro exitoso!</h3>
        <p>En breve te enviaremos la información bancaria y de acceso a tu correo.</p>
        <div className="success-note"><Mail size={20} /> Revisa también tu carpeta de correo no deseado.</div>
        <a href="#inicio" className="text-link">Volver al inicio <ArrowUpRight size={17} /></a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="registration-form">
      <div className="form-heading"><span className="eyebrow">TU PRÓXIMO PASO</span><span className="form-step">01 / 01</span></div>
      <h3>Empieza por registrarte.</h3>
      <p className="form-intro">Déjanos tus datos. Te acompañamos con tu inscripción.</p>
      <div className="field">
        <label htmlFor="fullName">Nombre completo <span aria-hidden="true">*</span></label>
        <input id="fullName" autoComplete="name" placeholder="Tu nombre y apellidos" maxLength={120} aria-required="true" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} {...register("fullName", { required: "Escribe tu nombre completo.", validate: value => !!value.trim() || "Escribe tu nombre completo.", maxLength: { value: 120, message: "Usa un máximo de 120 caracteres." } })} />
        {errors.fullName && <p id="fullName-error" className="field-error" role="alert">{errors.fullName.message}</p>}
      </div>
      <div className="field">
        <label htmlFor="email">Correo electrónico <span aria-hidden="true">*</span></label>
        <input id="email" type="email" autoComplete="email" placeholder="tu@correo.com" maxLength={254} aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email", { required: "Escribe tu correo electrónico.", setValueAs: value => value.trim(), pattern: { value: EMAIL_PATTERN, message: "Escribe un correo electrónico válido." } })} />
        {errors.email && <p id="email-error" className="field-error" role="alert">{errors.email.message}</p>}
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="phone">Teléfono / WhatsApp <span aria-hidden="true">*</span></label>
          <input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10 dígitos" maxLength={10} aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone", { required: "Escribe tu teléfono.", pattern: { value: PHONE_PATTERN, message: "Ingresa exactamente 10 dígitos." } })} />
          {errors.phone && <p id="phone-error" className="field-error" role="alert">{errors.phone.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="profession">Profesión / Cargo <span className="optional">(opcional)</span></label>
          <input id="profession" autoComplete="organization-title" placeholder="Ej. Ingeniería civil" maxLength={120} {...register("profession")} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="isAssociate">¿Es asociado de ANPROGERI? <span aria-hidden="true">*</span></label>
        <select id="isAssociate" aria-required="true" aria-invalid={!!errors.isAssociate} aria-describedby={errors.isAssociate ? "associate-error" : undefined} {...register("isAssociate", { required: "Selecciona una opción." })}>
          <option value="" disabled>Selecciona una opción</option>
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
        {errors.isAssociate && <p id="associate-error" className="field-error" role="alert">{errors.isAssociate.message}</p>}
      </div>
      {submitError && <p className="submit-error" role="alert">{submitError}</p>}
      <button type="submit" className="button button-primary form-submit" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="animate-spin" size={19} /> Enviando registro…</> : <>Registrarme e Inscribirme <ArrowUpRight size={19} /></>}
      </button>
      <p className="form-privacy"><LockKeyhole size={13} aria-hidden="true" /> Usaremos tus datos para contactarte sobre este curso. No se realiza ningún cobro al registrarte.</p>
      <p className="required-note">* Campos obligatorios</p>
    </form>
  );
}
