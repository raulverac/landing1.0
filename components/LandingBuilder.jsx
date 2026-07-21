"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const ACC = "#e6a817";
const DARK = "#1a2535";
const SNAMES = ["Clásica", "Beneficios", "Storytelling", "Urgencia", "Profesional", "UNAB"];
const SIDS = ["clasica", "beneficios", "storytelling", "urgencia", "profesional", "unab"];

// Editor UI — DashboardKit design tokens
const UI_PRIMARY = "#7267ef";
const UI_BG = "#f0f2f8";
const UI_CARD = "#ffffff";
const UI_TEXT = "#293240";
const UI_MUTED = "#5b6b79";
const UI_BORDER = "#e9ecef";
const UI_INPUT_BORDER = "#bec8d0";
const UI_SHADOW = "0 2px 6px -1px rgba(0,0,0,0.1)";
const UI_SHADOW_MD = "0 4px 14px -2px rgba(114,103,239,0.18)";
const UI_RADIUS = 8;
const UI_FONT = "'Inter','Segoe UI',system-ui,sans-serif";

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const mkDefault = (struct = "clasica") => ({
  id: null,
  name: "Mi Nueva Landing",
  createdAt: null,
  struct,
  utm: { source: "", medium: "", campaign: "", content: "", term: "" },
  header: {
    logoText: "MiMarca", logoUrl: "", logoSize: 30, bgColor: DARK, textColor: "#ffffff",
    menu: [
      { l: "Inicio", h: "#hero" }, { l: "Servicios", h: "#services" },
      { l: "Nosotros", h: "#about" }, { l: "Contacto", h: "#footer" },
    ],
  },
  hero: {
    slides: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=70",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=70",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=70",
    ],
    title: "Bienvenido a Nuestra Empresa",
    desc: "Ofrecemos soluciones innovadoras para tu negocio.",
    btnText: "Comenzar Ahora", btnHref: "#services", btnColor: ACC, overlay: 0.5,
  },
  services: {
    title: "Nuestros Servicios", subtitle: "Todo lo que necesitas para crecer",
    bgColor: "#f8f9fa", titleColor: DARK, cardBg: "#ffffff", accent: ACC,
    cards: [
      { icon: "🚀", title: "Estrategia", desc: "Planificamos el camino al éxito." },
      { icon: "🎨", title: "Diseño", desc: "Creamos experiencias visuales memorables." },
      { icon: "📈", title: "Crecimiento", desc: "Potenciamos tus métricas." },
      { icon: "🛡", title: "Seguridad", desc: "Protegemos tu negocio." },
    ],
  },
  benefits: {
    title: "Nuestros Beneficios", subtitle: "¿Por qué elegirnos?",
    bgColor: "#fff", titleColor: DARK, accent: ACC,
    items: [
      { icon: "✅", title: "Ahorro de tiempo", desc: "Reducimos tus procesos hasta un 60%." },
      { icon: "💰", title: "Mayor rentabilidad", desc: "Incrementa tus ingresos desde el primer mes." },
      { icon: "🙏", title: "Soporte 24/7", desc: "Siempre disponibles cuando nos necesites." },
    ],
  },
  story: {
    title: "Nuestra Historia", bgColor: "#fff", titleColor: DARK,
    steps: [
      { num: 1, title: "El problema", desc: "Identificamos el dolor real de nuestros clientes." },
      { num: 2, title: "La solución", desc: "Desarrollamos una respuesta única y efectiva." },
      { num: 3, title: "Los resultados", desc: "Más de 500 empresas transformadas." },
    ],
    quote: "Gracias a ellos transformamos completamente nuestro negocio en menos de 6 meses.",
    quoteAuthor: "— María González, CEO de Innova",
  },
  urgency: {
    headline: "Oferta por tiempo limitado",
    deadline: Date.now() + 7200000 + 937000,
    bgColor: DARK, textColor: "#fff",
    badges: [{ icon: "✅", text: "Garantía" }, { icon: "⭐", text: "Premium" }, { icon: "🛡", text: "Seguro" }],
    listTitle: "Incluye:",
    items: ["Acceso completo a la plataforma", "Soporte personalizado 24/7", "Actualizaciones gratuitas de por vida", "Consultoría inicial incluida"],
  },
  // Profesional structure sections
  profesional: {
    badge: "EXPERTOS EN TU INDUSTRIA",
    badgeColor: "#c8f135",
    heroBgColor: DARK,
    heroTitle: "Transforma tu Negocio con",
    heroTitleAccent: "Nuestra Solución Digital",
    heroTitleAccentColor: "#c8f135",
    heroDesc: "Transformamos la normativa en tu ventaja competitiva. Traducimos la ley a código, diseño y estrategia comercial.",
    heroBtnText: "Iniciar Diagnóstico",
    heroBtnColor: "#c8f135",
    heroBtnTextColor: DARK,
    ecosystemTitle: "NUESTRA SOLUCIÓN:",
    ecosystemSubtitle: "ECOSISTEMA DE 4 DIMENSIONES",
    ecosystemDesc: "Un enfoque integral que cubre desde el mindset organizacional hasta la implementación técnica granular.",
    ecosystemBgColor: "#ffffff",
    ecosystemAccent: "#c8f135",
    ecosystemCards: [
      { tag: "ESTRATEGIA", title: "Gobernanza (El Cerebro)", desc: "Diagnóstico de brechas, Gap Analysis, ROPA y creación de Modelos de Prevención." },
      { tag: "CONSENTIMIENTO", title: "UX/UI (La Cara)", desc: "Diseño de privacidad desde el origen, Smart Forms y eliminación de patrones oscuros." },
      { tag: "GESTIÓN", title: "Operaciones (El Motor)", desc: "Adecuación de contratos, Vendor Risk Management y protocolos de flujo internacional." },
      { tag: "SEGURIDAD", title: "Tecnología (El Escudo)", desc: "Cifrado de datos, implementación de CDR, anonimización y respuesta automatizada." },
    ],
    catalogTitle: "Catálogo de Servicios",
    catalogSubtitle: "Soluciones integrales de acuerdo a la madurez de tu empresa.",
    catalogBgColor: "#f8f9fa",
    catalogCols: [
      {
        icon: "💎", title: "Estrategia y Consultoría",
        items: ["Gap Analysis (Diagnóstico Integral)", "Mapeo de Flujo de Datos Transversales", "Evaluación de Impacto (EPIA/EIFD)", "DPO as a Service (Delegado Externo)", "Modelos de Prevención de Delitos"],
      },
      {
        icon: "✏️", title: "UX/UI y Frontend",
        items: ["Centros de Consentimiento Inteligentes", "Implementación de CMP Multidispositivo", "Limpieza de Dark Patterns en Funnels", "Diseño de Pref Centers"],
      },
      {
        icon: "</>", title: "Tecnología y Backend",
        items: ["Implementación de Customer Data Platforms", "Protocolos de Anonimización Proactiva", "Automatización de Derechos ARSGPB", "Auditoría de SDKs y Píxeles de Terceros", "Sistemas de Alerta de Brechas"],
      },
    ],
    phasesTitle: "Tu Plan de Acción en 3 Fases",
    phasesSubtitle: "Una ruta clara hacia el cumplimiento normativo y la eficiencia operativa.",
    phasesBgColor: "#ffffff",
    phases: [
      { num: 1, icon: "🔍", title: "Diagnóstico y Estructura", desc: "Nombramiento de DPO, mapeo de flujos y detección de activos críticos en marketing." },
      { num: 2, icon: "📋", title: "Rediseño y Transparencia", desc: "Definición de bases de licitud, protocolos para menores y despliegue de UX/UI Privacy First." },
      { num: 3, icon: "🛡", title: "Operación y Seguridad", desc: "Medidas técnicas de cifrado, gestión de derechos ARSGPB y auditoría de ciberseguridad." },
    ],
  },
  about: {
    title: "Quiénes Somos",
    desc: "Somos un equipo apasionado dedicado a transformar ideas en realidades digitales.\n\nCon más de 10 años de experiencia hemos ayudado a cientos de empresas.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=70",
    videoUrl: "", bgColor: "#ffffff", textColor: "#333333", imgLeft: true,
  },
  // Form config
  form: {
    type: "basic", // "basic" | "embed"
    embedCode: "",
    title: struct === "unab" ? "" : "Contáctanos",
    subtitle: struct === "unab" ? "" : "Cuéntanos sobre tu necesidad",
    btnText: struct === "unab" ? "Enviar Datos" : "Enviar mis Datos",
    btnColor: struct === "unab" ? DARK : "#c8f135",
    btnTextColor: struct === "unab" ? "#ffffff" : DARK,
    fields: struct === "unab" ? [
      { id: "rut", label: "RUT", type: "text", placeholder: "RUT (Ej. 99999999-9)", required: true },
      { id: "nombres", label: "Nombres", type: "text", placeholder: "Nombres", required: true },
      { id: "apellidoP", label: "Apellido Paterno", type: "text", placeholder: "Apellido Paterno", required: true },
      { id: "apellidoM", label: "Apellido Materno", type: "text", placeholder: "Apellido Materno", required: true },
      { id: "telefono", label: "Teléfono", type: "tel", placeholder: "Teléfono", required: false },
      { id: "email", label: "Email", type: "email", placeholder: "Email", required: true },
      { id: "programa", label: "Programa de Interés", type: "text", placeholder: "-- Programa de Interés --", required: false },
      { id: "campus", label: "Campus", type: "text", placeholder: "-- Seleccione Campus --", required: false },
    ] : [
      { id: "nombre", label: "Nombre", type: "text", placeholder: "Nombre", required: true },
      { id: "email", label: "Correo", type: "email", placeholder: "Email", required: true },
      { id: "telefono", label: "Número de móvil", type: "tel", placeholder: "Teléfono", required: false },
      { id: "mensaje", label: "Cuéntanos sobre tu necesidad", type: "textarea", placeholder: "Mensaje", required: false },
    ],
    privacyText: "Solo usaremos tu información para desarrollar la propuesta de servicios que nos solicites.",
    showPrivacyCheck: struct !== "unab",
    bgColor: struct === "unab" ? "rgba(255,255,255,0.12)" : DARK,
    textColor: "#ffffff",
    showInHero: struct === "clasica",
    showInFooter: struct === "profesional",
  },
  // UNAB structure data
  unab: {
    admisionLabel: "Admisión", admisionYear: "2026",
    heroTitle: "Es momento de llegar más lejos",
    contentBgColor: "rgba(15,25,45,0.82)",
    programsTitle: "Carreras y Programas",
    programsBgColor: "#ffffff", programsTitleBg: DARK, programsTitleColor: "#ffffff",
    programsTextColor: "#1a2535", programsFooterText: "+INFORMACIÓN EN TU-SITIO.CL", programsFooterColor: DARK,
    categories: [
      { name: "Presencial", items: ["Contador Auditor", "Ingeniería en Administración de Empresas", "Ingeniería Comercial", "Prosecución de Estudios Educación Diferencial", "Prosecución de Estudios Educación Parvularia"] },
      { name: "Semipresencial", items: ["Ingeniería en Computación e Informática", "Ingeniería en Información y Control de Gestión", "Ingeniería Civil Industrial", "Ingeniería Industrial", "Ingeniería en Automatización y Robótica"] },
      { name: "Online", items: ["Contador Auditor", "Ingeniería en Administración de Empresas", "Ingeniería Civil Industrial", "Ingeniería en Información y Control de Gestión"] },
    ],
    accreditationBgColor: DARK,
    accreditations: [
      { text: "8 años MSCHE", icon: "|||", logoUrl: "" },
      { text: "6 años Acreditada Nivel Excelencia", icon: "A↑", logoUrl: "" },
      { text: "AUDIT", icon: "📋", logoUrl: "" },
      { text: "CHEA", icon: "★", logoUrl: "" },
      { text: "CIQG", icon: "◎", logoUrl: "" },
    ],
  },
  footer: {
    bgColor: DARK, textColor: "#cccccc", company: "MiMarca S.A.",
    desc: "Transformando negocios a través de la innovación digital.",
    email: "contacto@mimarca.com", phone: "+56 9 1234 5678", address: "Av. Principal 1234, Santiago",
    copy: "© 2025 MiMarca. Todos los derechos reservados.",
    showForm: false, // non-profesional structures can also enable it
    socialLinks: { linkedin: "#", instagram: "#", twitter: "#" },
  },
});

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const storageKey = "lb5_landings";
const loadLandings = async () => {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get(storageKey);
      return r ? JSON.parse(r.value) : [];
    }
    const ls = localStorage.getItem(storageKey);
    return ls ? JSON.parse(ls) : [];
  } catch { return []; }
};
const saveLandings = async (list) => {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(storageKey, JSON.stringify(list));
    } else {
      localStorage.setItem(storageKey, JSON.stringify(list));
    }
  } catch {}
};

// ─── UTM BUILDER ─────────────────────────────────────────────────────────────
const buildUTM = (utm) => {
  if (!utm) return "";
  const p = [];
  if (utm.source) p.push("utm_source=" + encodeURIComponent(utm.source));
  if (utm.medium) p.push("utm_medium=" + encodeURIComponent(utm.medium));
  if (utm.campaign) p.push("utm_campaign=" + encodeURIComponent(utm.campaign));
  if (utm.content) p.push("utm_content=" + encodeURIComponent(utm.content));
  if (utm.term) p.push("utm_term=" + encodeURIComponent(utm.term));
  return p.join("&");
};

// ─── PREVIEW HTML BUILDER ─────────────────────────────────────────────────────
const buildPreviewHTML = (d, full = false) => {
  const s = d.struct || "clasica";
  const slides = (d.hero.slides || []).filter(Boolean);
  const P = full ? "50px" : "24px";
  const hH = (d.form && d.form.showInHero) ? (full ? 520 : 280) : (full ? 460 : 220);

  const hdr = `<header style="background:${d.header.bgColor};padding:0 ${P};height:${full ? 58 : 44}px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
    <span style="color:${d.header.textColor};font-weight:700;font-size:${full ? 19 : 13}px">${d.header.logoUrl ? `<img src="${d.header.logoUrl}" style="height:${full ? (d.header.logoSize||30) : Math.round((d.header.logoSize||30)*0.73)}px;object-fit:contain">` : d.header.logoText}</span>
    <nav style="display:flex;gap:${full ? 20 : 12}px">${(d.header.menu || []).map(m => `<a href="${m.h}" style="color:${d.header.textColor};text-decoration:none;font-size:${full ? 13 : 10}px">${m.l}</a>`).join("")}</nav>
  </header>`;

  const heroFormHTML = (d.form && d.form.showInHero) ? (() => {
    const f = d.form || {};
    const P2 = full ? "10px 12px" : "4px 6px";
    const fields = (f.fields || []).map(field => `<div style="margin-bottom:${full ? 10 : 4}px"><label style="display:block;color:${f.textColor || "#fff"};font-size:${full ? 11 : 7}px;margin-bottom:${full ? 3 : 1}px;opacity:.85">${field.label}${field.required ? '<span style="color:#ef4444;margin-left:2px">*</span>' : ""}</label>${field.type === "textarea" ? `<textarea placeholder="${field.placeholder}" rows="${full ? 3 : 2}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:${P2};color:${f.textColor || "#fff"};font-size:${full ? 12 : 8}px;resize:none;box-sizing:border-box"></textarea>` : `<input type="${field.type || "text"}" placeholder="${field.placeholder}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:${P2};color:${f.textColor || "#fff"};font-size:${full ? 12 : 8}px;box-sizing:border-box">`}</div>`).join("");
    return `${f.title ? `<div style="color:${f.textColor || "#fff"};font-weight:700;font-size:${full ? 20 : 11}px;margin-bottom:${full ? 4 : 2}px">${f.title}</div>` : ""}${f.subtitle ? `<div style="color:${f.textColor || "#ccc"};opacity:.75;font-size:${full ? 13 : 8}px;margin-bottom:${full ? 14 : 6}px">${f.subtitle}</div>` : ""}${fields}${f.privacyText ? `<div style="color:${f.textColor || "#ccc"};font-size:${full ? 10 : 7}px;opacity:.6;line-height:1.5;margin-bottom:${full ? 8 : 3}px">${f.privacyText}</div>` : ""}${f.showPrivacyCheck ? `<label style="display:flex;align-items:center;gap:5px;font-size:${full ? 10 : 7}px;color:${f.textColor || "#ccc"};opacity:.75;margin-bottom:${full ? 10 : 4}px;cursor:pointer"><input type="checkbox"> <span>Acepto recibir otras comunicaciones</span></label>` : ""}<button style="background:${f.btnColor || ACC};color:${f.btnTextColor || DARK};border:none;border-radius:5px;padding:${full ? "10px 22px" : "4px 10px"};font-weight:700;font-size:${full ? 13 : 8}px;cursor:pointer">${f.btnText || "Enviar"}</button>`;
  })() : "";

  const hero = `<section id="hero" style="position:relative;height:${hH}px;overflow:hidden">
    ${slides.map((sl, i) => `<div class="hero-sl" style="position:absolute;inset:0;background:url('${sl}') center/cover;opacity:${i === 0 ? 1 : 0};transition:opacity 1s"></div>`).join("")}
    <div style="position:absolute;inset:0;background:rgba(0,0,0,${d.hero.overlay})"></div>
    <div style="position:absolute;bottom:${full ? 14 : 8}px;left:50%;transform:translateX(-50%);display:flex;gap:5px">
      ${slides.map((_, i) => `<div class="hero-dt" style="width:${full ? 7 : 5}px;height:${full ? 7 : 5}px;border-radius:50%;background:#fff;opacity:${i === 0 ? 1 : 0.4};transition:opacity .3s;cursor:pointer"></div>`).join("")}
    </div>
    ${(d.form && d.form.showInHero)
      ? `<div style="position:relative;z-index:2;height:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding:0 ${full ? 50 : 16}px;gap:${full ? 24 : 12}px">
          <div style="flex:1;text-align:left">
            <h1 style="color:#fff;font-size:${full ? 42 : 19}px;font-weight:700;margin-bottom:${full ? 14 : 7}px;line-height:1.2">${d.hero.title}</h1>
            <p style="color:rgba(255,255,255,.85);font-size:${full ? 15 : 10}px;max-width:420px;margin-bottom:${full ? 26 : 12}px">${d.hero.desc}</p>
            <a href="${d.hero.btnHref}" style="background:${d.hero.btnColor};color:${DARK};padding:${full ? "12px 34px" : "7px 16px"};border-radius:5px;text-decoration:none;font-weight:700;font-size:${full ? 14 : 10}px">${d.hero.btnText}</a>
          </div>
          <div style="background:${(d.form && d.form.bgColor) || DARK};border-radius:${full ? 10 : 7}px;padding:${full ? "22px 24px" : "10px 12px"};width:${full ? 340 : 190}px;flex-shrink:0;overflow-y:auto">
            ${heroFormHTML}
          </div>
        </div>`
      : `<div style="position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 ${full ? 70 : 28}px">
          <h1 style="color:#fff;font-size:${full ? 42 : 20}px;font-weight:700;margin-bottom:${full ? 14 : 8}px;line-height:1.2">${d.hero.title}</h1>
          <p style="color:rgba(255,255,255,.85);font-size:${full ? 15 : 11}px;max-width:480px;margin-bottom:${full ? 26 : 14}px">${d.hero.desc}</p>
          <a href="${d.hero.btnHref}" style="background:${d.hero.btnColor};color:${DARK};padding:${full ? "12px 34px" : "7px 18px"};border-radius:5px;text-decoration:none;font-weight:700;font-size:${full ? 14 : 10}px">${d.hero.btnText}</a>
        </div>`
    }
  </section>`;

  let mid = "";

  if (s === "clasica" || s === "storytelling") {
    mid += `<section id="services" style="background:${d.services.bgColor};padding:${full ? 54 : 24}px ${P}">
      <div style="text-align:center;margin-bottom:${full ? 36 : 16}px">
        <h2 style="color:${d.services.titleColor};font-size:${full ? 30 : 16}px;font-weight:700;margin-bottom:6px">${d.services.title}</h2>
        <p style="color:${d.services.titleColor};opacity:.6;font-size:${full ? 15 : 10}px">${d.services.subtitle}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${Math.min(d.services.cards.length, 4)},1fr);gap:${full ? 16 : 8}px">
        ${d.services.cards.map(c => `<div style="background:${d.services.cardBg};border-radius:9px;padding:${full ? 20 : 10}px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,.06)">
          <div style="font-size:${full ? 24 : 16}px;margin-bottom:8px">${c.icon}</div>
          <div style="color:${d.services.titleColor};font-weight:600;font-size:${full ? 13 : 10}px;margin-bottom:4px">${c.title}</div>
          <div style="color:${d.services.titleColor};opacity:.6;font-size:${full ? 11 : 9}px;line-height:1.5">${c.desc}</div>
        </div>`).join("")}
      </div>
    </section>`;
  }

  if (s === "beneficios") {
    mid += `<section id="services" style="background:${d.benefits.bgColor};padding:${full ? 54 : 24}px ${P}">
      <div style="text-align:center;margin-bottom:${full ? 36 : 16}px">
        <h2 style="color:${d.benefits.titleColor};font-size:${full ? 30 : 16}px;font-weight:700;margin-bottom:6px">${d.benefits.title}</h2>
        <p style="color:${d.benefits.titleColor};opacity:.6;font-size:${full ? 15 : 10}px">${d.benefits.subtitle}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${Math.min(d.benefits.items.length, 3)},1fr);gap:${full ? 20 : 10}px">
        ${d.benefits.items.map(b => `<div style="text-align:center;padding:${full ? 22 : 12}px">
          <div style="width:${full ? 60 : 40}px;height:${full ? 60 : 40}px;border-radius:50%;background:${d.benefits.accent};display:flex;align-items:center;justify-content:center;font-size:${full ? 26 : 18}px;margin:0 auto ${full ? 14 : 8}px">${b.icon}</div>
          <div style="color:${d.benefits.titleColor};font-weight:700;font-size:${full ? 15 : 11}px;margin-bottom:4px">${b.title}</div>
          <div style="color:${d.benefits.titleColor};opacity:.6;font-size:${full ? 12 : 9}px;line-height:1.6">${b.desc}</div>
        </div>`).join("")}
      </div>
    </section>`;
  }

  if (s === "urgencia") {
    const uB = d.urgency.bgColor || DARK, uT = d.urgency.textColor || "#fff";
    mid += `<section id="services" style="background:${uB};padding:${full ? 46 : 22}px ${P}">
      <div style="text-align:center;margin-bottom:${full ? 24 : 12}px">
        <div style="color:${uT};font-size:${full ? 11 : 9}px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;opacity:.6">Oferta especial</div>
        <h2 style="color:${uT};font-size:${full ? 28 : 15}px;font-weight:700;margin-bottom:${full ? 18 : 10}px">${d.urgency.headline}</h2>
        <div style="font-size:${full ? 46 : 26}px;font-weight:700;color:${d.hero.btnColor};font-family:monospace;letter-spacing:4px" id="cdt">00:00:00</div>
        <div style="display:flex;justify-content:center;gap:${full ? 28 : 16}px;margin-top:4px">
          ${["Horas", "Minutos", "Segundos"].map(l => `<span style="color:${uT};font-size:${full ? 10 : 8}px;opacity:.55">${l}</span>`).join("")}
        </div>
      </div>
      <div style="display:flex;justify-content:center;gap:${full ? 24 : 14}px;flex-wrap:wrap;margin-top:${full ? 20 : 10}px">
        ${d.urgency.badges.map(b => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <div style="width:${full ? 44 : 30}px;height:${full ? 44 : 30}px;border-radius:50%;background:${d.hero.btnColor};display:flex;align-items:center;justify-content:center;font-size:${full ? 20 : 14}px">${b.icon}</div>
          <span style="color:${uT};font-size:${full ? 11 : 8}px;opacity:.8">${b.text}</span>
        </div>`).join("")}
      </div>
    </section>`;
  }

  if (s === "profesional") {
    const p = d.profesional || {};
    const accentC = p.heroBtnColor || "#c8f135";
    mid = `
      <section style="background:${p.heroBgColor||DARK};padding:${full?60:30}px ${P}">
        ${p.badge?`<div style="display:inline-block;background:${accentC};color:${DARK};font-size:${full?11:8}px;font-weight:700;padding:${full?"3px 10px":"2px 7px"};border-radius:3px;margin-bottom:${full?16:10}px;text-transform:uppercase;letter-spacing:1px">${p.badge}</div>`:""}
        <h1 style="color:#fff;font-size:${full?40:18}px;font-weight:700;line-height:1.25;margin-bottom:${full?16:10}px;max-width:${full?620:320}px">
          ${p.heroTitle} <span style="color:${accentC}">${p.heroTitleAccent}</span>
        </h1>
        <p style="color:rgba(255,255,255,.75);font-size:${full?15:10}px;line-height:1.7;margin-bottom:${full?28:16}px;max-width:${full?520:300}px">${p.heroDesc}</p>
        <a href="#footer" style="display:inline-block;background:${accentC};color:${p.heroBtnTextColor||DARK};padding:${full?"13px 32px":"7px 16px"};border-radius:5px;text-decoration:none;font-weight:700;font-size:${full?15:10}px">${p.heroBtnText}</a>
      </section>
      <section style="background:${p.ecosystemBgColor||"#fff"};padding:${full?60:26}px ${P}">
        <div style="text-align:center;margin-bottom:${full?40:18}px">
          <div style="font-size:${full?11:8}px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:${full?6:3}px">${p.ecosystemTitle}</div>
          <h2 style="font-size:${full?34:16}px;font-weight:900;color:${DARK};margin-bottom:${full?10:5}px">${p.ecosystemSubtitle}</h2>
          <div style="width:${full?36:20}px;height:3px;background:${p.ecosystemAccent||accentC};margin:0 auto ${full?10:5}px"></div>
          <p style="font-size:${full?15:9}px;color:#6b7280;max-width:500px;margin:0 auto">${p.ecosystemDesc}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:${full?16:7}px">
          ${(p.ecosystemCards||[]).map(c=>`<div style="border:1px solid #e5e7eb;border-radius:8px;padding:${full?18:8}px">
            <div style="font-size:${full?10:7}px;font-weight:700;color:${p.ecosystemAccent||accentC};text-transform:uppercase;margin-bottom:${full?6:3}px;letter-spacing:.5px">${c.tag}</div>
            <div style="font-size:${full?13:9}px;font-weight:700;color:${DARK};margin-bottom:${full?6:3}px">${c.title}</div>
            <div style="font-size:${full?12:8}px;color:#6b7280;line-height:1.5">${c.desc}</div>
          </div>`).join("")}
        </div>
      </section>
      <section style="background:${p.catalogBgColor||"#f8f9fa"};padding:${full?60:26}px ${P}">
        <h2 style="font-size:${full?28:14}px;font-weight:700;color:${DARK};margin-bottom:${full?6:4}px">${p.catalogTitle}</h2>
        <p style="font-size:${full?15:9}px;color:#6b7280;margin-bottom:${full?24:12}px">${p.catalogSubtitle}</p>
        <div style="background:#fff;border-radius:10px;padding:${full?24:12}px;border:1px solid #e5e7eb">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:${full?24:12}px">
            ${(p.catalogCols||[]).map(col=>`<div>
              <div style="font-size:${full?22:14}px;margin-bottom:${full?8:4}px">${col.icon}</div>
              <div style="font-size:${full?15:10}px;font-weight:700;color:${DARK};margin-bottom:${full?10:5}px">${col.title}</div>
              ${(col.items||[]).map(it=>`<div style="display:flex;gap:${full?8:4}px;margin-bottom:${full?6:3}px;align-items:flex-start">
                <div style="width:${full?7:5}px;height:${full?7:5}px;border-radius:50%;background:${accentC};flex-shrink:0;margin-top:${full?4:2}px"></div>
                <span style="font-size:${full?12:8}px;color:#374151;line-height:1.4">${it}</span>
              </div>`).join("")}
            </div>`).join("")}
          </div>
        </div>
      </section>
      <section style="background:${p.phasesBgColor||"#fff"};padding:${full?60:26}px ${P}">
        <div style="text-align:center;margin-bottom:${full?40:18}px">
          <h2 style="font-size:${full?28:14}px;font-weight:700;color:${DARK};margin-bottom:${full?8:4}px">${p.phasesTitle}</h2>
          <div style="width:${full?36:20}px;height:3px;background:${accentC};margin:0 auto ${full?8:4}px"></div>
          <p style="font-size:${full?15:9}px;color:#6b7280">${p.phasesSubtitle}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:${full?20:10}px">
          ${(p.phases||[]).map(ph=>`<div style="text-align:center;padding:${full?20:10}px">
            <div style="width:${full?52:32}px;height:${full?52:32}px;border-radius:50%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:${full?22:14}px;margin:0 auto ${full?12:6}px">${ph.icon}</div>
            <div style="display:inline-block;background:${accentC};color:${DARK};font-size:${full?10:7}px;font-weight:700;padding:${full?"2px 10px":"1px 6px"};border-radius:10px;margin-bottom:${full?8:4}px">Fase ${ph.num}</div>
            <div style="font-size:${full?14:9}px;font-weight:700;color:${DARK};margin-bottom:${full?6:3}px">${ph.title}</div>
            <div style="font-size:${full?12:8}px;color:#6b7280;line-height:1.5">${ph.desc}</div>
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (s === "storytelling") {
    mid += `<section id="about" style="background:${d.story.bgColor};padding:${full ? 54 : 26}px ${P}">
      <h2 style="color:${d.story.titleColor};font-size:${full ? 28 : 15}px;font-weight:700;text-align:center;margin-bottom:${full ? 36 : 18}px">${d.story.title}</h2>
      <div style="max-width:${full ? 600 : 360}px;margin:0 auto;position:relative">
        <div style="position:absolute;left:${full ? 18 : 11}px;top:0;bottom:0;width:2px;background:${d.hero.btnColor}"></div>
        ${d.story.steps.map(st => `<div style="display:flex;gap:${full ? 18 : 10}px;margin-bottom:${full ? 24 : 14}px;align-items:flex-start">
          <div style="width:${full ? 36 : 24}px;height:${full ? 36 : 24}px;border-radius:50%;background:${d.hero.btnColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${full ? 14 : 10}px;color:${DARK};flex-shrink:0;z-index:1">${st.num}</div>
          <div style="flex:1;background:#f9f9f9;border-radius:7px;padding:${full ? 14 : 8}px">
            <div style="font-weight:700;color:${d.story.titleColor};font-size:${full ? 14 : 11}px;margin-bottom:3px">${st.title}</div>
            <div style="color:${d.story.titleColor};opacity:.65;font-size:${full ? 12 : 9}px;line-height:1.6">${st.desc}</div>
          </div>
        </div>`).join("")}
      </div>
      <div style="background:${d.hero.btnColor};border-radius:9px;padding:${full ? 24 : 14}px;margin-top:${full ? 28 : 14}px;max-width:${full ? 560 : 340}px;margin-left:auto;margin-right:auto">
        <div style="font-size:${full ? 32 : 20}px;color:${DARK};line-height:.8;margin-bottom:7px">"</div>
        <p style="color:${DARK};font-size:${full ? 15 : 11}px;font-style:italic;line-height:1.65;margin-bottom:7px">${d.story.quote}</p>
        <div style="color:${DARK};font-size:${full ? 12 : 9}px;font-weight:600;opacity:.75">${d.story.quoteAuthor}</div>
      </div>
    </section>`;
  } else if (s === "urgencia") {
    mid += `<section id="about" style="background:#fff;padding:${full ? 44 : 22}px ${P}">
      <div style="max-width:${full ? 540 : 340}px;margin:0 auto">
        <h3 style="font-size:${full ? 20 : 13}px;font-weight:700;color:${DARK};margin-bottom:${full ? 18 : 10}px">${d.urgency.listTitle}</h3>
        ${d.urgency.items.map(it => `<div style="display:flex;gap:${full ? 10 : 6}px;align-items:center;margin-bottom:${full ? 10 : 6}px">
          <div style="width:${full ? 20 : 14}px;height:${full ? 20 : 14}px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:${full ? 11 : 8}px;color:#fff;font-weight:700">✓</div>
          <span style="color:#374151;font-size:${full ? 13 : 10}px">${it}</span>
        </div>`).join("")}
        <div style="margin-top:${full ? 22 : 12}px;text-align:center">
          <a href="${d.hero.btnHref}" style="display:inline-block;background:${d.hero.btnColor};color:${DARK};padding:${full ? "13px 36px" : "8px 20px"};border-radius:5px;text-decoration:none;font-weight:700;font-size:${full ? 15 : 11}px">${d.hero.btnText}</a>
        </div>
      </div>
    </section>`;
  } else {
    mid += `<section id="about" style="background:${d.about.bgColor};padding:${full ? 54 : 26}px ${P}">
      <div style="display:flex;gap:${full ? 44 : 18}px;align-items:center;flex-direction:${d.about.imgLeft ? "row" : "row-reverse"}">
        <div style="flex:1">${d.about.mediaType === "video" && d.about.videoUrl
          ? `<iframe src="${d.about.videoUrl}" style="width:100%;height:${full ? 240 : 130}px;border-radius:9px;border:none" allowfullscreen></iframe>`
          : `<img src="${d.about.mediaUrl}" style="width:100%;border-radius:9px;object-fit:cover;max-height:${full ? 280 : 150}px;display:block" />`
        }</div>
        <div style="flex:1">
          <h2 style="color:${d.about.textColor};font-size:${full ? 28 : 15}px;font-weight:700;margin-bottom:${full ? 14 : 8}px">${d.about.title}</h2>
          ${d.about.desc.split("\n\n").map(p => `<p style="color:${d.about.textColor};opacity:.75;font-size:${full ? 15 : 10}px;line-height:1.75;margin-bottom:8px">${p}</p>`).join("")}
        </div>
      </div>
    </section>`;
  }

  const formHTML = (form, full) => {
    if (!form) return "";
    if (form.type === "embed" && form.embedCode) return `<div style="padding:${full?"20px":"10px"}">${form.embedCode}</div>`;
    const P2 = full ? "12px 14px" : "5px 7px";
    const fields = (form.fields || []).map(field => `
      <div style="margin-bottom:${full?12:5}px">
        <label style="display:block;color:${form.textColor||"#fff"};font-size:${full?12:8}px;margin-bottom:${full?4:2}px;opacity:.85">${field.label}${field.required?'<span style="color:#ef4444;margin-left:2px">*</span>':""}</label>
        ${field.type==="textarea"
          ? `<textarea placeholder="${field.placeholder}" rows="${full?3:2}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:${P2};color:${form.textColor||"#fff"};font-size:${full?13:9}px;resize:none"></textarea>`
          : `<input type="${field.type||"text"}" placeholder="${field.placeholder}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:${P2};color:${form.textColor||"#fff"};font-size:${full?13:9}px">`
        }
      </div>`).join("");
    return `
      ${form.title?`<h3 style="color:${form.textColor||"#fff"};font-weight:700;font-size:${full?22:12}px;margin-bottom:${full?6:3}px">${form.title}</h3>`:""}
      ${form.subtitle?`<p style="color:${form.textColor||"#ccc"};opacity:.75;font-size:${full?15:9}px;margin-bottom:${full?16:8}px">${form.subtitle}</p>`:""}
      ${fields}
      ${form.privacyText?`<p style="color:${form.textColor||"#ccc"};font-size:${full?11:8}px;opacity:.6;line-height:1.5;margin-bottom:${full?10:5}px">${form.privacyText}</p>`:""}
      ${form.showPrivacyCheck?`<label style="display:flex;align-items:center;gap:6px;font-size:${full?11:8}px;color:${form.textColor||"#ccc"};opacity:.75;margin-bottom:${full?12:6}px;cursor:pointer"><input type="checkbox"> <span>Acepto recibir otras comunicaciones</span></label>`:""}
      <button style="background:${form.btnColor||ACC};color:${form.btnTextColor||DARK};border:none;border-radius:5px;padding:${full?"11px 28px":"5px 12px"};font-weight:700;font-size:${full?14:9}px;cursor:pointer">${form.btnText||"Enviar"}</button>
    `;
  };

  const showFooterForm = d.form && d.form.showInFooter;
  const ftr = s === "profesional"
    ? `<footer id="footer" style="background:${d.footer.bgColor};padding:${full?46:22}px ${P} ${full?20:12}px">
        ${showFooterForm
          ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:${full?40:20}px;margin-bottom:${full?24:12}px">
              <div>
                <div style="color:#fff;font-weight:700;font-size:${full?20:12}px;margin-bottom:${full?8:5}px">${d.header.logoText}</div>
                <p style="color:${d.footer.textColor};font-size:${full?15:8}px;line-height:1.65;margin-bottom:${full?12:6}px">${d.footer.desc}</p>
                <div style="color:${d.footer.textColor};font-size:${full?12:8}px;margin-bottom:${full?5:3}px">📍 ${d.footer.address}</div>
                <div style="color:${d.footer.textColor};font-size:${full?12:8}px">${d.footer.email}</div>
              </div>
              <div>${formHTML(d.form, full)}</div>
            </div>`
          : `<div style="margin-bottom:${full?24:12}px">
              <div style="color:#fff;font-weight:700;font-size:${full?20:12}px;margin-bottom:${full?8:5}px">${d.header.logoText}</div>
              <p style="color:${d.footer.textColor};font-size:${full?15:8}px;line-height:1.65;margin-bottom:${full?12:6}px">${d.footer.desc}</p>
              <div style="color:${d.footer.textColor};font-size:${full?12:8}px;margin-bottom:${full?5:3}px">📍 ${d.footer.address}</div>
              <div style="color:${d.footer.textColor};font-size:${full?12:8}px">${d.footer.email}</div>
            </div>`
        }
        <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:${full?10:6}px;text-align:center">
          <span style="color:${d.footer.textColor};font-size:${full?10:7}px;opacity:.6">${d.footer.copy}</span>
        </div>
      </footer>`
    : `<footer id="footer" style="background:${d.footer.bgColor};padding:${full?46:22}px ${P} ${full?20:12}px">
        ${showFooterForm
          ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:${full?36:16}px;margin-bottom:${full?24:12}px">
              <div>
                <div style="color:#fff;font-weight:700;font-size:${full?17:12}px;margin-bottom:7px">${d.footer.company}</div>
                <p style="color:${d.footer.textColor};font-size:${full?15:9}px;line-height:1.65;margin-bottom:${full?10:5}px">${d.footer.desc}</p>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px;margin-bottom:4px">${d.footer.email}</div>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px;margin-bottom:4px">${d.footer.phone}</div>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px">${d.footer.address}</div>
              </div>
              <div>${formHTML(d.form, full)}</div>
            </div>`
          : `<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:${full?36:16}px;margin-bottom:${full?24:12}px">
              <div><div style="color:#fff;font-weight:700;font-size:${full?17:12}px;margin-bottom:7px">${d.footer.company}</div>
                <p style="color:${d.footer.textColor};font-size:${full?15:9}px;line-height:1.65">${d.footer.desc}</p></div>
              <div><div style="color:#fff;font-weight:600;font-size:${full?10:8}px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Contacto</div>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px;margin-bottom:4px">${d.footer.email}</div>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px;margin-bottom:4px">${d.footer.phone}</div>
                <div style="color:${d.footer.textColor};font-size:${full?11:8}px">${d.footer.address}</div></div>
              <div><div style="color:#fff;font-weight:600;font-size:${full?10:8}px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Navegación</div>
                ${(d.header.menu || []).map(m => `<div style="margin-bottom:5px"><a href="${m.h}" style="color:${d.footer.textColor};font-size:${full?11:8}px;text-decoration:none;opacity:.8">${m.l}</a></div>`).join("")}
              </div>
            </div>`
        }
        <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:10px;text-align:center">
          <span style="color:${d.footer.textColor};font-size:${full?10:8}px;opacity:.6">${d.footer.copy}</span>
        </div>
      </footer>`;

  if (s === "unab") {
    const u = d.unab || {};
    const bgImg = slides[0] || "";
    const unabForm = (form) => {
      if (!form) return "";
      if (form.type === "embed" && form.embedCode) return `<div>${form.embedCode}</div>`;
      const ff = (form.fields || []).map(f => `<div style="margin-bottom:${full?10:4}px"><input type="${f.type === "textarea" ? "text" : f.type || "text"}" placeholder="${f.placeholder}${f.required?" *":""}" style="width:100%;padding:${full?"8px 12px":"4px 7px"};border-radius:4px;border:1px solid #dee2e6;font-size:${full?13:8}px;background:#fff;color:#1a2535;box-sizing:border-box"></div>`).join("");
      return `<div style="padding:${full?"20px 22px":"9px 10px"};background:rgba(255,255,255,0.13);border-radius:${full?8:5}px;backdrop-filter:blur(6px)">
        ${form.title?`<h3 style="color:#fff;font-size:${full?18:10}px;font-weight:700;margin-bottom:${full?6:3}px">${form.title}</h3>`:""}
        ${form.subtitle?`<p style="color:rgba(255,255,255,.8);font-size:${full?12:7}px;margin-bottom:${full?12:5}px">${form.subtitle}</p>`:""}
        ${ff}
        ${form.privacyText?`<p style="color:rgba(255,255,255,.65);font-size:${full?10:6}px;margin-bottom:${full?8:3}px">${form.privacyText}</p>`:""}
        <button style="width:100%;padding:${full?"10px 0":"5px 0"};background:${form.btnColor||DARK};color:${form.btnTextColor||"#fff"};border:none;border-radius:${full?6:4}px;font-size:${full?14:8}px;font-weight:700;cursor:pointer">${form.btnText||"Enviar"}</button>
      </div>`;
    };
    return `<div style="font-family:'Segoe UI',sans-serif;width:100%;position:relative;${bgImg?`background-image:url('${bgImg}');background-size:cover;background-position:center;`:`background:${d.header.bgColor};`}">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,${d.hero.overlay||0.5})"></div>
      <div style="position:relative;z-index:2">
        <div class="container-fluid" style="padding:${full?"28px 50px 22px":"14px 20px 10px"}">
          <div class="row align-items-start g-2">
            <div class="col-8 col-md-9">
              <div style="display:flex;align-items:flex-start;gap:${full?18:10}px;flex-wrap:wrap">
                ${d.header.logoUrl?`<img src="${d.header.logoUrl}" style="height:${full?(d.header.logoSize||80):Math.round((d.header.logoSize||80)*0.6)}px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.15);padding:4px" alt="logo">`:`<div style="background:rgba(255,255,255,.2);border-radius:6px;padding:${full?"8px 14px":"5px 8px"};color:#fff;font-weight:700;font-size:${full?14:10}px;flex-shrink:0">${d.header.logoText}</div>`}
                <h1 style="color:#fff;font-size:${full?52:20}px;font-weight:900;line-height:1.1;margin:0;max-width:${full?520:220}px">${u.heroTitle||"Es momento de llegar más lejos"}</h1>
              </div>
            </div>
            <div class="col-4 col-md-3 text-end">
              <div style="color:#fff;font-size:${full?12:7}px;opacity:.9;text-transform:uppercase;letter-spacing:2px">${u.admisionLabel||"Admisión"}</div>
              <div style="color:#fff;font-size:${full?54:24}px;font-weight:900;line-height:1">${u.admisionYear||"2026"}</div>
            </div>
          </div>
        </div>
        <div class="container-fluid" style="padding:${full?"0 50px 32px":"0 20px 14px"}">
          <div class="row g-3 justify-content-center">
            <div class="col-12 col-md-5">
              <div style="background:${u.programsBgColor||"#fff"};border-radius:${full?8:5}px;overflow:hidden">
                <div style="background:${u.programsTitleBg||DARK};padding:${full?"10px 16px":"6px 10px"};text-align:center">
                  <div style="color:${u.programsTitleColor||"#fff"};font-size:${full?17:10}px;font-weight:700">${u.programsTitle||"Carreras y Programas"}</div>
                </div>
                <div style="padding:${full?"14px 18px":"7px 10px"}">
                  ${(u.categories||[]).map(cat=>`<div style="margin-bottom:${full?12:5}px"><div style="font-size:${full?13:8}px;font-weight:700;color:${u.programsTextColor||DARK};margin-bottom:${full?5:2}px">${cat.name}</div><ul style="margin:0;padding-left:${full?16:10}px">${(cat.items||[]).map(item=>`<li style="font-size:${full?11:7}px;color:${u.programsTextColor||"#374151"};margin-bottom:${full?3:1}px;line-height:1.4">${item}</li>`).join("")}</ul></div>`).join("")}
                  ${u.programsFooterText?`<div style="margin-top:${full?12:5}px;padding-top:${full?8:4}px;border-top:1px solid #e5e7eb;text-align:center;font-size:${full?11:7}px;font-weight:700;color:${u.programsFooterColor||DARK}">${u.programsFooterText}</div>`:""}
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 offset-md-3">
              ${unabForm(d.form)}
            </div>
          </div>
        </div>
        <div style="background:${u.accreditationBgColor||DARK}">
          <div class="container-fluid" style="padding:${full?"16px 50px":"8px 20px"}">
            <div class="row justify-content-center align-items-center g-2 g-md-4">
              ${(u.accreditations||[]).map(a=>`<div class="col-auto">${a.logoUrl?`<img src="${a.logoUrl}" style="height:${full?40:22}px;object-fit:contain">`:`<div style="color:#fff;text-align:center;font-size:${full?9:6}px;opacity:.85"><div style="font-size:${full?18:10}px;font-weight:900">${a.icon||""}</div>${a.text}</div>`}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  return `<div style="font-family:'Segoe UI',sans-serif;width:100%">${hdr}${hero}${mid}${ftr}</div>`;
};

// ─── EXPORT HTML ──────────────────────────────────────────────────────────────
const buildExportHTML = (d) => {
  const utm = buildUTM(d.utm);
  const slides = (d.hero.slides || []).filter(Boolean);
  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif}.hs{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1s}.hs.a{opacity:1}</style>
</head><body>
${buildPreviewHTML(d, true).replace(/class="hero-sl"/g, 'class="hero-sl hs"')}
<script>
var s=0,sl=document.querySelectorAll('.hs');
if(sl.length>1)setInterval(()=>{sl[s].classList.remove('a');s=(s+1)%sl.length;sl[s].classList.add('a');},3500);
var utm='${utm}';
if(utm){document.querySelectorAll('a[href]').forEach(a=>{try{if(!a.getAttribute('href').startsWith('#')){a.href+=(a.href.includes('?')?'&':'?')+utm;}}catch(e){}});}
var cd=document.getElementById('cdt');
if(cd){var en=Date.now()+7200000;setInterval(()=>{var r=Math.max(0,en-Date.now()),h=Math.floor(r/3600000),m=Math.floor((r%3600000)/60000),sc=Math.floor((r%60000)/1000);cd.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sc).padStart(2,'0');},1000);}
<\/script>
<!-- UTM: ${utm || "sin parámetros"} -->
</body></html>`;
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div style={{
    position: "fixed", top: 62, right: 16, zIndex: 9999,
    padding: "9px 18px", borderRadius: 8, fontWeight: 500, fontSize: 13,
    color: "#fff", background: type === "error" ? "#ef4444" : type === "info" ? "#3b82f6" : "#22c55e",
    boxShadow: "0 4px 20px rgba(0,0,0,.2)",
  }}>{msg}</div>
);

const parseColorVal = (v) => {
  if (!v) return { hex: "#000000", alpha: 1 };
  const m = v.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (m) {
    const hex = "#" + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
    return { hex, alpha: m[4] !== undefined ? parseFloat(m[4]) : 1 };
  }
  if (v.startsWith("#")) return { hex: v.slice(0, 7), alpha: 1 };
  return { hex: "#000000", alpha: 1 };
};
const rgbaOut = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return alpha >= 1 ? hex : `rgba(${r},${g},${b},${+alpha.toFixed(2)})`;
};

const ColorRow = ({ label, value, onChange }) => {
  const { hex, alpha } = parseColorVal(value);
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="color" value={hex} onChange={e => onChange(rgbaOut(e.target.value, alpha))}
          style={{ width: 30, height: 26, padding: 2, border: `1px solid ${UI_INPUT_BORDER}`, borderRadius: 6, cursor: "pointer", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: UI_TEXT, flex: 1, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, color: UI_MUTED, width: 30, textAlign: "right", flexShrink: 0 }}>{Math.round(alpha * 100)}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, paddingLeft: 38 }}>
        <span style={{ fontSize: 9, color: UI_BORDER }}>0</span>
        <input type="range" min="0" max="100" value={Math.round(alpha * 100)}
          onChange={e => onChange(rgbaOut(hex, parseInt(e.target.value) / 100))}
          style={{ flex: 1, height: 3, accentColor: UI_PRIMARY, cursor: "pointer" }} />
        <span style={{ fontSize: 9, color: UI_BORDER }}>100</span>
      </div>
    </div>
  );
};

const inputStyle = { width: "100%", padding: "7px 10px", border: `1px solid ${UI_INPUT_BORDER}`, borderRadius: UI_RADIUS, fontSize: 12, outline: "none", color: UI_TEXT, background: UI_CARD, fontFamily: UI_FONT };
const labelStyle = { fontSize: 10, color: UI_MUTED, fontWeight: 600, letterSpacing: ".4px", display: "block", marginBottom: 4 };

const Field = ({ label, value, onChange, textarea, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={labelStyle}>{label}</label>
    {textarea
      ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...inputStyle, resize: "vertical", minHeight: 56 }} />
      : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={inputStyle} />
    }
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={labelStyle}>{label}</label>
    <select value={value || ""} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: "pointer" }}>
      {options.map(o => <option key={o} value={o}>{o || "— seleccionar —"}</option>)}
    </select>
  </div>
);

const Panel = ({ title, children }) => (
  <div style={{ background: UI_CARD, borderRadius: UI_RADIUS, marginBottom: 10, overflow: "hidden", boxShadow: UI_SHADOW }}>
    <div style={{ padding: "9px 14px", borderBottom: `1px solid ${UI_BORDER}`, fontSize: 10, fontWeight: 700, color: UI_MUTED, letterSpacing: ".6px", textTransform: "uppercase" }}>{title}</div>
    <div style={{ padding: "12px 14px" }}>{children}</div>
  </div>
);

// Image upload field with URL + file upload
const ImgField = ({ label, value, onChange }) => {
  const fileRef = useRef();
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => onChange(e.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 2 }}>{label}</label>}
      <div style={{ display: "flex", gap: 4 }}>
        <input type="text" value={value?.startsWith("data:") ? "[imagen subida]" : (value || "")}
          onChange={e => !e.target.value.startsWith("[") && onChange(e.target.value)}
          placeholder="https://... o sube imagen"
          style={{ flex: 1, padding: "4px 7px", border: "1px solid #e5e7eb", borderRadius: 5, fontSize: 11, outline: "none" }} />
        <button onClick={() => fileRef.current?.click()}
          style={{ padding: "4px 9px", background: ACC, color: DARK, border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
          ↑ Subir
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => handleFile(e.target.files?.[0])} />
      {value && <img src={value} alt="" style={{ width: "100%", height: 44, objectFit: "cover", borderRadius: 4, marginTop: 3 }} onError={e => e.target.style.display = "none"} />}
    </div>
  );
};

// ─── PRO FORM COMPONENT ───────────────────────────────────────────────────────
const ProForm = ({ form, compact = false }) => {
  if (!form) return null;
  const F = !compact;
  if (form.type === "embed" && form.embedCode) {
    return (
      <div style={{ padding: compact ? "8px" : "16px" }}
        dangerouslySetInnerHTML={{ __html: form.embedCode }} />
    );
  }
  return (
    <div>
      {form.title && <h3 style={{ color: form.textColor || "#fff", fontWeight: 700, fontSize: F ? 22 : 13, marginBottom: F ? 6 : 4 }}>{form.title}</h3>}
      {form.subtitle && <p style={{ color: form.textColor || "#ccc", opacity: .75, fontSize: F ? 13 : 9, marginBottom: F ? 18 : 10 }}>{form.subtitle}</p>}
      {(form.fields || []).map((field, i) => (
        <div key={i} style={{ marginBottom: F ? 12 : 6 }}>
          <label style={{ display: "block", color: form.textColor || "#fff", fontSize: F ? 12 : 8, marginBottom: F ? 4 : 2, opacity: .85 }}>{field.label}{field.required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}</label>
          {field.type === "textarea"
            ? <textarea placeholder={field.placeholder} rows={F ? 3 : 2}
                style={{ width: "100%", background: "transparent", border: `1px solid rgba(255,255,255,.25)`, borderRadius: 4, padding: F ? "8px 10px" : "3px 6px", color: form.textColor || "#fff", fontSize: F ? 13 : 9, outline: "none", resize: "none" }} />
            : <input type={field.type || "text"} placeholder={field.placeholder}
                style={{ width: "100%", background: "transparent", border: `1px solid rgba(255,255,255,.25)`, borderRadius: 4, padding: F ? "8px 10px" : "3px 6px", color: form.textColor || "#fff", fontSize: F ? 13 : 9, outline: "none" }} />
          }
        </div>
      ))}
      {form.privacyText && (
        <p style={{ color: form.textColor || "#ccc", fontSize: F ? 11 : 8, opacity: .6, lineHeight: 1.5, marginBottom: F ? 10 : 6 }}>{form.privacyText}</p>
      )}
      {form.showPrivacyCheck && (
        <div style={{ marginBottom: F ? 12 : 6 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: F ? 11 : 8, color: form.textColor || "#ccc", opacity: .75, cursor: "pointer" }}>
            <input type="checkbox" style={{ marginTop: 2, accentColor: form.btnColor || ACC }} />
            <span>Acepto recibir otras comunicaciones</span>
          </label>
        </div>
      )}
      <button style={{ background: form.btnColor || ACC, color: form.btnTextColor || DARK, border: "none", borderRadius: 5, padding: F ? "11px 28px" : "5px 14px", fontWeight: 700, fontSize: F ? 14 : 9, cursor: "pointer", marginTop: F ? 4 : 2 }}>
        {form.btnText || "Enviar"}
      </button>
    </div>
  );
};

// ─── STRUCTURE SELECTOR ───────────────────────────────────────────────────────
const StructureSelector = ({ selected, onSelect, onApply }) => {
  const structs = [
    { id: "clasica", num: 1, name: "Estructura Clásica", desc: "Ideal para presentar un producto o servicio.", pop: true },
    { id: "beneficios", num: 2, name: "Estructura de Beneficios", desc: "Enfocada en destacar los beneficios clave.", pop: false },
    { id: "storytelling", num: 3, name: "Estructura Storytelling", desc: "Cuenta una historia para conectar y convertir.", pop: false },
    { id: "urgencia", num: 4, name: "Estructura de Urgencia", desc: "Genera acción inmediata con escasez o tiempo limitado.", pop: false },
    { id: "profesional", num: 5, name: "Estructura Profesional", desc: "Ecosistema completo con catálogo, fases y formulario en footer.", pop: false },
    { id: "unab", num: 6, name: "Formato Universidad", desc: "Portada universitaria: logo + título, programas, formulario y acreditaciones.", pop: false },
  ];
  return (
    <div style={{ flex: 1, overflow: "auto", background: UI_BG, padding: 28, fontFamily: UI_FONT }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: UI_TEXT, marginBottom: 5 }}>Elige la estructura de tu landing</h1>
        <p style={{ fontSize: 13, color: UI_MUTED, maxWidth: 480 }}>Selecciona la plantilla que mejor se adapte a tu objetivo. Podrás personalizar todo en el editor.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, maxWidth: 1040, marginBottom: 24 }}>
        {structs.map((s, i) => (
          <div key={s.id} onClick={() => onSelect(i)}
            style={{ background: UI_CARD, borderRadius: UI_RADIUS + 2, border: `2px solid ${selected === i ? UI_PRIMARY : UI_BORDER}`, overflow: "hidden", cursor: "pointer", transition: "all .2s",
              boxShadow: selected === i ? UI_SHADOW_MD : UI_SHADOW,
              transform: selected === i ? "translateY(-3px)" : "none" }}>
            <div style={{ padding: "13px 13px 7px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: selected === i ? UI_PRIMARY : "#ede9ff", color: selected === i ? "#fff" : UI_PRIMARY, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: UI_TEXT, lineHeight: 1.3 }}>{s.name}</div>
                  {s.pop && <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 20 }}>Popular</span>}
                </div>
              </div>
              <div style={{ fontSize: 10, color: UI_MUTED, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
            <WireFrame id={s.id} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: UI_MUTED }}>Seleccionada: <strong style={{ color: UI_TEXT }}>{structs[selected]?.name}</strong></span>
        <button onClick={onApply}
          style={{ padding: "10px 28px", borderRadius: UI_RADIUS, border: "none", background: UI_PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: UI_SHADOW_MD }}>
          Usar esta estructura y editar →
        </button>
      </div>
    </div>
  );
};

const WireFrame = ({ id }) => {
  const s = { background: "#f9f9f9", borderRadius: 7, padding: 7, margin: "0 7px 7px" };
  const hdr = <div style={{ background: DARK, borderRadius: 4, height: 16, marginBottom: 4, display: "flex", alignItems: "center", padding: "0 5px", gap: 3 }}>
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACC }} />
    <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,.3)", borderRadius: 1 }} />
  </div>;
  const heroWf = <div style={{ background: ACC, borderRadius: 4, height: 38, marginBottom: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
    <div style={{ background: "rgba(26,37,53,.5)", borderRadius: 1, height: 3, width: "68%" }} />
    <div style={{ background: "rgba(26,37,53,.5)", borderRadius: 1, height: 3, width: "44%" }} />
    <div style={{ background: DARK, borderRadius: 3, height: 7, width: 26, marginTop: 2 }} />
  </div>;
  const line = (w = "100%") => <div style={{ background: "#e5e7eb", borderRadius: 2, height: 4, marginBottom: 2, width: w }} />;
  const circle = (size = 12, bg = ACC) => <div style={{ width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0 }} />;
  const footer = <div style={{ background: DARK, borderRadius: 4, height: 18, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "rgba(255,255,255,.2)", borderRadius: 2, height: 2, width: 44 }} />
  </div>;

  return (
    <div style={s}>
      {hdr}{heroWf}
      {id === "clasica" && <>
        <div style={{ display: "flex", gap: 4, marginBottom: 4, height: 24 }}>
          <div style={{ background: "#e5e7eb", borderRadius: 4, flex: 1 }} />
          <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>{line("65%")}{line("45%")}<div style={{ width: 24, height: 5, background: ACC, borderRadius: 2, opacity: .7 }} /></div>
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
          {[1,2,3].map(k => <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>{circle(12, DARK)}{line()}</div>)}
        </div>
        <div style={{ display: "flex", gap: 3, height: 18, marginBottom: 3 }}><div style={{ background: DARK, borderRadius: 3, width: 38 }} /><div style={{ background: "#e5e7eb", borderRadius: 3, flex: 1 }} /></div>
      </>}
      {id === "beneficios" && <>
        <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, color: DARK, margin: "3px 0" }}>Beneficios</div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 4 }}>{[1,2,3].map(k => <div key={k} style={{ width: 14, height: 14, borderRadius: "50%", background: ACC }} />)}</div>
        <div style={{ background: "#e5e7eb", borderRadius: 4, height: 22, marginBottom: 3, display: "flex", alignItems: "center", padding: 3 }}>
          <div style={{ flex: 1, height: 4, background: "#ccc", borderRadius: 2, margin: "0 3px" }} />
          <div style={{ width: 22, height: 6, background: ACC, borderRadius: 2, opacity: .7 }} />
        </div>
        <div style={{ display: "flex", gap: 3 }}>{circle(15)}<div style={{ flex: 1 }}>{line()}{line("55%")}<div style={{ display: "flex", gap: 1, marginTop: 1 }}>{[1,2,3,4,5].map(k => <div key={k} style={{ width: 4, height: 4, background: ACC, borderRadius: 1 }} />)}</div></div></div>
      </>}
      {id === "storytelling" && <>
        <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", gap: 4 }}>
          {[1,2,3].map(n => <div key={n} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: ACC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, fontWeight: 700, color: DARK, flexShrink: 0 }}>{n}</div>
            <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 3, height: 16 }} />
          </div>)}
        </div>
        <div style={{ background: ACC, borderRadius: 4, padding: 4, marginBottom: 3 }}>{line()}{line("70%")}</div>
        <div style={{ display: "flex", gap: 3 }}><div style={{ background: DARK, borderRadius: 3, width: 36, height: 18, flexShrink: 0 }} /><div style={{ background: "#e5e7eb", borderRadius: 3, flex: 1, height: 18 }} /></div>
      </>}
      {id === "urgencia" && <>
        <div style={{ background: DARK, borderRadius: 4, padding: 4, marginBottom: 4 }}>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,.6)", textAlign: "center", marginBottom: 2 }}>Tiempo limitado</div>
          <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center" }}>
            {["02","15","37"].map((v, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <span style={{ background: "#fff", borderRadius: 2, width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, fontWeight: 700, color: DARK }}>{v}</span>
              {i < 2 && <span style={{ color: "#fff", fontWeight: 700, fontSize: 8 }}>:</span>}
            </span>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 3 }}>
          {[1,2,3].map(k => <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>{circle(12)}{line()}</div>)}
        </div>
        <div style={{ display: "flex", gap: 3 }}><div style={{ background: DARK, borderRadius: 3, width: 36, height: 18, flexShrink: 0 }} /><div style={{ background: "#e5e7eb", borderRadius: 3, flex: 1, height: 18 }} /></div>
      </>}
      {id === "profesional" && <>
        <div style={{ background: "#f0f0f0", borderRadius: 3, padding: "3px 4px", marginBottom: 3 }}>
          <div style={{ background: "#c8f135", borderRadius: 2, height: 5, width: "55%", marginBottom: 2 }} />
          {line("90%")}{line("70%")}{line("50%")}
          <div style={{ background: "#c8f135", borderRadius: 2, height: 6, width: 28, marginTop: 2 }} />
        </div>
        <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
          {[1,2,3,4].map(k => <div key={k} style={{ flex: 1, background: "#f3f4f6", borderRadius: 3, padding: "2px 2px" }}>
            <div style={{ background: "#c8f135", borderRadius: 1, height: 3, width: "60%", marginBottom: 1 }} />
            {line()}{line("70%")}
          </div>)}
        </div>
        <div style={{ background: "#f8f9fa", borderRadius: 3, padding: 3, marginBottom: 3 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[1,2,3].map(k => <div key={k} style={{ flex: 1 }}>{line()}{line("80%")}{line("60%")}</div>)}
          </div>
        </div>
        <div style={{ background: DARK, borderRadius: 3, padding: 3 }}>
          <div style={{ display: "flex", gap: 2 }}>
            <div style={{ flex: 1 }}>{line()}{line("70%")}</div>
            <div style={{ flex: 1 }}>
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 2, height: 4, marginBottom: 2 }} />
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 2, height: 4, marginBottom: 2 }} />
              <div style={{ background: "#c8f135", borderRadius: 2, height: 6, width: "60%" }} />
            </div>
          </div>
        </div>
      </>}
      {id === "unab" && <>
        <div style={{ background: DARK, borderRadius: 4, height: 26, marginBottom: 3, display: "flex", alignItems: "center", padding: "0 5px", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,.3)" }} />
          <div style={{ flex: 1 }}>{line("75%")}{line("55%")}</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: "rgba(255,255,255,.25)", borderRadius: 1, height: 3, width: 18, marginBottom: 2 }} />
            <div style={{ background: "#fff", borderRadius: 1, height: 6, width: 14 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 3, height: 36 }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 3, padding: 3 }}>
            <div style={{ background: DARK, borderRadius: 2, height: 5, width: "80%", margin: "0 auto 2px" }} />
            {[1,2,3].map(k=><div key={k} style={{ display:"flex",gap:1,marginBottom:1 }}><div style={{ width:3,height:3,borderRadius:"50%",background:ACC,flexShrink:0,marginTop:1 }} /><div style={{ flex:1,height:3,background:"#e5e7eb",borderRadius:1 }} /></div>)}
          </div>
          <div style={{ flex: 1, padding: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {[1,2,3,4].map(k=><div key={k} style={{ height:4,background:"rgba(255,255,255,.25)",borderRadius:2 }} />)}
            <div style={{ height:5,background:ACC,borderRadius:2,width:"70%" }} />
          </div>
        </div>
        <div style={{ background: DARK, borderRadius: 3, height: 8, display: "flex", gap: 4, alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
          {[1,2,3,4,5].map(k=><div key={k} style={{ flex:1,height:4,background:"rgba(255,255,255,.25)",borderRadius:1 }} />)}
        </div>
      </>}
      {footer}
    </div>
  );
};

// ─── EDITOR SIDEBAR ──────────────────────────────────────────────────────────
const EditorSidebar = ({ data, setData, onSave }) => {
  const [tab, setTab] = useState("header");
  const s = data.struct || "clasica";

  const upd = (section, key, val) => setData(d => ({ ...d, [section]: { ...d[section], [key]: val } }));
  const updDeep = (path, val) => setData(d => {
    const parts = path.split(".");
    const copy = JSON.parse(JSON.stringify(d));
    let o = copy;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = val;
    return copy;
  });
  const updArr = (section, key, idx, field, val) => setData(d => ({
    ...d, [section]: { ...d[section], [key]: d[section][key].map((item, i) => i === idx ? { ...item, [field]: val } : item) }
  }));

  const tabs = [
    { id: "header", label: "Header" },
    { id: "hero", label: "Hero" },
    { id: "services", label: s === "beneficios" ? "Beneficios" : s === "urgencia" ? "Urgencia" : s === "profesional" ? "Ecosistema" : s === "unab" ? "Programas" : "Servicios" },
    { id: "about", label: s === "storytelling" ? "Historia" : s === "profesional" ? "Catálogo" : s === "unab" ? "Acreditaciones" : "Nosotros" },
    { id: "form", label: "Formulario" },
    { id: "utm", label: "UTM" },
    { id: "footer", label: "Footer" },
  ];

  const tabBtn = (t) => ({
    padding: "4px 9px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500,
    background: tab === t.id ? ACC : "#f3f4f6", color: tab === t.id ? DARK : "#6b7280",
  });

  // UTM preview
  const utmStr = buildUTM(data.utm || {});

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: UI_FONT, background: UI_BG }}>
      {/* Name */}
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${UI_BORDER}`, background: UI_CARD }}>
        <label style={labelStyle}>Nombre de la Landing</label>
        <input value={data.name || ""} onChange={e => setData(d => ({ ...d, name: e.target.value }))}
          style={inputStyle} />
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", background: UI_CARD, borderBottom: `1px solid ${UI_BORDER}`, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} style={{
            padding: "10px 11px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
            background: "transparent", color: tab === t.id ? UI_PRIMARY : UI_MUTED, whiteSpace: "nowrap",
            borderBottom: `2px solid ${tab === t.id ? UI_PRIMARY : "transparent"}`,
            transition: "color .15s, border-color .15s",
          }} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>

        {tab === "header" && <>
          <Panel title="🏷 Logo y Colores">
            <Field label="Texto del Logo" value={data.header.logoText} onChange={v => upd("header", "logoText", v)} />
            <ImgField label="Logo (URL o subir imagen)" value={data.header.logoUrl} onChange={v => upd("header", "logoUrl", v)} />
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Tamaño del logo — {data.header.logoSize || 30}px</label>
              <input type="range" min="16" max="120" value={data.header.logoSize || 30}
                onChange={e => upd("header", "logoSize", parseInt(e.target.value))}
                style={{ width: "100%", accentColor: UI_PRIMARY, cursor: "pointer" }} />
            </div>
            <ColorRow label="Color de fondo" value={data.header.bgColor} onChange={v => upd("header", "bgColor", v)} />
            <ColorRow label="Color de texto" value={data.header.textColor} onChange={v => upd("header", "textColor", v)} />
          </Panel>
          <Panel title="🔗 Menú de Navegación">
            {(data.header.menu || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 5, marginBottom: 7 }}>
                <input value={m.l} onChange={e => updArr("header", "menu", i, "l", e.target.value)} placeholder="Etiqueta"
                  style={{ flex: 1, padding: "6px 8px", border: `1px solid ${UI_INPUT_BORDER}`, borderRadius: 6, fontSize: 11, outline: "none", color: UI_TEXT }} />
                <input value={m.h} onChange={e => updArr("header", "menu", i, "h", e.target.value)} placeholder="#seccion"
                  style={{ flex: 1, padding: "6px 8px", border: `1px solid ${UI_INPUT_BORDER}`, borderRadius: 6, fontSize: 11, outline: "none", color: UI_TEXT }} />
                <button onClick={() => setData(d => ({ ...d, header: { ...d.header, menu: d.header.menu.filter((_, j) => j !== i) } }))}
                  style={{ padding: "4px 8px", border: "none", background: "#fee2e2", color: "#ef4444", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, header: { ...d.header, menu: [...d.header.menu, { l: "Nuevo", h: "#" }] } }))}
              style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 11, color: UI_PRIMARY, fontWeight: 600 }}>+ Agregar ítem</button>
          </Panel>
        </>}

        {tab === "hero" && <>
          <Panel title="🖼 Carrusel — 3 slides">
            {[0, 1, 2].map(i => (
              <div key={i} style={{ marginBottom: 8, padding: 10, background: UI_BG, borderRadius: UI_RADIUS }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, color: UI_TEXT }}>Slide {i + 1}</div>
                <ImgField value={data.hero.slides[i] || ""} onChange={v => setData(d => { const sl = [...d.hero.slides]; sl[i] = v; return { ...d, hero: { ...d.hero, slides: sl } }; })} />
              </div>
            ))}
          </Panel>
          <Panel title="✏️ Texto y Botón">
            <Field label="Título Principal" value={data.hero.title} onChange={v => upd("hero", "title", v)} />
            <Field label="Descripción" value={data.hero.desc} onChange={v => upd("hero", "desc", v)} textarea />
            <Field label="Texto del Botón" value={data.hero.btnText} onChange={v => upd("hero", "btnText", v)} />
            <Field label="Enlace del Botón" value={data.hero.btnHref} onChange={v => upd("hero", "btnHref", v)} />
            <ColorRow label="Color del Botón" value={data.hero.btnColor} onChange={v => upd("hero", "btnColor", v)} />
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Overlay oscuro — {Math.round(data.hero.overlay * 100)}%</label>
              <input type="range" min={0} max={1} step={0.05} value={data.hero.overlay}
                onChange={e => upd("hero", "overlay", parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: UI_PRIMARY, cursor: "pointer" }} />
            </div>
          </Panel>
        </>}

        {tab === "services" && (s === "clasica" || s === "storytelling") && <>
          <Panel title="📋 Encabezado">
            <Field label="Título" value={data.services.title} onChange={v => upd("services", "title", v)} />
            <Field label="Subtítulo" value={data.services.subtitle} onChange={v => upd("services", "subtitle", v)} />
            <ColorRow label="Fondo" value={data.services.bgColor} onChange={v => upd("services", "bgColor", v)} />
            <ColorRow label="Texto" value={data.services.titleColor} onChange={v => upd("services", "titleColor", v)} />
            <ColorRow label="Acento" value={data.services.accent} onChange={v => upd("services", "accent", v)} />
          </Panel>
          <Panel title="🃏 Tarjetas">
            {data.services.cards.map((c, i) => (
              <div key={i} style={{ padding: 10, background: UI_BG, borderRadius: UI_RADIUS, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11, fontWeight: 700, color: UI_TEXT }}>
                  Servicio {i + 1}
                  <button onClick={() => setData(d => ({ ...d, services: { ...d.services, cards: d.services.cards.filter((_, j) => j !== i) } }))}
                    style={{ padding: "3px 7px", border: "none", background: "#fee2e2", color: "#ef4444", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✕</button>
                </div>
                <input value={c.title} onChange={e => updArr("services", "cards", i, "title", e.target.value)} placeholder="Título"
                  style={{ ...inputStyle, marginBottom: 6 }} />
                <textarea value={c.desc} onChange={e => updArr("services", "cards", i, "desc", e.target.value)} rows={2}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, services: { ...d.services, cards: [...d.services.cards, { icon: "⭐", title: "Nuevo", desc: "Descripción." }] } }))}
              style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 11, color: "#6b7280" }}>+ Agregar servicio</button>
          </Panel>
        </>}

        {tab === "services" && s === "beneficios" && <>
          <Panel title="⭐ Encabezado">
            <Field label="Título" value={data.benefits.title} onChange={v => upd("benefits", "title", v)} />
            <Field label="Subtítulo" value={data.benefits.subtitle} onChange={v => upd("benefits", "subtitle", v)} />
            <ColorRow label="Fondo" value={data.benefits.bgColor} onChange={v => upd("benefits", "bgColor", v)} />
            <ColorRow label="Texto" value={data.benefits.titleColor} onChange={v => upd("benefits", "titleColor", v)} />
            <ColorRow label="Acento" value={data.benefits.accent} onChange={v => upd("benefits", "accent", v)} />
          </Panel>
          <Panel title="✅ Items de Beneficios">
            {data.benefits.items.map((b, i) => (
              <div key={i} style={{ padding: 8, background: "#f9fafb", borderRadius: 6, marginBottom: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, fontWeight: 600 }}>
                  Beneficio {i + 1}
                  <button onClick={() => setData(d => ({ ...d, benefits: { ...d.benefits, items: d.benefits.items.filter((_, j) => j !== i) } }))}
                    style={{ padding: "1px 5px", border: "1px solid #fca5a5", background: "#fff", color: "#ef4444", borderRadius: 3, cursor: "pointer", fontSize: 10 }}>✕</button>
                </div>
                <input value={b.title} onChange={e => setData(d => ({ ...d, benefits: { ...d.benefits, items: d.benefits.items.map((x, j) => j === i ? { ...x, title: e.target.value } : x) } }))} placeholder="Título"
                  style={{ width: "100%", padding: "3px 6px", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 11, marginBottom: 4, outline: "none" }} />
                <textarea value={b.desc} rows={2} onChange={e => setData(d => ({ ...d, benefits: { ...d.benefits, items: d.benefits.items.map((x, j) => j === i ? { ...x, desc: e.target.value } : x) } }))}
                  style={{ width: "100%", padding: "3px 6px", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 11, resize: "none", outline: "none" }} />
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, benefits: { ...d.benefits, items: [...d.benefits.items, { icon: "✅", title: "Beneficio", desc: "Descripción." }] } }))}
              style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 11, color: "#6b7280" }}>+ Agregar beneficio</button>
          </Panel>
        </>}

        {tab === "services" && s === "urgencia" && <>
          <Panel title="⏰ Oferta Urgente">
            <Field label="Titular" value={data.urgency.headline} onChange={v => upd("urgency", "headline", v)} />
            <ColorRow label="Fondo" value={data.urgency.bgColor} onChange={v => upd("urgency", "bgColor", v)} />
            <ColorRow label="Texto" value={data.urgency.textColor} onChange={v => upd("urgency", "textColor", v)} />
          </Panel>
          <Panel title="📋 Lista incluida">
            {data.urgency.items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                <input value={it} onChange={e => setData(d => ({ ...d, urgency: { ...d.urgency, items: d.urgency.items.map((x, j) => j === i ? e.target.value : x) } }))}
                  style={{ flex: 1, padding: "3px 6px", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 11, outline: "none" }} />
                <button onClick={() => setData(d => ({ ...d, urgency: { ...d.urgency, items: d.urgency.items.filter((_, j) => j !== i) } }))}
                  style={{ padding: "1px 5px", border: "1px solid #fca5a5", background: "#fff", color: "#ef4444", borderRadius: 3, cursor: "pointer", fontSize: 10 }}>✕</button>
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, urgency: { ...d.urgency, items: [...d.urgency.items, "Nuevo beneficio"] } }))}
              style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 11, color: "#6b7280" }}>+ Agregar</button>
          </Panel>
        </>}

        {tab === "services" && s === "profesional" && (() => {
          const p = data.profesional || {};
          const updP = (k, v) => setData(d => ({ ...d, profesional: { ...d.profesional, [k]: v } }));
          return (<>
            <Panel title="🏷 Hero Profesional">
              <Field label="Badge superior" value={p.badge} onChange={v => updP("badge", v)} />
              <ColorRow label="Color badge" value={p.badgeColor || "#c8f135"} onChange={v => updP("badgeColor", v)} />
              <Field label="Título línea 1" value={p.heroTitle} onChange={v => updP("heroTitle", v)} />
              <Field label="Título acento (color)" value={p.heroTitleAccent} onChange={v => updP("heroTitleAccent", v)} />
              <ColorRow label="Color acento título" value={p.heroTitleAccentColor || "#c8f135"} onChange={v => updP("heroTitleAccentColor", v)} />
              <Field label="Descripción" value={p.heroDesc} onChange={v => updP("heroDesc", v)} textarea />
              <Field label="Texto botón CTA" value={p.heroBtnText} onChange={v => updP("heroBtnText", v)} />
              <ColorRow label="Fondo hero" value={p.heroBgColor || DARK} onChange={v => updP("heroBgColor", v)} />
              <ColorRow label="Color botón" value={p.heroBtnColor || "#c8f135"} onChange={v => updP("heroBtnColor", v)} />
              <ColorRow label="Texto botón" value={p.heroBtnTextColor || DARK} onChange={v => updP("heroBtnTextColor", v)} />
            </Panel>
            <Panel title="⚡ Ecosistema 4 Dimensiones">
              <Field label="Subtítulo" value={p.ecosystemTitle} onChange={v => updP("ecosystemTitle", v)} />
              <Field label="Título principal" value={p.ecosystemSubtitle} onChange={v => updP("ecosystemSubtitle", v)} />
              <Field label="Descripción" value={p.ecosystemDesc} onChange={v => updP("ecosystemDesc", v)} textarea />
              <ColorRow label="Fondo" value={p.ecosystemBgColor || "#fff"} onChange={v => updP("ecosystemBgColor", v)} />
              <ColorRow label="Color acento" value={p.ecosystemAccent || "#c8f135"} onChange={v => updP("ecosystemAccent", v)} />
              {(p.ecosystemCards || []).map((c, i) => (
                <div key={i} style={{ padding: 7, background: "#f9fafb", borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Dimensión {i + 1}</div>
                  <input value={c.tag} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, ecosystemCards: d.profesional.ecosystemCards.map((x,j) => j===i?{...x,tag:e.target.value}:x) } }))}
                    placeholder="TAG" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <input value={c.title} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, ecosystemCards: d.profesional.ecosystemCards.map((x,j) => j===i?{...x,title:e.target.value}:x) } }))}
                    placeholder="Título" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <textarea value={c.desc} rows={2} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, ecosystemCards: d.profesional.ecosystemCards.map((x,j) => j===i?{...x,desc:e.target.value}:x) } }))}
                    style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,resize:"none",outline:"none" }} />
                </div>
              ))}
            </Panel>
          </>);
        })()}

        {tab === "about" && s === "profesional" && (() => {
          const p = data.profesional || {};
          const updP = (k, v) => setData(d => ({ ...d, profesional: { ...d.profesional, [k]: v } }));
          return (<>
            <Panel title="📦 Catálogo de Servicios">
              <Field label="Título" value={p.catalogTitle} onChange={v => updP("catalogTitle", v)} />
              <Field label="Subtítulo" value={p.catalogSubtitle} onChange={v => updP("catalogSubtitle", v)} />
              <ColorRow label="Fondo" value={p.catalogBgColor || "#f8f9fa"} onChange={v => updP("catalogBgColor", v)} />
              {(p.catalogCols || []).map((col, i) => (
                <div key={i} style={{ padding: 7, background: "#f9fafb", borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Columna {i + 1}</div>
                  <input value={col.icon} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, catalogCols: d.profesional.catalogCols.map((x,j) => j===i?{...x,icon:e.target.value}:x) } }))}
                    placeholder="Ícono" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <input value={col.title} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, catalogCols: d.profesional.catalogCols.map((x,j) => j===i?{...x,title:e.target.value}:x) } }))}
                    placeholder="Título columna" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  {(col.items||[]).map((item, k) => (
                    <div key={k} style={{ display:"flex",gap:3,marginBottom:3 }}>
                      <input value={item} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, catalogCols: d.profesional.catalogCols.map((x,j) => j===i?{...x,items:x.items.map((y,l)=>l===k?e.target.value:y)}:x) } }))}
                        style={{ flex:1,padding:"2px 5px",border:"1px solid #e5e7eb",borderRadius:3,fontSize:10,outline:"none" }} />
                      <button onClick={() => setData(d => ({ ...d, profesional: { ...d.profesional, catalogCols: d.profesional.catalogCols.map((x,j) => j===i?{...x,items:x.items.filter((_,l)=>l!==k)}:x) } }))}
                        style={{ padding:"1px 4px",border:"1px solid #fca5a5",background:"#fff",color:"#ef4444",borderRadius:3,cursor:"pointer",fontSize:10 }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({ ...d, profesional: { ...d.profesional, catalogCols: d.profesional.catalogCols.map((x,j) => j===i?{...x,items:[...x.items,"Nuevo ítem"]}:x) } }))}
                    style={{ padding:"3px 8px",borderRadius:4,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:10,color:"#6b7280" }}>+ ítem</button>
                </div>
              ))}
            </Panel>
            <Panel title="🔢 Fases del Plan">
              <Field label="Título sección" value={p.phasesTitle} onChange={v => updP("phasesTitle", v)} />
              <Field label="Subtítulo" value={p.phasesSubtitle} onChange={v => updP("phasesSubtitle", v)} />
              {(p.phases||[]).map((ph, i) => (
                <div key={i} style={{ padding: 7, background: "#f9fafb", borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Fase {ph.num}</div>
                  <input value={ph.title} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, phases: d.profesional.phases.map((x,j) => j===i?{...x,title:e.target.value}:x) } }))}
                    style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <textarea value={ph.desc} rows={2} onChange={e => setData(d => ({ ...d, profesional: { ...d.profesional, phases: d.profesional.phases.map((x,j) => j===i?{...x,desc:e.target.value}:x) } }))}
                    style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,resize:"none",outline:"none" }} />
                </div>
              ))}
            </Panel>
          </>);
        })()}

        {tab === "services" && s === "unab" && (() => {
          const u = data.unab || {};
          const updU = (k, v) => setData(d => ({ ...d, unab: { ...d.unab, [k]: v } }));
          return (<>
            <Panel title="🎓 Hero UNAB">
              <Field label="Título principal" value={u.heroTitle} onChange={v => updU("heroTitle", v)} />
              <Field label="Etiqueta admisión" value={u.admisionLabel} onChange={v => updU("admisionLabel", v)} />
              <Field label="Año admisión" value={u.admisionYear} onChange={v => updU("admisionYear", v)} />
              <ColorRow label="Fondo overlay" value={u.contentBgColor} onChange={v => updU("contentBgColor", v)} />
            </Panel>
            <Panel title="📋 Sección Programas">
              <Field label="Título sección" value={u.programsTitle} onChange={v => updU("programsTitle", v)} />
              <Field label="Texto pie panel" value={u.programsFooterText} onChange={v => updU("programsFooterText", v)} />
              <ColorRow label="Fondo panel" value={u.programsBgColor} onChange={v => updU("programsBgColor", v)} />
              <ColorRow label="Fondo título" value={u.programsTitleBg} onChange={v => updU("programsTitleBg", v)} />
              <ColorRow label="Color título" value={u.programsTitleColor} onChange={v => updU("programsTitleColor", v)} />
              <ColorRow label="Color texto" value={u.programsTextColor} onChange={v => updU("programsTextColor", v)} />
            </Panel>
            <Panel title="📚 Categorías y Carreras">
              {(u.categories || []).map((cat, ci) => (
                <div key={ci} style={{ padding: 7, background: "#f9fafb", borderRadius: 6, marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <input value={cat.name} onChange={e => updU("categories", u.categories.map((x,j)=>j===ci?{...x,name:e.target.value}:x))}
                      style={{ flex:1,padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,fontWeight:600,outline:"none" }} />
                    <button onClick={() => updU("categories", u.categories.filter((_,j)=>j!==ci))}
                      style={{ padding:"1px 6px",border:"1px solid #fca5a5",background:"#fff",color:"#ef4444",borderRadius:3,cursor:"pointer",fontSize:10,marginLeft:4 }}>✕</button>
                  </div>
                  {(cat.items||[]).map((item,ii)=>(
                    <div key={ii} style={{ display:"flex",gap:3,marginBottom:3 }}>
                      <input value={item} onChange={e=>updU("categories",u.categories.map((x,j)=>j===ci?{...x,items:x.items.map((y,k)=>k===ii?e.target.value:y)}:x))}
                        style={{ flex:1,padding:"2px 5px",border:"1px solid #e5e7eb",borderRadius:3,fontSize:10,outline:"none" }} />
                      <button onClick={()=>updU("categories",u.categories.map((x,j)=>j===ci?{...x,items:x.items.filter((_,k)=>k!==ii)}:x))}
                        style={{ padding:"1px 4px",border:"1px solid #fca5a5",background:"#fff",color:"#ef4444",borderRadius:3,cursor:"pointer",fontSize:10 }}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>updU("categories",u.categories.map((x,j)=>j===ci?{...x,items:[...x.items,"Nueva carrera"]}:x))}
                    style={{ padding:"2px 7px",borderRadius:4,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:10,color:"#6b7280" }}>+ Carrera</button>
                </div>
              ))}
              <button onClick={()=>updU("categories",[...(u.categories||[]),{name:"Nueva categoría",items:[]}])}
                style={{ padding:"4px 10px",borderRadius:5,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:11,color:"#6b7280" }}>+ Categoría</button>
            </Panel>
          </>);
        })()}

        {tab === "about" && s === "unab" && (() => {
          const u = data.unab || {};
          const updU = (k, v) => setData(d => ({ ...d, unab: { ...d.unab, [k]: v } }));
          return (<>
            <Panel title="🏆 Acreditaciones (Footer)">
              <ColorRow label="Fondo footer" value={u.accreditationBgColor} onChange={v => updU("accreditationBgColor", v)} />
              {(u.accreditations||[]).map((a,i)=>(
                <div key={i} style={{ padding:7,background:"#f9fafb",borderRadius:6,marginBottom:6 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11,fontWeight:600 }}>
                    Logo {i+1}
                    <button onClick={()=>updU("accreditations",u.accreditations.filter((_,j)=>j!==i))}
                      style={{ padding:"1px 5px",border:"1px solid #fca5a5",background:"#fff",color:"#ef4444",borderRadius:3,cursor:"pointer",fontSize:10 }}>✕</button>
                  </div>
                  <input value={a.text} onChange={e=>updU("accreditations",u.accreditations.map((x,j)=>j===i?{...x,text:e.target.value}:x))}
                    placeholder="Texto" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <input value={a.icon} onChange={e=>updU("accreditations",u.accreditations.map((x,j)=>j===i?{...x,icon:e.target.value}:x))}
                    placeholder="Icono (si no hay logo)" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                  <input value={a.logoUrl} onChange={e=>updU("accreditations",u.accreditations.map((x,j)=>j===i?{...x,logoUrl:e.target.value}:x))}
                    placeholder="URL imagen logo" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,outline:"none" }} />
                </div>
              ))}
              <button onClick={()=>updU("accreditations",[...(u.accreditations||[]),{text:"Acreditación",icon:"★",logoUrl:""}])}
                style={{ padding:"4px 10px",borderRadius:5,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:11,color:"#6b7280" }}>+ Agregar logo</button>
            </Panel>
          </>);
        })()}

        {tab === "form" && (() => {
          const f = data.form || {};
          const updF = (k, v) => setData(d => ({ ...d, form: { ...d.form, [k]: v } }));
          return (
            <Panel title="📝 Configuración del Formulario">
              <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 10, lineHeight: 1.5 }}>
                Elige entre un formulario básico editable o pega el código embed de HubSpot, Typeform, ActiveCampaign u otro sistema.
              </p>
              {/* Location toggles */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 6 }}>Mostrar formulario en</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "8px 10px", borderRadius: 7, border: `1px solid ${f.showInHero ? ACC : "#e5e7eb"}`, background: f.showInHero ? "#fffbeb" : "#fff" }}>
                    <input type="checkbox" checked={!!f.showInHero} onChange={e => updF("showInHero", e.target.checked)} style={{ accentColor: ACC, width: 14, height: 14 }} />
                    <span style={{ fontWeight: f.showInHero ? 600 : 400, color: f.showInHero ? DARK : "#6b7280" }}>🖼 Formulario en Hero</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "8px 10px", borderRadius: 7, border: `1px solid ${f.showInFooter ? ACC : "#e5e7eb"}`, background: f.showInFooter ? "#fffbeb" : "#fff" }}>
                    <input type="checkbox" checked={!!f.showInFooter} onChange={e => updF("showInFooter", e.target.checked)} style={{ accentColor: ACC, width: 14, height: 14 }} />
                    <span style={{ fontWeight: f.showInFooter ? 600 : 400, color: f.showInFooter ? DARK : "#6b7280" }}>📋 Formulario en Footer</span>
                  </label>
                </div>
              </div>

              {/* Type toggle */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 5 }}>Tipo de formulario</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[{id:"basic",label:"📋 Básico"},{id:"embed",label:"</> Código Embed"}].map(t => (
                    <button key={t.id} onClick={() => updF("type", t.id)}
                      style={{ flex: 1, padding: "7px 6px", borderRadius: 6, border: `2px solid ${f.type===t.id?ACC:"#e5e7eb"}`, background: f.type===t.id?"#fffbeb":"#fff", cursor: "pointer", fontSize: 11, fontWeight: f.type===t.id?700:400, color: f.type===t.id?DARK:"#6b7280" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {f.type === "embed" ? <>
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, padding: "7px 10px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#166534", marginBottom: 3 }}>💡 Cómo usar código embed</div>
                  <div style={{ fontSize: 9, color: "#166534", lineHeight: 1.5 }}>Pega el snippet de HubSpot, Typeform, Mailchimp, ActiveCampaign, etc. Se renderizará en el footer de la landing.</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 3 }}>Código Embed</label>
                  <textarea value={f.embedCode || ""} onChange={e => updF("embedCode", e.target.value)}
                    placeholder={`<!-- HubSpot -->\n<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>\n<script>\nhbspt.forms.create({\n  region: "na1",\n  portalId: "TU_PORTAL_ID",\n  formId: "TU_FORM_ID"\n});\n</script>\n\n<!-- Typeform -->\n<div data-tf-widget="TU_ID"></div>\n<script src="//embed.typeform.com/next/embed.js"></script>`}
                    rows={10}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #e5e7eb", borderRadius: 5, fontSize: 10, fontFamily: "monospace", resize: "vertical", outline: "none", background: "#1e1e2e", color: "#c8f135", lineHeight: 1.6 }} />
                </div>
              </> : <>
                <Field label="Título del formulario" value={f.title} onChange={v => updF("title", v)} />
                <Field label="Subtítulo" value={f.subtitle} onChange={v => updF("subtitle", v)} />
                <Field label="Texto del botón" value={f.btnText} onChange={v => updF("btnText", v)} />
                <ColorRow label="Color botón" value={f.btnColor || ACC} onChange={v => updF("btnColor", v)} />
                <ColorRow label="Texto botón" value={f.btnTextColor || DARK} onChange={v => updF("btnTextColor", v)} />
                <ColorRow label="Fondo sección" value={f.bgColor || DARK} onChange={v => updF("bgColor", v)} />
                <ColorRow label="Color texto" value={f.textColor || "#fff"} onChange={v => updF("textColor", v)} />
                <div style={{ marginBottom: 6 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!f.showPrivacyCheck} onChange={e => updF("showPrivacyCheck", e.target.checked)} style={{ accentColor: ACC }} />
                    Mostrar checkbox de privacidad
                  </label>
                </div>
                {f.showPrivacyCheck && <Field label="Texto de privacidad" value={f.privacyText} onChange={v => updF("privacyText", v)} textarea />}
                <div style={{ marginTop: 8, marginBottom: 6 }}>
                  <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 5 }}>Campos del formulario</label>
                  {(f.fields || []).map((field, i) => (
                    <div key={i} style={{ padding: 7, background: "#f9fafb", borderRadius: 6, marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>
                        Campo {i + 1}
                        <button onClick={() => updF("fields", f.fields.filter((_, j) => j !== i))}
                          style={{ padding: "1px 5px", border: "1px solid #fca5a5", background: "#fff", color: "#ef4444", borderRadius: 3, cursor: "pointer", fontSize: 10 }}>✕</button>
                      </div>
                      <input value={field.label} onChange={e => updF("fields", f.fields.map((x,j) => j===i?{...x,label:e.target.value}:x))}
                        placeholder="Label" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                      <input value={field.placeholder} onChange={e => updF("fields", f.fields.map((x,j) => j===i?{...x,placeholder:e.target.value}:x))}
                        placeholder="Placeholder" style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,marginBottom:3,outline:"none" }} />
                      <select value={field.type} onChange={e => updF("fields", f.fields.map((x,j) => j===i?{...x,type:e.target.value}:x))}
                        style={{ width:"100%",padding:"3px 6px",border:"1px solid #e5e7eb",borderRadius:4,fontSize:11,outline:"none",background:"#fff" }}>
                        {["text","email","tel","number","textarea"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <label style={{ display:"flex",alignItems:"center",gap:5,fontSize:10,cursor:"pointer",marginTop:4 }}>
                        <input type="checkbox" checked={!!field.required} onChange={e => updF("fields", f.fields.map((x,j) => j===i?{...x,required:e.target.checked}:x))} style={{ accentColor: ACC }} />
                        Campo requerido
                      </label>
                    </div>
                  ))}
                  <button onClick={() => updF("fields", [...(f.fields||[]), { id: `field_${Date.now()}`, label: "Nuevo Campo", type: "text", placeholder: "...", required: false }])}
                    style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 11, color: "#6b7280" }}>+ Agregar campo</button>
                </div>
              </>}
            </Panel>
          );
        })()}

        {tab === "about" && s === "storytelling" && <>
          <Panel title="📖 Historia">
            <Field label="Título" value={data.story.title} onChange={v => upd("story", "title", v)} />
            <ColorRow label="Fondo" value={data.story.bgColor} onChange={v => upd("story", "bgColor", v)} />
            <ColorRow label="Texto" value={data.story.titleColor} onChange={v => upd("story", "titleColor", v)} />
          </Panel>
          <Panel title="🔢 Pasos">
            {data.story.steps.map((st, i) => (
              <div key={i} style={{ padding: 8, background: "#f9fafb", borderRadius: 6, marginBottom: 7 }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 5 }}>Paso {i + 1}</div>
                <input value={st.title} onChange={e => setData(d => ({ ...d, story: { ...d.story, steps: d.story.steps.map((x, j) => j === i ? { ...x, title: e.target.value } : x) } }))}
                  style={{ width: "100%", padding: "3px 6px", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 11, marginBottom: 4, outline: "none" }} />
                <textarea value={st.desc} rows={2} onChange={e => setData(d => ({ ...d, story: { ...d.story, steps: d.story.steps.map((x, j) => j === i ? { ...x, desc: e.target.value } : x) } }))}
                  style={{ width: "100%", padding: "3px 6px", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 11, resize: "none", outline: "none" }} />
              </div>
            ))}
          </Panel>
          <Panel title="💬 Testimonio">
            <Field label="Cita" value={data.story.quote} onChange={v => upd("story", "quote", v)} textarea />
            <Field label="Autor" value={data.story.quoteAuthor} onChange={v => upd("story", "quoteAuthor", v)} />
          </Panel>
        </>}

        {tab === "about" && s !== "storytelling" && <>
          <Panel title="👥 Nosotros">
            <Field label="Título" value={data.about.title} onChange={v => upd("about", "title", v)} />
            <Field label="Descripción" value={data.about.desc} onChange={v => upd("about", "desc", v)} textarea />
            <ColorRow label="Fondo" value={data.about.bgColor} onChange={v => upd("about", "bgColor", v)} />
            <ColorRow label="Texto" value={data.about.textColor} onChange={v => upd("about", "textColor", v)} />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer", marginBottom: 8 }}>
              <input type="checkbox" checked={data.about.imgLeft} onChange={e => upd("about", "imgLeft", e.target.checked)} style={{ accentColor: ACC }} />
              Imagen a la izquierda
            </label>
          </Panel>
          <Panel title="🖼 Imagen o Video">
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {["image", "video"].map(t => (
                <button key={t} onClick={() => upd("about", "mediaType", t)}
                  style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid #e5e7eb", cursor: "pointer", fontSize: 11, fontWeight: 500,
                    background: data.about.mediaType === t ? ACC : "#fff", color: data.about.mediaType === t ? DARK : "#6b7280" }}>
                  {t === "image" ? "Imagen" : "Video"}
                </button>
              ))}
            </div>
            {data.about.mediaType === "image"
              ? <ImgField label="URL o subir imagen" value={data.about.mediaUrl} onChange={v => upd("about", "mediaUrl", v)} />
              : <Field label="URL embed (YouTube/Vimeo)" value={data.about.videoUrl} onChange={v => upd("about", "videoUrl", v)} placeholder="https://www.youtube.com/embed/..." />
            }
          </Panel>
        </>}

        {tab === "utm" && (
          <Panel title="📊 Parámetros UTM">
            <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 10, lineHeight: 1.5 }}>Añade parámetros UTM para rastrear el tráfico en Google Analytics.</p>
            <Select label="Source *" value={data.utm?.source} onChange={v => updDeep("utm.source", v)}
              options={["", "google", "facebook", "instagram", "twitter", "linkedin", "email", "whatsapp", "tiktok", "otro"]} />
            <Select label="Medium *" value={data.utm?.medium} onChange={v => updDeep("utm.medium", v)}
              options={["", "cpc", "organic", "social", "email", "referral", "display", "video", "otro"]} />
            <Field label="Campaign *" value={data.utm?.campaign} onChange={v => updDeep("utm.campaign", v)} placeholder="ej: lanzamiento-2025" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <Field label="Content" value={data.utm?.content} onChange={v => updDeep("utm.content", v)} placeholder="ej: banner-hero" />
              <Field label="Term" value={data.utm?.term} onChange={v => updDeep("utm.term", v)} placeholder="ej: software-crm" />
            </div>
            {utmStr
              ? <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 5, padding: "6px 8px", fontSize: 9, color: "#166534", wordBreak: "break-all", lineHeight: 1.5, marginTop: 4 }}>
                  ?{utmStr}
                </div>
              : <div style={{ fontSize: 10, color: "#d1d5db", textAlign: "center", padding: "4px 0" }}>Completa los campos para ver la URL generada</div>
            }
          </Panel>
        )}

        {tab === "footer" && <>
          <Panel title="🏢 Empresa">
            <ColorRow label="Fondo" value={data.footer.bgColor} onChange={v => upd("footer", "bgColor", v)} />
            <ColorRow label="Texto" value={data.footer.textColor} onChange={v => upd("footer", "textColor", v)} />
            <Field label="Nombre empresa" value={data.footer.company} onChange={v => upd("footer", "company", v)} />
            <Field label="Descripción" value={data.footer.desc} onChange={v => upd("footer", "desc", v)} textarea />
            <Field label="Copyright" value={data.footer.copy} onChange={v => upd("footer", "copy", v)} />
          </Panel>
          <Panel title="📞 Contacto">
            <Field label="Email" value={data.footer.email} onChange={v => upd("footer", "email", v)} />
            <Field label="Teléfono" value={data.footer.phone} onChange={v => upd("footer", "phone", v)} />
            <Field label="Dirección" value={data.footer.address} onChange={v => upd("footer", "address", v)} />
          </Panel>
        </>}

      </div>

      {/* SAVE BUTTON FIXED AT BOTTOM */}
      <div style={{ padding: 10, borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
        <button onClick={onSave}
          style={{ width: "100%", padding: "9px", borderRadius: 6, border: "none", background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          💾 Guardar Landing
        </button>
      </div>
    </div>
  );
};

// ─── CAROUSEL HOOK ────────────────────────────────────────────────────────────
const useCarousel = (slides) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length]);
  return [idx, setIdx];
};

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
const useCountdown = (deadline) => {
  const [time, setTime] = useState("00:00:00");
  useEffect(() => {
    const tick = () => {
      const r = Math.max(0, deadline - Date.now());
      const h = Math.floor(r / 3600000), m = Math.floor((r % 3600000) / 60000), s = Math.floor((r % 60000) / 1000);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline]);
  return time;
};

// ─── LIVE PREVIEW COMPONENT ───────────────────────────────────────────────────
const LivePreview = ({ data }) => {
  const slides = (data.hero.slides || []).filter(Boolean);
  const [slideIdx, setSlideIdx] = useCarousel(slides);
  const countdown = useCountdown(data.urgency?.deadline || Date.now() + 7200000);
  const s = data.struct || "clasica";
  const F = false;
  const P = "24px";
  const hH = (data.form && data.form.showInHero) ? 280 : 220;

  if (s === "unab") {
    const u = data.unab || {};
    const bgImg = slides[0] || "";
    return (
      <div style={{ fontFamily: "'Segoe UI',sans-serif", width: "100%", position: "relative", backgroundImage: bgImg ? `url(${bgImg})` : "none", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: bgImg ? undefined : data.header.bgColor }}>
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${data.hero.overlay || 0.5})` }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header row */}
          <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
              {data.header.logoUrl
                ? <img src={data.header.logoUrl} style={{ height: Math.round((data.header.logoSize || 80) * 0.6), objectFit: "contain", borderRadius: 6, background: "rgba(255,255,255,0.15)", padding: 4, flexShrink: 0 }} alt="logo" />
                : <div style={{ background: "rgba(255,255,255,.2)", borderRadius: 6, padding: "5px 9px", color: "#fff", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>{data.header.logoText}</div>
              }
              <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>{u.heroTitle || "Es momento de llegar más lejos"}</h1>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 8 }}>
              <div style={{ color: "#fff", fontSize: 7, opacity: .9, textTransform: "uppercase", letterSpacing: 2 }}>{u.admisionLabel || "Admisión"}</div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{u.admisionYear || "2026"}</div>
            </div>
          </div>
          {/* Programs + Form */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 20px 14px", gap: 10 }}>
            <div style={{ background: u.programsBgColor || "#fff", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ background: u.programsTitleBg || DARK, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ color: u.programsTitleColor || "#fff", fontSize: 10, fontWeight: 700 }}>{u.programsTitle || "Carreras y Programas"}</div>
              </div>
              <div style={{ padding: "7px 10px" }}>
                {(u.categories || []).map((cat, i) => (
                  <div key={i} style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: u.programsTextColor || DARK, marginBottom: 2 }}>{cat.name}</div>
                    <ul style={{ margin: 0, paddingLeft: 10 }}>
                      {(cat.items || []).map((item, j) => (
                        <li key={j} style={{ fontSize: 7, color: u.programsTextColor || "#374151", marginBottom: 1, lineHeight: 1.4 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {u.programsFooterText && (
                  <div style={{ marginTop: 5, paddingTop: 4, borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: 7, fontWeight: 700, color: u.programsFooterColor || DARK }}>{u.programsFooterText}</div>
                )}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 5, backdropFilter: "blur(6px)", padding: "9px 10px" }}>
              <ProForm form={data.form} compact={true} />
            </div>
          </div>
          {/* Accreditations */}
          <div style={{ background: u.accreditationBgColor || DARK, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {(u.accreditations || []).map((a, i) => (
              a.logoUrl
                ? <img key={i} src={a.logoUrl} style={{ height: 22, objectFit: "contain" }} alt={a.text} />
                : <div key={i} style={{ color: "#fff", textAlign: "center", fontSize: 6, opacity: .85 }}>
                    <div style={{ fontSize: 10, fontWeight: 900 }}>{a.icon}</div>
                    <div>{a.text}</div>
                  </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", width: "100%" }}>
      {/* Header */}
      <header style={{ background: data.header.bgColor, padding: `0 ${P}`, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ color: data.header.textColor, fontWeight: 700, fontSize: 13 }}>
          {data.header.logoUrl ? <img src={data.header.logoUrl} style={{ height: Math.round((data.header.logoSize || 30) * 0.73), objectFit: "contain" }} alt="logo" /> : data.header.logoText}
        </span>
        <nav style={{ display: "flex", gap: 12 }}>
          {(data.header.menu || []).map((m, i) => <a key={i} href={m.h} style={{ color: data.header.textColor, textDecoration: "none", fontSize: 10 }}>{m.l}</a>)}
        </nav>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", height: hH, overflow: "hidden" }}>
        {slides.map((sl, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, backgroundImage: `url(${sl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: i === slideIdx ? 1 : 0, transition: "opacity 1s" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${data.hero.overlay})` }} />
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
          {slides.map((_, i) => <div key={i} onClick={() => setSlideIdx(i)} style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", opacity: i === slideIdx ? 1 : 0.4, cursor: "pointer" }} />)}
        </div>
        {(data.form && data.form.showInHero) ? (
          <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: `0 ${P}`, gap: 14 }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <h1 style={{ color: "#fff", fontSize: 19, fontWeight: 700, marginBottom: 7, lineHeight: 1.2 }}>{data.hero.title}</h1>
              <p style={{ color: "rgba(255,255,255,.85)", fontSize: 10, maxWidth: 340, marginBottom: 12 }}>{data.hero.desc}</p>
              <a href={data.hero.btnHref} style={{ background: data.hero.btnColor, color: DARK, padding: "7px 16px", borderRadius: 5, textDecoration: "none", fontWeight: 700, fontSize: 10 }}>{data.hero.btnText}</a>
            </div>
            <div style={{ background: (data.form && data.form.bgColor) || DARK, borderRadius: 7, padding: "10px 12px", width: 190, flexShrink: 0, overflowY: "auto", maxHeight: hH - 20 }}>
              <ProForm form={data.form} compact={true} />
            </div>
          </div>
        ) : (
          <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `0 ${P}` }}>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>{data.hero.title}</h1>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 11, maxWidth: 480, marginBottom: 14 }}>{data.hero.desc}</p>
            <a href={data.hero.btnHref} style={{ background: data.hero.btnColor, color: DARK, padding: "7px 18px", borderRadius: 5, textDecoration: "none", fontWeight: 700, fontSize: 10 }}>{data.hero.btnText}</a>
          </div>
        )}
      </section>

      {/* Services / Benefits / Urgency */}
      {(s === "clasica" || s === "storytelling") && (
        <section style={{ background: data.services.bgColor, padding: `24px ${P}` }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ color: data.services.titleColor, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{data.services.title}</h2>
            <p style={{ color: data.services.titleColor, opacity: .6, fontSize: 10 }}>{data.services.subtitle}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.services.cards.length, 4)},1fr)`, gap: 8 }}>
            {data.services.cards.map((c, i) => (
              <div key={i} style={{ background: data.services.cardBg, borderRadius: 9, padding: 10, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ color: data.services.titleColor, fontWeight: 600, fontSize: 10, marginBottom: 3 }}>{c.title}</div>
                <div style={{ color: data.services.titleColor, opacity: .6, fontSize: 9, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {s === "beneficios" && (
        <section style={{ background: data.benefits.bgColor, padding: `24px ${P}` }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ color: data.benefits.titleColor, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{data.benefits.title}</h2>
            <p style={{ color: data.benefits.titleColor, opacity: .6, fontSize: 10 }}>{data.benefits.subtitle}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.benefits.items.length, 3)},1fr)`, gap: 10 }}>
            {data.benefits.items.map((b, i) => (
              <div key={i} style={{ textAlign: "center", padding: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: data.benefits.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 8px" }}>{b.icon}</div>
                <div style={{ color: data.benefits.titleColor, fontWeight: 700, fontSize: 11, marginBottom: 3 }}>{b.title}</div>
                <div style={{ color: data.benefits.titleColor, opacity: .6, fontSize: 9, lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {s === "urgencia" && (
        <section style={{ background: data.urgency.bgColor, padding: `22px ${P}` }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ color: data.urgency.textColor, fontSize: 9, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, opacity: .6 }}>Oferta especial</div>
            <h2 style={{ color: data.urgency.textColor, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{data.urgency.headline}</h2>
            <div style={{ fontSize: 26, fontWeight: 700, color: data.hero.btnColor, fontFamily: "monospace", letterSpacing: 4 }}>{countdown}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
              {["Horas", "Minutos", "Segundos"].map(l => <span key={l} style={{ color: data.urgency.textColor, fontSize: 8, opacity: .55 }}>{l}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
            {data.urgency.badges.map((b, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: data.hero.btnColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{b.icon}</div>
                <span style={{ color: data.urgency.textColor, fontSize: 8, opacity: .8 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROFESIONAL STRUCTURE */}
      {s === "profesional" && (() => {
        const p = data.profesional || {};
        const accentC = p.heroBtnColor || "#c8f135";
        return (<>
          {/* Hero profesional */}
          <section style={{ background: p.heroBgColor || DARK, padding: `30px ${P} 26px` }}>
            {p.badge && <div style={{ display: "inline-block", background: accentC, color: DARK, fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 3, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{p.badge}</div>}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ flex: 1.2 }}>
                <h1 style={{ color: "#fff", fontSize: 17, fontWeight: 700, lineHeight: 1.25, marginBottom: 10 }}>
                  {p.heroTitle} <span style={{ color: accentC }}>{p.heroTitleAccent}</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,.75)", fontSize: 10, lineHeight: 1.65, marginBottom: 14 }}>{p.heroDesc}</p>
                <a href="#footer" style={{ display: "inline-block", background: accentC, color: p.heroBtnTextColor || DARK, padding: "7px 18px", borderRadius: 5, textDecoration: "none", fontWeight: 700, fontSize: 10 }}>{p.heroBtnText}</a>
              </div>
            </div>
          </section>
          {/* Ecosystem */}
          <section style={{ background: p.ecosystemBgColor || "#fff", padding: `20px ${P}` }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 8, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{p.ecosystemTitle}</div>
              <h2 style={{ fontSize: 14, fontWeight: 900, color: DARK, marginBottom: 4 }}>{p.ecosystemSubtitle}</h2>
              <div style={{ width: 28, height: 2, background: p.ecosystemAccent || accentC, margin: "0 auto 6px" }} />
              <p style={{ fontSize: 9, color: "#6b7280" }}>{p.ecosystemDesc}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {(p.ecosystemCards || []).map((c, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 8 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: p.ecosystemAccent || accentC, textTransform: "uppercase", marginBottom: 3 }}>{c.tag}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: DARK, marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontSize: 8, color: "#6b7280", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </section>
          {/* Catalog */}
          <section style={{ background: p.catalogBgColor || "#f8f9fa", padding: `20px ${P}` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{p.catalogTitle}</h2>
            <p style={{ fontSize: 9, color: "#6b7280", marginBottom: 12 }}>{p.catalogSubtitle}</p>
            <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #e5e7eb" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {(p.catalogCols || []).map((col, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 14, marginBottom: 5 }}>{col.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: DARK, marginBottom: 6 }}>{col.title}</div>
                    {(col.items || []).map((it, j) => (
                      <div key={j} style={{ display: "flex", gap: 5, marginBottom: 4, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentC, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 8, color: "#374151", lineHeight: 1.4 }}>{it}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Phases */}
          <section style={{ background: p.phasesBgColor || "#fff", padding: `20px ${P}` }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{p.phasesTitle}</h2>
              <div style={{ width: 28, height: 2, background: accentC, margin: "0 auto 4px" }} />
              <p style={{ fontSize: 9, color: "#6b7280" }}>{p.phasesSubtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {(p.phases || []).map((ph, i) => (
                <div key={i} style={{ textAlign: "center", padding: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, margin: "0 auto 6px" }}>{ph.icon}</div>
                  <div style={{ display: "inline-block", background: accentC, color: DARK, fontSize: 7, fontWeight: 700, padding: "1px 6px", borderRadius: 10, marginBottom: 4 }}>Fase {ph.num}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: DARK, marginBottom: 3 }}>{ph.title}</div>
                  <div style={{ fontSize: 8, color: "#6b7280", lineHeight: 1.5 }}>{ph.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </>);
      })()}

      {/* About / Story */}
      {s === "storytelling" && (
        <section style={{ background: data.story.bgColor, padding: `26px ${P}` }}>
          <h2 style={{ color: data.story.titleColor, fontSize: 15, fontWeight: 700, textAlign: "center", marginBottom: 18 }}>{data.story.title}</h2>
          <div style={{ maxWidth: 360, margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: data.hero.btnColor }} />
            {data.story.steps.map((st, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: data.hero.btnColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: DARK, flexShrink: 0, zIndex: 1 }}>{st.num}</div>
                <div style={{ flex: 1, background: "#f9f9f9", borderRadius: 7, padding: 8 }}>
                  <div style={{ fontWeight: 700, color: data.story.titleColor, fontSize: 11, marginBottom: 3 }}>{st.title}</div>
                  <div style={{ color: data.story.titleColor, opacity: .65, fontSize: 9, lineHeight: 1.6 }}>{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: data.hero.btnColor, borderRadius: 9, padding: 14, marginTop: 14, maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 20, color: DARK, lineHeight: .8, marginBottom: 6 }}>"</div>
            <p style={{ color: DARK, fontSize: 11, fontStyle: "italic", lineHeight: 1.65, marginBottom: 6 }}>{data.story.quote}</p>
            <div style={{ color: DARK, fontSize: 9, fontWeight: 600, opacity: .75 }}>{data.story.quoteAuthor}</div>
          </div>
        </section>
      )}

      {s === "urgencia" && (
        <section style={{ background: "#fff", padding: `22px ${P}` }}>
          <div style={{ maxWidth: 340, margin: "0 auto" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 10 }}>{data.urgency.listTitle}</h3>
            {data.urgency.items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 8, color: "#fff", fontWeight: 700 }}>✓</div>
                <span style={{ color: "#374151", fontSize: 10 }}>{it}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <a href={data.hero.btnHref} style={{ display: "inline-block", background: data.hero.btnColor, color: DARK, padding: "8px 20px", borderRadius: 5, textDecoration: "none", fontWeight: 700, fontSize: 11 }}>{data.hero.btnText}</a>
            </div>
          </div>
        </section>
      )}

      {s !== "storytelling" && s !== "urgencia" && (
        <section style={{ background: data.about.bgColor, padding: `26px ${P}` }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexDirection: data.about.imgLeft ? "row" : "row-reverse" }}>
            <div style={{ flex: 1 }}>
              {data.about.mediaType === "video" && data.about.videoUrl
                ? <iframe src={data.about.videoUrl} style={{ width: "100%", height: 130, borderRadius: 9, border: "none" }} allowFullScreen />
                : <img src={data.about.mediaUrl} alt="" style={{ width: "100%", borderRadius: 9, objectFit: "cover", maxHeight: 150, display: "block" }} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: data.about.textColor, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{data.about.title}</h2>
              {data.about.desc.split("\n\n").map((p, i) => <p key={i} style={{ color: data.about.textColor, opacity: .75, fontSize: 10, lineHeight: 1.75, marginBottom: 6 }}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: data.footer.bgColor, padding: `22px ${P} 12px` }}>
        {(() => {
          const showFtrForm = data.form && data.form.showInFooter;
          if (s === "profesional") {
            return showFtrForm ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 12 }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{data.header.logoText}</div>
                  <p style={{ color: data.footer.textColor, fontSize: 9, lineHeight: 1.65, marginBottom: 10 }}>{data.footer.desc}</p>
                  <div style={{ fontSize: 9, color: data.footer.textColor, marginBottom: 3 }}>📍 {data.footer.address}</div>
                  <div style={{ fontSize: 9, color: data.footer.textColor }}>{data.footer.email}</div>
                </div>
                <div><ProForm form={data.form} compact={true} /></div>
              </div>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{data.header.logoText}</div>
                <p style={{ color: data.footer.textColor, fontSize: 9, lineHeight: 1.65, marginBottom: 10 }}>{data.footer.desc}</p>
                <div style={{ fontSize: 9, color: data.footer.textColor, marginBottom: 3 }}>📍 {data.footer.address}</div>
                <div style={{ fontSize: 9, color: data.footer.textColor }}>{data.footer.email}</div>
              </div>
            );
          }
          return showFtrForm ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{data.footer.company}</div>
                <p style={{ color: data.footer.textColor, fontSize: 9, lineHeight: 1.65, marginBottom: 8 }}>{data.footer.desc}</p>
                <div style={{ color: data.footer.textColor, fontSize: 8, marginBottom: 3 }}>{data.footer.email}</div>
                <div style={{ color: data.footer.textColor, fontSize: 8, marginBottom: 3 }}>{data.footer.phone}</div>
                <div style={{ color: data.footer.textColor, fontSize: 8 }}>{data.footer.address}</div>
              </div>
              <div><ProForm form={data.form} compact={true} /></div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{data.footer.company}</div>
                <p style={{ color: data.footer.textColor, fontSize: 9, lineHeight: 1.65 }}>{data.footer.desc}</p>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 8, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>Contacto</div>
                <div style={{ color: data.footer.textColor, fontSize: 8, marginBottom: 3 }}>{data.footer.email}</div>
                <div style={{ color: data.footer.textColor, fontSize: 8, marginBottom: 3 }}>{data.footer.phone}</div>
                <div style={{ color: data.footer.textColor, fontSize: 8 }}>{data.footer.address}</div>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 8, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>Navegación</div>
                {(data.header.menu || []).map((m, i) => <div key={i} style={{ marginBottom: 4 }}><a href={m.h} style={{ color: data.footer.textColor, fontSize: 8, textDecoration: "none", opacity: .8 }}>{m.l}</a></div>)}
              </div>
            </div>
          );
        })()}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 8, textAlign: "center" }}>
          <span style={{ color: data.footer.textColor, fontSize: 8, opacity: .6 }}>{data.footer.copy}</span>
        </div>
      </footer>
    </div>
  );
};

// ─── LANDINGS LIST PAGE ───────────────────────────────────────────────────────
const LandingsList = ({ landings, onNew, onEdit, onPreview, onDelete, onDownload }) => (
  <div style={{ flex: 1, overflow: "auto", padding: 28, background: UI_BG, fontFamily: UI_FONT }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: UI_TEXT, marginBottom: 3 }}>Landings Creadas</h2>
        <p style={{ fontSize: 12, color: UI_MUTED }}>{landings.length} landing{landings.length !== 1 ? "s" : ""} guardada{landings.length !== 1 ? "s" : ""}</p>
      </div>
      <button onClick={onNew} style={{ padding: "9px 20px", borderRadius: UI_RADIUS, border: "none", background: UI_PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: UI_SHADOW_MD }}>+ Nueva Landing</button>
    </div>
    {landings.length === 0 ? (
      <div style={{ textAlign: "center", padding: "60px 40px", background: UI_CARD, borderRadius: UI_RADIUS + 4, boxShadow: UI_SHADOW, color: UI_MUTED }}>
        <div style={{ fontSize: 44, marginBottom: 14, opacity: .25 }}>🗂</div>
        <p style={{ marginBottom: 14, fontSize: 14 }}>No hay landings creadas aún.</p>
        <button onClick={onNew} style={{ padding: "9px 22px", borderRadius: UI_RADIUS, border: "none", background: UI_PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Crear primera landing</button>
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {landings.map(l => {
          const utm = buildUTM(l.utm || {});
          return (
            <div key={l.id} style={{ background: UI_CARD, borderRadius: UI_RADIUS + 2, boxShadow: UI_SHADOW, overflow: "hidden" }}>
              <div onClick={() => onPreview(l.id)} style={{ height: 110, position: "relative", cursor: "pointer", background: l.header.bgColor, overflow: "hidden" }}>
                {l.hero.slides?.[0] && <img src={l.hero.slides[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .5 }} />}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.44)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 10 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, textAlign: "center" }}>{l.name}</div>
                  <span style={{ background: UI_PRIMARY, color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20, marginTop: 5 }}>
                    {SNAMES[SIDS.indexOf(l.struct || "clasica")] || "Clásica"}
                  </span>
                  {utm && <span style={{ background: "#22c55e", color: "#fff", fontSize: 8, padding: "1px 6px", borderRadius: 20, marginTop: 3 }}>UTM ✓</span>}
                </div>
                <div style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 9, padding: "2px 5px", borderRadius: 5 }}>{l.createdAt || ""}</div>
              </div>
              <div style={{ padding: "8px 10px", display: "flex", gap: 5 }}>
                <button onClick={() => onPreview(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 10, fontWeight: 600, color: UI_MUTED }}>Vista</button>
                <button onClick={() => onEdit(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", background: "#ede9ff", color: UI_PRIMARY, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>Editar</button>
                <button onClick={() => onDownload(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", background: "#dcfce7", color: "#16a34a", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>HTML</button>
                <button onClick={() => onDelete(l.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LandingBuilder() {
  const [page, setPage] = useState("struct"); // struct | editor | list | preview
  const [landings, setLandings] = useState([]);
  const [current, setCurrent] = useState(mkDefault("clasica"));
  const [selStruct, setSelStruct] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadLandings().then(setLandings); }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const doSave = useCallback(async (d = current) => {
    const entry = { ...d, name: d.name || "Sin nombre", id: d.id || Date.now(), createdAt: d.createdAt || new Date().toLocaleDateString("es-CL") };
    const newList = [...landings];
    const idx = newList.findIndex(l => l.id === entry.id);
    if (idx >= 0) newList[idx] = entry; else newList.push(entry);
    await saveLandings(newList);
    setLandings(newList);
    setCurrent(entry);
    showToast("✅ Landing guardada en 'Landings Creadas'");
  }, [current, landings, showToast]);

  const doDownload = useCallback((id) => {
    const d = id ? landings.find(l => l.id === id) : current;
    if (!d) return;
    const html = buildExportHTML(d);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (d.name || "landing").replace(/\s+/g, "-").toLowerCase() + ".html";
    a.click();
  }, [current, landings]);

  const doDelete = useCallback(async (id) => {
    if (!confirm("¿Eliminar esta landing?")) return;
    const newList = landings.filter(l => l.id !== id);
    await saveLandings(newList);
    setLandings(newList);
    showToast("Landing eliminada", "error");
  }, [landings, showToast]);

  const doEdit = useCallback((id) => {
    const l = landings.find(l => l.id === id);
    if (l) { setCurrent(JSON.parse(JSON.stringify(l))); setPage("editor"); }
  }, [landings]);

  const doPreview = useCallback((id) => {
    const l = id ? landings.find(l => l.id === id) : current;
    if (l) { setPreviewData(l); setPage("preview"); }
  }, [landings, current]);

  const newLanding = useCallback(() => {
    setCurrent(mkDefault(SIDS[selStruct]));
    setPage("struct");
  }, [selStruct]);

  const applyStruct = useCallback(() => {
    setCurrent(mkDefault(SIDS[selStruct]));
    setPage("editor");
  }, [selStruct]);

  const topBtnStyle = (active) => ({
    padding: "7px 14px", borderRadius: UI_RADIUS, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
    display: "flex", alignItems: "center", gap: 5, transition: "all .15s",
    background: active ? "#ede9ff" : "transparent", color: active ? UI_PRIMARY : UI_MUTED,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", minHeight: 700, background: UI_BG, fontFamily: UI_FONT }}>
      {/* TOP NAV */}
      <div style={{ height: 58, background: UI_CARD, boxShadow: UI_SHADOW, display: "flex", alignItems: "center", padding: "0 18px", gap: 6, flexShrink: 0, zIndex: 100 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: UI_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: UI_SHADOW_MD }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>L</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: UI_TEXT, marginRight: 10 }}>LandingBuilder</span>
        <div style={{ width: 1, height: 22, background: UI_BORDER, margin: "0 4px" }} />
        <button style={topBtnStyle(page === "struct")} onClick={() => setPage("struct")}>Estructura</button>
        <button style={topBtnStyle(page === "editor")} onClick={() => setPage("editor")}>Editor</button>
        <button style={topBtnStyle(page === "list")} onClick={() => setPage("list")}>Mis Landings</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
          {page !== "preview" && <>
            <button onClick={newLanding} style={{ padding: "7px 14px", borderRadius: UI_RADIUS, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 12, fontWeight: 600, color: UI_MUTED }}>+ Nueva</button>
            <button onClick={() => doPreview(null)} style={{ padding: "7px 14px", borderRadius: UI_RADIUS, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 12, fontWeight: 600, color: UI_MUTED }}>Vista Previa</button>
            <button onClick={() => doSave()} style={{ padding: "7px 16px", borderRadius: UI_RADIUS, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 8px rgba(34,197,94,.3)" }}>Guardar</button>
            <button onClick={() => doDownload(null)} style={{ padding: "7px 16px", borderRadius: UI_RADIUS, border: "none", background: UI_PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, boxShadow: UI_SHADOW_MD }}>↓ HTML</button>
          </>}
          {page === "preview" && <button onClick={() => setPage("editor")} style={{ padding: "7px 14px", borderRadius: UI_RADIUS, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 12, fontWeight: 600, color: UI_MUTED }}>← Volver</button>}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* PAGES */}
      {page === "struct" && (
        <StructureSelector selected={selStruct} onSelect={setSelStruct} onApply={applyStruct} />
      )}

      {page === "editor" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar editor */}
          <div style={{ width: 288, flexShrink: 0, background: UI_BG, borderRight: `1px solid ${UI_BORDER}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <EditorSidebar data={current} setData={setCurrent} onSave={() => doSave()} />
          </div>
          {/* Preview — scrollable outer, centered inner */}
          <div style={{ flex: 1, overflowY: "auto", background: UI_BG, minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20, minHeight: "100%" }}>
              <div style={{ fontSize: 11, color: UI_MUTED, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 10 }}>
                Vista Previa — <span style={{ color: UI_PRIMARY }}>{SNAMES[SIDS.indexOf(current.struct || "clasica")] || "Clásica"}</span>
              </div>
              <div style={{ background: UI_CARD, borderRadius: UI_RADIUS + 2, overflow: "hidden", boxShadow: "0 4px 24px rgba(114,103,239,.12)", width: "100%", maxWidth: 580 }}>
                <LivePreview data={current} />
              </div>
              <p style={{ fontSize: 11, color: UI_MUTED, marginTop: 10, opacity: .7 }}>Los cambios se reflejan al instante</p>
            </div>
          </div>
        </div>
      )}

      {page === "list" && (
        <LandingsList
          landings={landings}
          onNew={newLanding}
          onEdit={doEdit}
          onPreview={doPreview}
          onDelete={doDelete}
          onDownload={doDownload}
        />
      )}

      {page === "preview" && previewData && (
        <div style={{ flex: 1, overflow: "auto", background: "#1e1e2e", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#16162a", padding: "10px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <button onClick={() => setPage("editor")} style={{ padding: "6px 14px", borderRadius: UI_RADIUS, border: "1px solid rgba(255,255,255,.15)", color: "#a0a0c0", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>← Volver</button>
            <span style={{ color: "#7070a0", fontSize: 12, fontWeight: 500 }}>{previewData.name}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => doSave(previewData)} style={{ padding: "7px 16px", borderRadius: UI_RADIUS, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Guardar</button>
              <button onClick={() => doDownload(previewData.id)} style={{ padding: "7px 16px", borderRadius: UI_RADIUS, border: "none", background: UI_PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>↓ HTML</button>
            </div>
          </div>
          <div style={{ background: "#fff" }}>
            <LivePreview data={previewData} />
          </div>
        </div>
      )}
    </div>
  );
}
