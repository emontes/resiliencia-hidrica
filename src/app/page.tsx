import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays, Check, ChevronDown, Clock3, Droplets, Facebook, Layers3, Leaf, Monitor, ShieldCheck, Sprout, Users, Waves } from "lucide-react";
import { RegistrationForm } from "@/components/registration-form";

const outcomes = [
  { number: "01", icon: ShieldCheck, title: "Resiliencia hídrica", text: "Comprende el territorio y fortalece su capacidad para adaptarse a los riesgos hidrológicos." },
  { number: "02", icon: Droplets, title: "Impacto hidrológico cero", text: "Explora el concepto de Pluvial Cero y su relación con las reglamentaciones vigentes en el país." },
  { number: "03", icon: Waves, title: "Manejo integral del agua", text: "Conecta la captación, infiltración y retención para una gestión del agua con visión integral." },
  { number: "04", icon: Sprout, title: "Soluciones basadas en la naturaleza", text: "Integra los procesos naturales al diseño para reducir riesgos y crear entornos resilientes." },
];

const faqs = [
  { question: "¿Necesito ser asociado para tomar el curso?", answer: "No. El curso está abierto al público general por $1,500 MXN. Los asociados de ANPROGERI cuentan con una cuota de $800 MXN." },
  { question: "¿Cómo aparto mi lugar?", answer: "Completa el formulario y te enviaremos la información bancaria a tu correo. Puedes apartar tu lugar desde el 50% de tu cuota mediante transferencia bancaria BBVA. El registro por sí solo no realiza ningún cobro." },
  { question: "¿Cómo son las sesiones y qué necesito?", answer: "Las sesiones son en línea a través de Zoom. Necesitas conexión a internet y un equipo con acceso a la plataforma. Las clases son los viernes de 04:00 PM a 09:00 PM y los sábados de 09:00 AM a 02:00 PM. Al recibir la información de acceso podrás confirmar la zona horaria con la organización." },
  { question: "¿Qué incluye mi inscripción?", answer: "Incluye 20 horas de capacitación, materiales y recursos digitales, un diploma con valor curricular y la resolución de un caso práctico." },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#inicio" className={`brand ${footer ? "brand-footer" : ""}`} aria-label="ANPROGERI — Ir al inicio">
      <span className="brand-symbol"><Droplets size={27} strokeWidth={1.5} /></span>
      <span><strong>ANPROGERI<span className="brand-dot">.</span></strong><small>Profesionales en resiliencia</small></span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <div className="announcement"><span className="status-dot" /> Inscripciones abiertas <span className="announcement-divider">/</span> <span>Construyamos un futuro con agua.</span><ArrowUpRight size={14} /></div>
      <header className="site-header" id="inicio">
        <div className="container header-inner">
          <Brand />
          <nav aria-label="Navegación principal" className="desktop-nav"><a href="#programa">El programa</a><a href="#detalles">Fechas y modalidad</a><a href="#inversion">Inversión</a></nav>
          <a href="#registro" className="button header-cta">Inscribirme <ArrowUpRight size={16} /></a>
        </div>
      </header>
      <main id="contenido">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-badge"><span className="status-dot" /> Curso - Taller 2026 <span className="badge-divider">|</span> Modalidad en Línea (Zoom)</div>
            <h1 id="hero-title">Resiliencia Hídrica <span className="title-connector">e</span><br /> Impacto Hidrológico <em>Cero.</em></h1>
            <p className="hero-subtitle">Diseña hoy soluciones basadas en la naturaleza para un futuro con agua y resiliencia.</p>
            <div className="hero-actions"><a href="#registro" className="button button-primary">Aparta tu lugar (Desde 50%) <ArrowUpRight size={18} /></a><a href="#programa" className="hero-secondary">Ver Programa Completo <ArrowDown size={16} /></a></div>
            <div className="hero-trust"><Award size={19} strokeWidth={1.4} /><span>Conocimiento que se convierte en impacto real.</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-topline"><span>INGENIERÍA + NATURALEZA</span><span>ED. 2026 <span className="crosshair">+</span></span></div>
            <div className="artwork-wrap"><Image src="/course-landscape.webp" alt="Paisaje urbano con infraestructura verde y corte del suelo que ilustra la infiltración, retención y recarga de acuíferos." width={652} height={512} priority className="hero-artwork" sizes="(max-width: 800px) 100vw, 50vw" /><span className="artwork-tag"><span className="status-dot" /> El agua como punto de partida.</span></div>
            <div className="visual-caption"><span className="caption-number">01 —</span><p>Repensar el territorio.<br /><strong>Diseñar con la naturaleza.</strong></p><ArrowDownRight size={36} strokeWidth={1} /></div>
          </div>
        </section>
        <div className="container"><div className="quick-facts">
          <div><Clock3 /><span><strong>20 horas</strong><small>de capacitación aplicada</small></span></div>
          <div><CalendarDays /><span><strong>Viernes 25 de septiembre</strong><small>Inicio del curso · 2026</small></span></div>
          <div><Monitor /><span><strong>En línea, en vivo</strong><small>Aprende a través de Zoom</small></span></div>
          <div><Award /><span><strong>Diploma</strong><small>con valor curricular</small></span></div>
        </div></div>
        <section id="programa" className="section container" aria-labelledby="learning-title">
          <div className="section-heading"><div><p className="eyebrow"><span /> CONOCIMIENTO PARA LA ACCIÓN</p><h2 id="learning-title">El futuro del agua<br />también se <em>diseña.</em></h2></div><p className="section-description">¿Qué aprenderás? Una visión integral para transformar los retos del agua en soluciones que fortalecen la resiliencia del territorio.</p></div>
          <div className="outcomes-grid">{outcomes.map(({ number, icon: Icon, title, text }) => <article key={number} className="outcome-card"><div className="outcome-top"><Icon size={29} strokeWidth={1.4} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p><span className="outcome-line" /></article>)}</div>
          <div className="practical-note"><span className="icon-square"><Layers3 size={22} /></span><div><strong>De la teoría al territorio.</strong><p>Integra lo aprendido con la resolución de un caso práctico.</p></div><span className="small-tag">ENFOQUE APLICADO <ArrowUpRight size={15} /></span></div>
          <div className="audience"><div className="audience-heading"><Users size={22} strokeWidth={1.5} /><h3>¿Este curso es para ti?</h3></div><div className="audience-content"><p>Para profesionales que buscan diseñar y construir un entorno más resiliente.</p><div className="audience-tags">{["Dictaminadores de Riesgos", "Peritos", "Ingenieros Civiles", "Arquitectos", "Urbanistas", "Consultores Ambientales"].map(role => <span key={role}>{role}</span>)}</div></div></div>
        </section>
        <section id="detalles" className="details-section" aria-labelledby="details-title"><div className="container details-layout">
          <div className="details-copy"><p className="eyebrow"><span /> RESERVA EL ESPACIO PARA APRENDER</p><h2 id="details-title">20 horas.<br />Una nueva forma<br />de ver el <em>agua.</em></h2><p>Un curso-taller en vivo que conecta el conocimiento técnico con los desafíos de tu práctica profesional.</p><div className="zoom-note"><Monitor size={19} /><span>Donde estés, conéctate vía <strong>Zoom.</strong></span></div></div>
          <div className="schedule-card"><div className="schedule-header"><span className="eyebrow">EN TU AGENDA</span><CalendarDays size={22} /></div><div className="schedule-dates"><div><span className="date-label">INICIO · VIERNES</span><strong>25 <span>SEP</span></strong><small>Septiembre 2026</small></div><ArrowRight size={24} strokeWidth={1} /><div><span className="date-label">CLAUSURA · SÁBADO</span><strong>03 <span>OCT</span></strong><small>Octubre 2026</small></div></div><div className="schedule-times"><div><span>Viernes</span><strong>04:00 PM — 09:00 PM</strong></div><div><span>Sábados</span><strong>09:00 AM — 02:00 PM</strong></div></div><p className="timezone-note">Confirma la zona horaria en la información de acceso.</p><div className="includes"><p>Tu inscripción incluye</p><span><Check size={16} /> Materiales y recursos digitales</span><span><Check size={16} /> Diploma con valor curricular</span><span><Check size={16} /> Resolución de caso práctico</span></div></div>
        </div></section>
        <section id="inversion" className="section container pricing-section" aria-labelledby="pricing-title"><div className="center-heading"><p className="eyebrow">INVIERTE EN TU DESARROLLO</p><h2 id="pricing-title">Tu conocimiento.<br /><em>Un impacto duradero.</em></h2><p>Una sola inversión. Herramientas para transformar tu práctica.</p></div><div className="pricing-grid"><article className="price-card"><span className="price-icon"><Users size={23} strokeWidth={1.4} /></span><h3>Público general</h3><p>Para profesionales que quieren dar el siguiente paso.</p><div className="price">$1,500 <span>MXN</span></div><span className="price-caption">Inversión total por participante</span><a href="#registro" className="button button-outline">Quiero inscribirme <ArrowUpRight size={18} /></a><span className="deposit"><Check size={15} /> Aparta con $750 MXN</span></article><article className="price-card associate-card"><span className="member-badge">BENEFICIO PARA ASOCIADOS</span><span className="price-icon"><ShieldCheck size={23} strokeWidth={1.4} /></span><h3>Asociados ANPROGERI</h3><p>Una cuota especial para nuestra comunidad.</p><div className="price">$800 <span>MXN</span></div><span className="price-caption">Inversión total por participante</span><a href="#registro" className="button button-primary">Soy asociado, quiero inscribirme <ArrowUpRight size={18} /></a><span className="deposit"><Check size={15} /> Aparta con $400 MXN</span></article></div><div className="payment-note"><ShieldCheck size={18} /><p>Aparta tu lugar desde el <strong>50%.</strong> Pago vía transferencia bancaria <strong className="bbva">BBVA.</strong></p></div></section>
        <section id="registro" className="registration-section" aria-labelledby="registration-title"><div className="container registration-layout"><div className="registration-copy"><p className="eyebrow"><span /> HAZ QUE SUCEDA</p><h2 id="registration-title">El cambio empieza<br />con lo que<br /><em>aprendes hoy.</em></h2><p>Da el primer paso hacia una gestión del agua más consciente, integral y resiliente.</p><div className="registration-benefits"><span><Check size={18} /> Aparta tu lugar desde el 50%</span><span><Check size={18} /> Formación en vivo, desde donde estés</span><span><Check size={18} /> Diploma con valor curricular</span></div><div className="registration-divider" /><div className="next-steps"><span className="icon-square"><BookOpen size={23} strokeWidth={1.4} /></span><p><strong>¿Qué sigue después del registro?</strong><br />Recibirás por correo la información bancaria y de acceso para completar tu inscripción.</p></div><div className="water-mark" aria-hidden="true"><Waves strokeWidth={0.6} /></div></div><RegistrationForm /></div></section>
        <section className="section container faq-section" aria-labelledby="faq-title"><div><p className="eyebrow">TODO CLARO, ANTES DE EMPEZAR</p><h2 id="faq-title">¿Tienes <em>dudas?</em></h2><p>Lo que necesitas saber para dar el siguiente paso.</p></div><div className="faq-list">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div></section>
        <div className="container closing-line"><Leaf size={20} strokeWidth={1.4} /><p>Menos impacto. Más resiliencia. <em>Un futuro con agua.</em></p></div>
      </main>
      <footer className="site-footer"><div className="container footer-main"><Brand footer /><p>Curso - Taller 2026<br /><span>Resiliencia Hídrica e Impacto Hidrológico Cero</span></p><a href="#inicio" className="back-top">Volver arriba <ArrowUpRight size={18} /></a></div><div className="container footer-bottom"><span>© 2026 ANPROGERI. Todos los derechos reservados.</span><div className="footer-links"><a href="https://enriquemontes.com" target="_blank" rel="noopener noreferrer">Desarrollado por Enrique Montes <ArrowUpRight size={11} /></a><a href="https://www.facebook.com/ANPROGERI.DELEGACION.CHIAPAS" target="_blank" rel="noopener noreferrer"><Facebook size={12} aria-label="Facebook ANPROGERI Chiapas" /> Facebook</a></div></div></footer>
    </>
  );
}
