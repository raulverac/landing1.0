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

const CONTAINERS = [
  { id: "full",           label: "Full Screen",    desc: "Sin límite de ancho",  maxW: null, barW: "100%" },
  { id: "container",      label: "container",       desc: "≤ 1320px",             maxW: 1320, barW: "96%" },
  { id: "container-xl",   label: "container-xl",    desc: "≤ 1140px",             maxW: 1140, barW: "83%" },
  { id: "container-lg",   label: "container-lg",    desc: "≤ 960px",              maxW: 960,  barW: "70%" },
  { id: "container-md",   label: "container-md",    desc: "≤ 720px",              maxW: 720,  barW: "52%" },
  { id: "container-sm",   label: "container-sm",    desc: "≤ 540px",              maxW: 540,  barW: "39%" },
];

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const mkDefault = (struct = "clasica") => ({
  id: null,
  name: "Mi Nueva Landing",
  createdAt: null,
  containerType: "full",
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
      { icon: "🚀", title: "Estrategia", desc: "Planificamos el camino al éxito.", imgUrl: "", titleSize: 14, descSize: 12 },
      { icon: "🎨", title: "Diseño", desc: "Creamos experiencias visuales memorables.", imgUrl: "", titleSize: 14, descSize: 12 },
      { icon: "📈", title: "Crecimiento", desc: "Potenciamos tus métricas.", imgUrl: "", titleSize: 14, descSize: 12 },
      { icon: "🛡", title: "Seguridad", desc: "Protegemos tu negocio.", imgUrl: "", titleSize: 14, descSize: 12 },
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

  // ── Header ──────────────────────────────────────────────────────────────────
  const hdr = `<header class="sticky-top" style="background:${d.header.bgColor};z-index:100">
    <div class="container-fluid px-3 px-md-4">
      <div class="d-flex align-items-center justify-content-between" style="min-height:58px">
        <a href="#" style="color:${d.header.textColor};font-weight:700;font-size:18px;text-decoration:none">
          ${d.header.logoUrl ? `<img src="${d.header.logoUrl}" style="height:${d.header.logoSize||30}px;object-fit:contain;max-width:180px">` : d.header.logoText}
        </a>
        <nav class="d-none d-md-flex align-items-center gap-3">
          ${(d.header.menu || []).map(m => `<a href="${m.h}" style="color:${d.header.textColor};text-decoration:none;font-size:14px;opacity:.85">${m.l}</a>`).join("")}
        </nav>
      </div>
    </div>
  </header>`;

  // ── Hero form helper ────────────────────────────────────────────────────────
  const mkFormFields = (f) => {
    const fields = (f.fields || []).map(field => `
      <div class="mb-2">
        <label style="display:block;color:${f.textColor||"#fff"};font-size:12px;margin-bottom:3px;opacity:.85">${field.label}${field.required?'<span style="color:#ef4444;margin-left:2px">*</span>':""}</label>
        ${field.type==="textarea"
          ? `<textarea placeholder="${field.placeholder}" rows="3" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:8px 10px;color:${f.textColor||"#fff"};font-size:13px;resize:none;box-sizing:border-box"></textarea>`
          : `<input type="${field.type||"text"}" placeholder="${field.placeholder}" style="width:100%;background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:8px 10px;color:${f.textColor||"#fff"};font-size:13px;box-sizing:border-box">`}
      </div>`).join("");
    return `
      ${f.title?`<h4 style="color:${f.textColor||"#fff"};font-weight:700;font-size:18px;margin-bottom:4px">${f.title}</h4>`:""}
      ${f.subtitle?`<p style="color:${f.textColor||"#ccc"};opacity:.75;font-size:13px;margin-bottom:12px">${f.subtitle}</p>`:""}
      ${fields}
      ${f.privacyText?`<p style="color:${f.textColor||"#ccc"};font-size:10px;opacity:.6;line-height:1.5;margin-bottom:8px">${f.privacyText}</p>`:""}
      ${f.showPrivacyCheck?`<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:${f.textColor||"#ccc"};opacity:.75;margin-bottom:10px;cursor:pointer"><input type="checkbox"> <span>Acepto recibir otras comunicaciones</span></label>`:""}
      <button class="w-100 mt-1" style="background:${f.btnColor||ACC};color:${f.btnTextColor||DARK};border:none;border-radius:5px;padding:10px;font-weight:700;font-size:14px;cursor:pointer">${f.btnText||"Enviar"}</button>`;
  };

  // ── Hero ────────────────────────────────────────────────────────────────────
  const showHeroForm = d.form && d.form.showInHero;
  const hero = `<section id="hero" style="position:relative;min-height:${showHeroForm?500:420}px;overflow:hidden" class="d-flex align-items-center">
    ${slides.map((sl, i) => `<div class="hero-sl" style="position:absolute;inset:0;background:url('${sl}') center/cover;opacity:${i===0?1:0};transition:opacity 1s"></div>`).join("")}
    <div style="position:absolute;inset:0;background:rgba(0,0,0,${d.hero.overlay})"></div>
    <div style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:3">
      ${slides.map((_,i)=>`<div class="hero-dt" style="width:8px;height:8px;border-radius:50%;background:#fff;opacity:${i===0?1:0.4};cursor:pointer"></div>`).join("")}
    </div>
    <div class="container-fluid position-relative py-5" style="z-index:2">
      ${showHeroForm
        ? `<div class="row g-4 align-items-center">
            <div class="col-12 col-lg-6">
              <h1 style="color:#fff;font-size:clamp(24px,4vw,44px);font-weight:700;line-height:1.2;margin-bottom:14px">${d.hero.title}</h1>
              <p style="color:rgba(255,255,255,.85);font-size:clamp(14px,2vw,16px);margin-bottom:24px">${d.hero.desc}</p>
              <a href="${d.hero.btnHref}" style="display:inline-block;background:${d.hero.btnColor};color:${DARK};padding:12px 32px;border-radius:5px;text-decoration:none;font-weight:700;font-size:15px">${d.hero.btnText}</a>
            </div>
            <div class="col-12 col-lg-5 offset-lg-1">
              <div style="background:${d.form.bgColor||DARK};border-radius:10px;padding:22px 24px">${mkFormFields(d.form)}</div>
            </div>
          </div>`
        : `<div class="row justify-content-center">
            <div class="col-12 col-md-8 text-center">
              <h1 style="color:#fff;font-size:clamp(26px,5vw,48px);font-weight:700;line-height:1.2;margin-bottom:16px">${d.hero.title}</h1>
              <p style="color:rgba(255,255,255,.85);font-size:clamp(14px,2vw,17px);margin-bottom:28px">${d.hero.desc}</p>
              <a href="${d.hero.btnHref}" style="display:inline-block;background:${d.hero.btnColor};color:${DARK};padding:13px 36px;border-radius:5px;text-decoration:none;font-weight:700;font-size:15px">${d.hero.btnText}</a>
            </div>
          </div>`
      }
    </div>
  </section>`;

  // ── Sections mid ────────────────────────────────────────────────────────────
  let mid = "";

  if (s === "clasica" || s === "storytelling") {
    const nCols = Math.min(d.services.cards.length, 4);
    const colCls = nCols === 1 ? "col-12" : nCols === 2 ? "col-12 col-sm-6" : nCols === 3 ? "col-12 col-sm-6 col-md-4" : "col-12 col-sm-6 col-xl-3";
    mid += `<section id="services" style="background:${d.services.bgColor};padding:56px 0">
      <div class="container-fluid px-4">
        <div class="text-center mb-4">
          <h2 style="color:${d.services.titleColor};font-size:clamp(22px,3vw,32px);font-weight:700;margin-bottom:8px">${d.services.title}</h2>
          <p style="color:${d.services.titleColor};opacity:.6;font-size:15px">${d.services.subtitle}</p>
        </div>
        <div class="row g-3">
          ${d.services.cards.map(c => `<div class="${colCls}">
            <div style="background:${d.services.cardBg};border-radius:9px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06);height:100%">
              ${c.imgUrl ? `<img src="${c.imgUrl}" style="width:100%;height:160px;object-fit:cover;display:block">` : ""}
              <div style="padding:20px;text-align:center">
                ${!c.imgUrl ? `<div style="font-size:28px;margin-bottom:10px">${c.icon}</div>` : ""}
                <div style="color:${d.services.titleColor};font-weight:600;font-size:${c.titleSize||14}px;margin-bottom:6px">${c.title}</div>
                <div style="color:${d.services.titleColor};opacity:.6;font-size:${c.descSize||12}px;line-height:1.6">${c.desc}</div>
              </div>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  if (s === "beneficios") {
    const nB = Math.min(d.benefits.items.length, 3);
    const colB = nB === 1 ? "col-12" : nB === 2 ? "col-12 col-md-6" : "col-12 col-sm-6 col-md-4";
    mid += `<section id="services" style="background:${d.benefits.bgColor};padding:56px 0">
      <div class="container-fluid px-4">
        <div class="text-center mb-4">
          <h2 style="color:${d.benefits.titleColor};font-size:clamp(22px,3vw,32px);font-weight:700;margin-bottom:8px">${d.benefits.title}</h2>
          <p style="color:${d.benefits.titleColor};opacity:.6;font-size:15px">${d.benefits.subtitle}</p>
        </div>
        <div class="row g-4">
          ${d.benefits.items.map(b => `<div class="${colB}">
            <div class="text-center p-3">
              <div style="width:64px;height:64px;border-radius:50%;background:${d.benefits.accent};display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px">${b.icon}</div>
              <div style="color:${d.benefits.titleColor};font-weight:700;font-size:16px;margin-bottom:6px">${b.title}</div>
              <div style="color:${d.benefits.titleColor};opacity:.6;font-size:13px;line-height:1.7">${b.desc}</div>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  if (s === "urgencia") {
    const uB = d.urgency.bgColor || DARK, uT = d.urgency.textColor || "#fff";
    mid += `<section id="services" style="background:${uB};padding:52px 0">
      <div class="container-fluid px-4">
        <div class="text-center mb-4">
          <div style="color:${uT};font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;opacity:.6">Oferta especial</div>
          <h2 style="color:${uT};font-size:clamp(20px,3vw,30px);font-weight:700;margin-bottom:18px">${d.urgency.headline}</h2>
          <div style="font-size:clamp(36px,6vw,52px);font-weight:700;color:${d.hero.btnColor};font-family:monospace;letter-spacing:4px" id="cdt">00:00:00</div>
          <div class="d-flex justify-content-center gap-4 mt-1">
            ${["Horas","Minutos","Segundos"].map(l=>`<span style="color:${uT};font-size:11px;opacity:.55">${l}</span>`).join("")}
          </div>
        </div>
        <div class="d-flex justify-content-center flex-wrap gap-4 mt-4">
          ${d.urgency.badges.map(b=>`<div class="d-flex flex-column align-items-center gap-2">
            <div style="width:48px;height:48px;border-radius:50%;background:${d.hero.btnColor};display:flex;align-items:center;justify-content:center;font-size:22px">${b.icon}</div>
            <span style="color:${uT};font-size:12px;opacity:.8">${b.text}</span>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  if (s === "profesional") {
    const p = d.profesional || {};
    const accentC = p.heroBtnColor || "#c8f135";
    mid = `
      <section style="background:${p.heroBgColor||DARK};padding:72px 0">
        <div class="container-fluid px-4">
          <div class="row justify-content-center">
            <div class="col-12 col-lg-8">
              ${p.badge?`<div style="display:inline-block;background:${accentC};color:${DARK};font-size:11px;font-weight:700;padding:3px 12px;border-radius:3px;margin-bottom:18px;text-transform:uppercase;letter-spacing:1px">${p.badge}</div>`:""}
              <h1 style="color:#fff;font-size:clamp(26px,4vw,44px);font-weight:700;line-height:1.25;margin-bottom:18px">
                ${p.heroTitle} <span style="color:${accentC}">${p.heroTitleAccent}</span>
              </h1>
              <p style="color:rgba(255,255,255,.75);font-size:16px;line-height:1.7;margin-bottom:28px">${p.heroDesc}</p>
              <a href="#footer" style="display:inline-block;background:${accentC};color:${p.heroBtnTextColor||DARK};padding:13px 34px;border-radius:5px;text-decoration:none;font-weight:700;font-size:15px">${p.heroBtnText}</a>
            </div>
          </div>
        </div>
      </section>
      <section style="background:${p.ecosystemBgColor||"#fff"};padding:64px 0">
        <div class="container-fluid px-4">
          <div class="text-center mb-5">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${p.ecosystemTitle}</div>
            <h2 style="font-size:clamp(24px,3vw,36px);font-weight:900;color:${DARK};margin-bottom:10px">${p.ecosystemSubtitle}</h2>
            <div style="width:36px;height:3px;background:${p.ecosystemAccent||accentC};margin:0 auto 12px"></div>
            <p style="font-size:15px;color:#6b7280;max-width:500px;margin:0 auto">${p.ecosystemDesc}</p>
          </div>
          <div class="row g-3">
            ${(p.ecosystemCards||[]).map(c=>`<div class="col-12 col-sm-6 col-lg-3">
              <div style="border:1px solid #e5e7eb;border-radius:8px;padding:18px;height:100%">
                <div style="font-size:10px;font-weight:700;color:${p.ecosystemAccent||accentC};text-transform:uppercase;margin-bottom:6px;letter-spacing:.5px">${c.tag}</div>
                <div style="font-size:14px;font-weight:700;color:${DARK};margin-bottom:6px">${c.title}</div>
                <div style="font-size:13px;color:#6b7280;line-height:1.6">${c.desc}</div>
              </div>
            </div>`).join("")}
          </div>
        </div>
      </section>
      <section style="background:${p.catalogBgColor||"#f8f9fa"};padding:64px 0">
        <div class="container-fluid px-4">
          <h2 style="font-size:clamp(22px,3vw,30px);font-weight:700;color:${DARK};margin-bottom:6px">${p.catalogTitle}</h2>
          <p style="font-size:15px;color:#6b7280;margin-bottom:24px">${p.catalogSubtitle}</p>
          <div style="background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb">
            <div class="row g-4">
              ${(p.catalogCols||[]).map(col=>`<div class="col-12 col-md-4">
                <div style="font-size:24px;margin-bottom:8px">${col.icon}</div>
                <div style="font-size:16px;font-weight:700;color:${DARK};margin-bottom:10px">${col.title}</div>
                ${(col.items||[]).map(it=>`<div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start">
                  <div style="width:7px;height:7px;border-radius:50%;background:${accentC};flex-shrink:0;margin-top:5px"></div>
                  <span style="font-size:13px;color:#374151;line-height:1.5">${it}</span>
                </div>`).join("")}
              </div>`).join("")}
            </div>
          </div>
        </div>
      </section>
      <section style="background:${p.phasesBgColor||"#fff"};padding:64px 0">
        <div class="container-fluid px-4">
          <div class="text-center mb-5">
            <h2 style="font-size:clamp(22px,3vw,30px);font-weight:700;color:${DARK};margin-bottom:8px">${p.phasesTitle}</h2>
            <div style="width:36px;height:3px;background:${accentC};margin:0 auto 10px"></div>
            <p style="font-size:15px;color:#6b7280">${p.phasesSubtitle}</p>
          </div>
          <div class="row g-4">
            ${(p.phases||[]).map(ph=>`<div class="col-12 col-sm-6 col-md-4">
              <div class="text-center p-3">
                <div style="width:56px;height:56px;border-radius:50%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 14px">${ph.icon}</div>
                <div style="display:inline-block;background:${accentC};color:${DARK};font-size:10px;font-weight:700;padding:2px 12px;border-radius:10px;margin-bottom:8px">Fase ${ph.num}</div>
                <div style="font-size:14px;font-weight:700;color:${DARK};margin-bottom:6px">${ph.title}</div>
                <div style="font-size:13px;color:#6b7280;line-height:1.6">${ph.desc}</div>
              </div>
            </div>`).join("")}
          </div>
        </div>
      </section>`;
  }

  if (s === "storytelling") {
    mid += `<section id="about" style="background:${d.story.bgColor};padding:56px 0">
      <div class="container-fluid px-4">
        <h2 style="color:${d.story.titleColor};font-size:clamp(22px,3vw,30px);font-weight:700;text-align:center;margin-bottom:36px">${d.story.title}</h2>
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 position-relative">
            <div style="position:absolute;left:18px;top:0;bottom:0;width:2px;background:${d.hero.btnColor}"></div>
            ${d.story.steps.map(st=>`<div style="display:flex;gap:16px;margin-bottom:24px;align-items:flex-start">
              <div style="width:36px;height:36px;border-radius:50%;background:${d.hero.btnColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:${DARK};flex-shrink:0;z-index:1">${st.num}</div>
              <div style="flex:1;background:#f9f9f9;border-radius:8px;padding:14px">
                <div style="font-weight:700;color:${d.story.titleColor};font-size:14px;margin-bottom:4px">${st.title}</div>
                <div style="color:${d.story.titleColor};opacity:.65;font-size:13px;line-height:1.6">${st.desc}</div>
              </div>
            </div>`).join("")}
            <div style="background:${d.hero.btnColor};border-radius:9px;padding:24px;margin-top:8px">
              <div style="font-size:36px;color:${DARK};line-height:.8;margin-bottom:8px">"</div>
              <p style="color:${DARK};font-size:15px;font-style:italic;line-height:1.65;margin-bottom:8px">${d.story.quote}</p>
              <div style="color:${DARK};font-size:12px;font-weight:600;opacity:.75">${d.story.quoteAuthor}</div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  } else if (s === "urgencia") {
    mid += `<section id="about" style="background:#fff;padding:52px 0">
      <div class="container-fluid px-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-7 col-lg-5">
            <h3 style="font-size:clamp(18px,2.5vw,22px);font-weight:700;color:${DARK};margin-bottom:20px">${d.urgency.listTitle}</h3>
            ${d.urgency.items.map(it=>`<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px">
              <div style="width:22px;height:22px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;color:#fff;font-weight:700">✓</div>
              <span style="color:#374151;font-size:14px">${it}</span>
            </div>`).join("")}
            <div class="text-center mt-4">
              <a href="${d.hero.btnHref}" style="display:inline-block;background:${d.hero.btnColor};color:${DARK};padding:14px 40px;border-radius:5px;text-decoration:none;font-weight:700;font-size:16px">${d.hero.btnText}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  } else if (s !== "profesional") {
    const imgOrder = d.about.imgLeft ? "" : "order-md-2";
    const txtOrder = d.about.imgLeft ? "" : "order-md-1";
    mid += `<section id="about" style="background:${d.about.bgColor};padding:56px 0">
      <div class="container-fluid px-4">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-md-6 ${imgOrder}">
            ${d.about.mediaType==="video" && d.about.videoUrl
              ? `<iframe src="${d.about.videoUrl}" style="width:100%;height:300px;border-radius:10px;border:none" allowfullscreen></iframe>`
              : `<img src="${d.about.mediaUrl}" style="width:100%;border-radius:10px;object-fit:cover;max-height:340px;display:block" />`
            }
          </div>
          <div class="col-12 col-md-6 ${txtOrder}">
            <h2 style="color:${d.about.textColor};font-size:clamp(22px,3vw,30px);font-weight:700;margin-bottom:14px">${d.about.title}</h2>
            ${d.about.desc.split("\n\n").map(pp=>`<p style="color:${d.about.textColor};opacity:.75;font-size:15px;line-height:1.8;margin-bottom:10px">${pp}</p>`).join("")}
          </div>
        </div>
      </div>
    </section>`;
  }

  // ── Form helper (footer/standalone) ─────────────────────────────────────────
  const formHTML = (form) => {
    if (!form) return "";
    if (form.type === "embed" && form.embedCode) return `<div class="p-3">${form.embedCode}</div>`;
    const fields = (form.fields||[]).map(field=>`
      <div class="mb-3">
        <label style="display:block;color:${form.textColor||"#fff"};font-size:12px;margin-bottom:4px;opacity:.85">${field.label}${field.required?'<span style="color:#ef4444;margin-left:2px">*</span>':""}</label>
        ${field.type==="textarea"
          ? `<textarea placeholder="${field.placeholder}" rows="3" class="w-100" style="background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:10px 12px;color:${form.textColor||"#fff"};font-size:13px;resize:none;box-sizing:border-box"></textarea>`
          : `<input type="${field.type||"text"}" placeholder="${field.placeholder}" class="w-100" style="background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:10px 12px;color:${form.textColor||"#fff"};font-size:13px;box-sizing:border-box">`}
      </div>`).join("");
    return `
      ${form.title?`<h3 style="color:${form.textColor||"#fff"};font-weight:700;font-size:20px;margin-bottom:5px">${form.title}</h3>`:""}
      ${form.subtitle?`<p style="color:${form.textColor||"#ccc"};opacity:.75;font-size:14px;margin-bottom:16px">${form.subtitle}</p>`:""}
      ${fields}
      ${form.privacyText?`<p style="color:${form.textColor||"#ccc"};font-size:11px;opacity:.6;line-height:1.5;margin-bottom:10px">${form.privacyText}</p>`:""}
      ${form.showPrivacyCheck?`<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:${form.textColor||"#ccc"};opacity:.75;margin-bottom:12px;cursor:pointer"><input type="checkbox"> <span>Acepto recibir otras comunicaciones</span></label>`:""}
      <button class="w-100" style="background:${form.btnColor||ACC};color:${form.btnTextColor||DARK};border:none;border-radius:5px;padding:11px;font-weight:700;font-size:14px;cursor:pointer">${form.btnText||"Enviar"}</button>`;
  };

  // ── Footer ──────────────────────────────────────────────────────────────────
  const showFooterForm = d.form && d.form.showInFooter;
  const ftr = s === "profesional"
    ? `<footer id="footer" style="background:${d.footer.bgColor};padding:52px 0 24px">
        <div class="container-fluid px-4">
          <div class="row g-4 mb-4">
            <div class="col-12 ${showFooterForm?"col-md-6":"col-12"}">
              <div style="color:#fff;font-weight:700;font-size:20px;margin-bottom:10px">${d.header.logoText}</div>
              <p style="color:${d.footer.textColor};font-size:15px;line-height:1.7;margin-bottom:10px">${d.footer.desc}</p>
              <div style="color:${d.footer.textColor};font-size:13px;margin-bottom:4px">📍 ${d.footer.address}</div>
              <div style="color:${d.footer.textColor};font-size:13px">${d.footer.email}</div>
            </div>
            ${showFooterForm?`<div class="col-12 col-md-6">${formHTML(d.form)}</div>`:""}
          </div>
          <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:14px;text-align:center">
            <span style="color:${d.footer.textColor};font-size:12px;opacity:.6">${d.footer.copy}</span>
          </div>
        </div>
      </footer>`
    : `<footer id="footer" style="background:${d.footer.bgColor};padding:52px 0 24px">
        <div class="container-fluid px-4">
          <div class="row g-4 mb-4">
            <div class="col-12 col-md-5">
              <div style="color:#fff;font-weight:700;font-size:18px;margin-bottom:8px">${d.footer.company||d.header.logoText}</div>
              <p style="color:${d.footer.textColor};font-size:14px;line-height:1.7;margin-bottom:10px">${d.footer.desc}</p>
              <div style="color:${d.footer.textColor};font-size:13px;margin-bottom:4px">${d.footer.email}</div>
              <div style="color:${d.footer.textColor};font-size:13px;margin-bottom:4px">${d.footer.phone||""}</div>
              <div style="color:${d.footer.textColor};font-size:13px">${d.footer.address}</div>
            </div>
            ${showFooterForm
              ? `<div class="col-12 col-md-7">${formHTML(d.form)}</div>`
              : `<div class="col-6 col-md-3 offset-md-1">
                  <div style="color:#fff;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Contacto</div>
                  <div style="color:${d.footer.textColor};font-size:13px;margin-bottom:5px">${d.footer.email}</div>
                  <div style="color:${d.footer.textColor};font-size:13px;margin-bottom:5px">${d.footer.phone||""}</div>
                  <div style="color:${d.footer.textColor};font-size:13px">${d.footer.address}</div>
                </div>
                <div class="col-6 col-md-3">
                  <div style="color:#fff;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Navegación</div>
                  ${(d.header.menu||[]).map(m=>`<div style="margin-bottom:6px"><a href="${m.h}" style="color:${d.footer.textColor};font-size:13px;text-decoration:none;opacity:.8">${m.l}</a></div>`).join("")}
                </div>`
            }
          </div>
          <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:14px;text-align:center">
            <span style="color:${d.footer.textColor};font-size:12px;opacity:.6">${d.footer.copy}</span>
          </div>
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
    const unabCtCfg = CONTAINERS.find(c => c.id === (d.containerType || "full")) || CONTAINERS[0];
    const unabCtStyle = unabCtCfg.maxW ? `max-width:${unabCtCfg.maxW}px;margin:0 auto;` : "width:100%";
    return `<div style="font-family:'Segoe UI',sans-serif;${unabCtStyle};position:relative;${bgImg?`background-image:url('${bgImg}');background-size:cover;background-position:center;`:`background:${d.header.bgColor};`}">
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

  const ctCfg = CONTAINERS.find(c => c.id === (d.containerType || "full")) || CONTAINERS[0];
  const ctStyle = ctCfg.maxW ? `max-width:${ctCfg.maxW}px;margin:0 auto;` : "width:100%";
  return `<div style="font-family:'Segoe UI',sans-serif;${ctStyle}">${hdr}${hero}${mid}${ftr}</div>`;
};

// ─── EXPORT HTML ──────────────────────────────────────────────────────────────
const buildExportHTML = (d) => {
  const utm = buildUTM(d.utm);
  const slides = (d.hero.slides || []).filter(Boolean);
  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif}
.hs{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1s}
.hs.a{opacity:1}
img{max-width:100%;height:auto}
input,textarea,select,button{font-family:inherit}
@media(max-width:767px){
  h1{font-size:clamp(22px,6vw,36px)!important}
  h2{font-size:clamp(18px,5vw,28px)!important}
  section{padding-top:40px!important;padding-bottom:40px!important}
  footer{padding-top:40px!important}
}
</style>
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: UI_BG, fontFamily: UI_FONT, overflow: "hidden" }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 28px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: UI_TEXT, marginBottom: 5 }}>Elige la estructura de tu landing</h1>
          <p style={{ fontSize: 13, color: UI_MUTED, maxWidth: 480 }}>Selecciona la plantilla que mejor se adapte a tu objetivo. Podrás personalizar todo en el editor.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12 }}>
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
      </div>
      {/* Floating bar overlaid on templates */}
      <div style={{
        flexShrink: 0,
        marginTop: -60,
        position: "relative",
        zIndex: 10,
        padding: "14px 28px",
        background: "rgba(240,242,248,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 -8px 32px rgba(114,103,239,0.13)",
        borderTop: `1px solid rgba(233,236,239,0.7)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
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
  const line = (w = "100%", h = 3, bg = "#e5e7eb") => <div style={{ background: bg, borderRadius: 2, height: h, marginBottom: 2, width: w }} />;
  const btn = (w = "50%", bg = ACC) => <div style={{ background: bg, borderRadius: 3, height: 7, width: w, margin: "3px auto 0" }} />;

  const phoneContent = {
    clasica: (
      <>
        {/* Hero */}
        <div style={{ background: ACC, height: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 6px" }}>
          {line("70%", 3, "rgba(26,37,53,.5)")}{line("45%", 3, "rgba(26,37,53,.5)")}{btn("38%", DARK)}
        </div>
        {/* Imagen + texto */}
        <div style={{ padding: "4px 6px" }}>
          <div style={{ background: "#e5e7eb", borderRadius: 3, height: 18, marginBottom: 4 }} />
          {line("90%")}{line("75%")}{line("55%")}
          {btn("60%")}
        </div>
        {/* 3 iconos stacked */}
        <div style={{ padding: "0 6px 4px", display: "flex", flexDirection: "column", gap: 3 }}>
          {[1,2,3].map(k => <div key={k} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: DARK, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{line()}{line("70%", 2)}</div>
          </div>)}
        </div>
        {/* Form */}
        <div style={{ padding: "0 6px 2px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2].map(k => <div key={k} style={{ background: "#f0f0f0", borderRadius: 3, height: 7 }} />)}
          {btn("80%", DARK)}
        </div>
      </>
    ),
    beneficios: (
      <>
        <div style={{ background: ACC, height: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 6px" }}>
          {line("70%", 3, "rgba(26,37,53,.5)")}{line("45%", 3, "rgba(26,37,53,.5)")}{btn("38%", DARK)}
        </div>
        <div style={{ padding: "4px 6px 2px", textAlign: "center" }}>
          {line("55%", 4, DARK)}<div style={{ marginTop: 2 }} />{line("80%")}{line("65%")}
        </div>
        {/* Beneficios apilados */}
        <div style={{ padding: "2px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
          {[1,2,3].map(k => <div key={k} style={{ display: "flex", gap: 4, alignItems: "center", background: "#f3f4f6", borderRadius: 3, padding: "3px 4px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: ACC, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{line("85%", 2)}{line("65%", 2)}</div>
          </div>)}
        </div>
        {/* Form */}
        <div style={{ padding: "3px 6px 2px" }}>
          <div style={{ background: "#f0f0f0", borderRadius: 3, height: 7, marginBottom: 2 }} />
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 3, height: 7 }} />
            <div style={{ background: ACC, borderRadius: 3, height: 7, width: 24 }} />
          </div>
        </div>
      </>
    ),
    storytelling: (
      <>
        <div style={{ background: ACC, height: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 6px" }}>
          {line("70%", 3, "rgba(26,37,53,.5)")}{line("45%", 3, "rgba(26,37,53,.5)")}
        </div>
        {/* Pasos */}
        <div style={{ padding: "4px 6px 2px", display: "flex", flexDirection: "column", gap: 3 }}>
          {[1,2,3].map(n => <div key={n} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: ACC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, fontWeight: 700, color: DARK, flexShrink: 0 }}>{n}</div>
            <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 3, height: 12 }} />
          </div>)}
        </div>
        {/* CTA banner */}
        <div style={{ background: ACC, borderRadius: 3, padding: 4, margin: "2px 6px" }}>
          {line("85%")}{line("65%")}{btn("50%", DARK)}
        </div>
        {/* Form */}
        <div style={{ padding: "2px 6px 2px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2].map(k => <div key={k} style={{ background: "#f0f0f0", borderRadius: 3, height: 7 }} />)}
          {btn("80%", DARK)}
        </div>
      </>
    ),
    urgencia: (
      <>
        <div style={{ background: ACC, height: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 6px" }}>
          {line("70%", 3, "rgba(26,37,53,.5)")}{line("45%", 3, "rgba(26,37,53,.5)")}{btn("38%", DARK)}
        </div>
        {/* Countdown */}
        <div style={{ background: DARK, margin: "3px 6px", borderRadius: 4, padding: 4 }}>
          <div style={{ fontSize: 5, color: "rgba(255,255,255,.6)", textAlign: "center", marginBottom: 2 }}>Tiempo limitado</div>
          <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
            {["02","15","37"].map((v, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <span style={{ background: "#fff", borderRadius: 2, width: 10, height: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, fontWeight: 700, color: DARK }}>{v}</span>
              {i < 2 && <span style={{ color: "#fff", fontWeight: 700, fontSize: 7 }}>:</span>}
            </span>)}
          </div>
        </div>
        {/* Beneficios col */}
        <div style={{ padding: "2px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2,3].map(k => <div key={k} style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACC, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{line("90%", 2)}{line("70%", 2)}</div>
          </div>)}
        </div>
        {/* Form */}
        <div style={{ padding: "2px 6px 2px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2].map(k => <div key={k} style={{ background: "#f0f0f0", borderRadius: 3, height: 7 }} />)}
          {btn("80%", DARK)}
        </div>
      </>
    ),
    profesional: (
      <>
        <div style={{ background: "#c8f135", height: 8, display: "flex", alignItems: "center", padding: "0 6px", gap: 2 }}>
          <div style={{ width: 6, height: 6, borderRadius: 1, background: DARK }} />
          <div style={{ flex: 1, height: 2, background: "rgba(26,37,53,.4)", borderRadius: 1 }} />
        </div>
        <div style={{ background: ACC, height: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 6px" }}>
          {line("70%", 3, "rgba(26,37,53,.5)")}{line("45%", 3, "rgba(26,37,53,.5)")}
          <div style={{ background: DARK, borderRadius: 3, height: 6, width: 30, marginTop: 1 }} />
        </div>
        {/* Catálogo 2 col */}
        <div style={{ padding: "3px 6px 2px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {[1,2,3,4].map(k => <div key={k} style={{ background: "#f3f4f6", borderRadius: 3, padding: "3px 3px" }}>
            <div style={{ background: "#c8f135", borderRadius: 1, height: 3, width: "60%", marginBottom: 1 }} />
            {line("90%", 2)}{line("70%", 2)}
          </div>)}
        </div>
        {/* Fases */}
        <div style={{ padding: "2px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2,3].map(k => <div key={k} style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8f135", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{line("80%", 2)}{line("60%", 2)}</div>
          </div>)}
        </div>
        {/* Footer form */}
        <div style={{ background: DARK, padding: "3px 6px 2px", marginTop: 2 }}>
          {[1,2].map(k => <div key={k} style={{ background: "rgba(255,255,255,.15)", borderRadius: 3, height: 6, marginBottom: 2 }} />)}
          <div style={{ background: "#c8f135", borderRadius: 3, height: 7, width: "55%", margin: "0 auto" }} />
        </div>
      </>
    ),
    unab: (
      <>
        {/* Header con logo */}
        <div style={{ background: DARK, height: 14, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: "rgba(255,255,255,.35)" }} />
            {line("28px", 2, "rgba(255,255,255,.3)")}
          </div>
          <div style={{ background: ACC, borderRadius: 2, height: 6, width: 18 }} />
        </div>
        {/* Hero background con contenido */}
        <div style={{ background: "rgba(26,37,53,.8)", padding: "5px 6px" }}>
          {line("75%", 3, "rgba(255,255,255,.6)")}{line("55%", 2, "rgba(255,255,255,.4)")}
        </div>
        {/* Programas */}
        <div style={{ background: "rgba(255,255,255,.95)", margin: "2px 6px", borderRadius: 3, padding: 4 }}>
          {line("60%", 3, DARK)}<div style={{ marginTop: 2 }} />
          {[1,2,3].map(k => <div key={k} style={{ display: "flex", gap: 2, marginBottom: 2, alignItems: "center" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: ACC, flexShrink: 0 }} />
            {line("80%", 2)}
          </div>)}
        </div>
        {/* Form */}
        <div style={{ background: "rgba(255,255,255,.15)", margin: "2px 6px", borderRadius: 3, padding: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {[1,2,3].map(k => <div key={k} style={{ background: "rgba(255,255,255,.4)", borderRadius: 2, height: 6 }} />)}
          <div style={{ background: ACC, borderRadius: 3, height: 7, width: "70%", margin: "1px auto 0" }} />
        </div>
        {/* Acreditaciones */}
        <div style={{ background: DARK, padding: "3px 6px", display: "flex", gap: 3, justifyContent: "center" }}>
          {[1,2,3,4].map(k => <div key={k} style={{ background: "rgba(255,255,255,.2)", borderRadius: 2, width: 14, height: 8 }} />)}
        </div>
      </>
    ),
  };

  return (
    <div style={{ padding: "0 10px 10px", display: "flex", justifyContent: "center" }}>
      {/* Phone shell */}
      <div style={{ width: "100%", maxWidth: 90, border: `2px solid ${DARK}`, borderRadius: 12, overflow: "hidden", background: "#f9f9f9", boxShadow: `0 2px 8px rgba(0,0,0,.12)` }}>
        {/* Status bar / notch */}
        <div style={{ background: DARK, height: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 16, height: 3, background: "rgba(255,255,255,.25)", borderRadius: 10 }} />
        </div>
        {/* Screen content */}
        <div style={{ background: "#ffffff" }}>
          {phoneContent[id]}
        </div>
        {/* Home indicator */}
        <div style={{ background: "#f0f0f0", height: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 22, height: 2, background: "#ccc", borderRadius: 10 }} />
        </div>
      </div>
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
          <Panel title="📐 Ancho de la página">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {CONTAINERS.map(c => {
                const active = (data.containerType || "full") === c.id;
                return (
                  <button key={c.id} onClick={() => setData(d => ({ ...d, containerType: c.id }))}
                    style={{ padding: "7px 8px", border: `2px solid ${active ? UI_PRIMARY : UI_BORDER}`, borderRadius: UI_RADIUS, background: active ? "#ede9ff" : UI_CARD, cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? UI_PRIMARY : UI_TEXT, marginBottom: 1 }}>{c.label}</div>
                    <div style={{ fontSize: 9, color: UI_MUTED, marginBottom: 4 }}>{c.desc}</div>
                    <div style={{ height: 3, background: UI_BORDER, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: c.barW, background: active ? UI_PRIMARY : "#c8cdd4", borderRadius: 2, transition: "background .15s" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>
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
                  style={{ ...inputStyle, resize: "none", marginBottom: 6 }} />
                <ImgField label="Imagen rectangular (opcional)" value={c.imgUrl || ""} onChange={v => updArr("services", "cards", i, "imgUrl", v)} />
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Título — {c.titleSize || 14}px</label>
                    <input type="range" min="10" max="32" value={c.titleSize || 14}
                      onChange={e => updArr("services", "cards", i, "titleSize", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: UI_PRIMARY, cursor: "pointer" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Texto — {c.descSize || 12}px</label>
                    <input type="range" min="8" max="24" value={c.descSize || 12}
                      onChange={e => updArr("services", "cards", i, "descSize", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: UI_PRIMARY, cursor: "pointer" }} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setData(d => ({ ...d, services: { ...d.services, cards: [...d.services.cards, { icon: "⭐", title: "Nuevo", desc: "Descripción.", imgUrl: "", titleSize: 14, descSize: 12 }] } }))}
              style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 11, color: UI_PRIMARY, fontWeight: 600 }}>+ Agregar servicio</button>
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

  const lpCtCfg = CONTAINERS.find(c => c.id === (data.containerType || "full")) || CONTAINERS[0];
  const lpCtStyle = lpCtCfg.maxW ? { maxWidth: lpCtCfg.maxW, margin: "0 auto" } : {};

  if (s === "unab") {
    const u = data.unab || {};
    const bgImg = slides[0] || "";
    return (
      <div style={{ fontFamily: "'Segoe UI',sans-serif", ...lpCtStyle, position: "relative", backgroundImage: bgImg ? `url(${bgImg})` : "none", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: bgImg ? undefined : data.header.bgColor }}>
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
    <div style={{ fontFamily: "'Segoe UI',sans-serif", ...lpCtStyle }}>
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
              <div key={i} style={{ background: data.services.cardBg, borderRadius: 9, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
                {c.imgUrl && <img src={c.imgUrl} alt={c.title} style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />}
                <div style={{ padding: 10, textAlign: "center" }}>
                  {!c.imgUrl && <div style={{ fontSize: 16, marginBottom: 6 }}>{c.icon}</div>}
                  <div style={{ color: data.services.titleColor, fontWeight: 600, fontSize: Math.round((c.titleSize || 14) * 0.75), marginBottom: 3 }}>{c.title}</div>
                  <div style={{ color: data.services.titleColor, opacity: .6, fontSize: Math.round((c.descSize || 12) * 0.78), lineHeight: 1.5 }}>{c.desc}</div>
                </div>
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
const LandingsList = ({ landings, onNew, onEdit, onPreview, onDelete, onDownload, onPublish }) => {
  const [copied, setCopied] = useState(null);
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(origin + url).then(() => { setCopied(id); setTimeout(() => setCopied(null), 1800); });
  };
  return (
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {landings.map(l => {
            const utm = buildUTM(l.utm || {});
            const isPublished = !!l.publishedUrl;
            return (
              <div key={l.id} style={{ background: UI_CARD, borderRadius: UI_RADIUS + 2, boxShadow: UI_SHADOW, overflow: "hidden" }}>
                {/* Thumbnail */}
                <div onClick={() => onPreview(l.id)} style={{ height: 110, position: "relative", cursor: "pointer", background: l.header.bgColor, overflow: "hidden" }}>
                  {l.hero.slides?.[0] && <img src={l.hero.slides[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .5 }} />}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.44)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 10 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, textAlign: "center" }}>{l.name}</div>
                    <span style={{ background: UI_PRIMARY, color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20, marginTop: 5 }}>
                      {SNAMES[SIDS.indexOf(l.struct || "clasica")] || "Clásica"}
                    </span>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {utm && <span style={{ background: "#22c55e", color: "#fff", fontSize: 8, padding: "1px 6px", borderRadius: 20 }}>UTM</span>}
                      {isPublished && <span style={{ background: "#0ea5e9", color: "#fff", fontSize: 8, padding: "1px 6px", borderRadius: 20 }}>Publicada</span>}
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 9, padding: "2px 5px", borderRadius: 5 }}>{l.createdAt || ""}</div>
                </div>
                {/* URL pública */}
                {isPublished && (
                  <div style={{ padding: "6px 10px", background: "#f0f9ff", borderTop: "1px solid #e0f2fe" }}>
                    <div style={{ fontSize: 9, color: "#0369a1", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: ".4px" }}>URL Pública</div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <div style={{ flex: 1, fontSize: 9, color: "#0c4a6e", background: "#e0f2fe", borderRadius: 4, padding: "3px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                        {origin}{l.publishedUrl}
                      </div>
                      <button onClick={() => copyUrl(l.id, l.publishedUrl)} title="Copiar URL"
                        style={{ padding: "3px 7px", border: "none", borderRadius: 4, background: copied === l.id ? "#22c55e" : "#0ea5e9", color: "#fff", cursor: "pointer", fontSize: 9, fontWeight: 700, flexShrink: 0, transition: "background .2s" }}>
                        {copied === l.id ? "✓" : "Copiar"}
                      </button>
                      <a href={l.publishedUrl} target="_blank" rel="noreferrer" title="Abrir en nueva pestaña"
                        style={{ padding: "3px 7px", border: "none", borderRadius: 4, background: "#f1f5f9", color: "#475569", cursor: "pointer", fontSize: 9, fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
                        Abrir
                      </a>
                    </div>
                    {l.publishedAt && <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 3 }}>Publicada el {l.publishedAt}</div>}
                  </div>
                )}
                {/* Acciones */}
                <div style={{ padding: "8px 10px", display: "flex", gap: 5 }}>
                  <button onClick={() => onPreview(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${UI_BORDER}`, background: UI_CARD, cursor: "pointer", fontSize: 10, fontWeight: 600, color: UI_MUTED }}>Vista</button>
                  <button onClick={() => onEdit(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", background: "#ede9ff", color: UI_PRIMARY, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>Editar</button>
                  <button onClick={() => onPublish(l.id)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", background: isPublished ? "#dbeafe" : "#f0fdf4", color: isPublished ? "#1d4ed8" : "#15803d", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>{isPublished ? "Re-pub." : "Publicar"}</button>
                  <button onClick={() => onDownload(l.id)} style={{ padding: "6px 9px", borderRadius: 6, border: "none", background: "#dcfce7", color: "#16a34a", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>HTML</button>
                  <button onClick={() => onDelete(l.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

  const doPublish = useCallback(async (id) => {
    const landing = id ? landings.find(l => l.id === id) : current;
    if (!landing) return;
    try {
      showToast("⏳ Publicando...", "info");
      const html = buildExportHTML(landing);
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, name: landing.name, landingId: landing.id, prevFilename: landing.publishedFilename || null }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const updated = { ...landing, publishedUrl: data.url, publishedFilename: data.filename, publishedAt: new Date().toLocaleDateString("es-CL") };
      const newList = landings.map(l => l.id === updated.id ? updated : l);
      await saveLandings(newList);
      setLandings(newList);
      if (current.id === updated.id) setCurrent(updated);
      showToast("🌐 Landing publicada exitosamente");
    } catch (e) {
      showToast("Error al publicar: " + e.message, "error");
    }
  }, [current, landings, showToast]);

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
          onPublish={doPublish}
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
