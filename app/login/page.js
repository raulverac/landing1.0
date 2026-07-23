"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const features = [
  { icon: "▦", label: "Selector de", bold: "6 estructuras" , rest: " de landing" },
  { icon: "✎", label: "Editor visual con ", bold: "vista previa", rest: " en tiempo real" },
  { icon: "⊞", label: "HTML responsive con ", bold: "Bootstrap", rest: " incluido" },
  { icon: "⊙", label: "Publicación con ", bold: "URL pública", rest: " al instante" },
  { icon: "☰", label: "Gestión de ", bold: "múltiples landings", rest: "" },
  { icon: "◫", label: "Optimizado para ", bold: "dispositivos móviles", rest: "" },
];

const DOMAIN = "@mentalidadweb.com";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
    const err = searchParams.get("error");
    if (err === "AccessDenied") setError("Solo cuentas @mentalidadweb.com tienen acceso.");
    else if (err) setError("Error al iniciar sesión. Intenta de nuevo.");
  }, [status, searchParams, router]);

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.endsWith(DOMAIN)) {
      setError("Solo cuentas @mentalidadweb.com tienen acceso.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email, password, redirect: false, callbackUrl: "/",
    });
    setLoading(false);
    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      router.replace("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#e8eaf0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 900, background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.10)", overflow: "hidden", minHeight: 560 }}>

        {/* ── LEFT PANEL ──────────────────────────────────────────────── */}
        <div style={{ flex: "0 0 42%", background: "#f7f8fa", padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
              <LogoIcon size={48} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1a2535", lineHeight: 1.1 }}>
                  Landing<span style={{ color: "#7267ef" }}>Builder</span>
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>by Mentalidad Web</div>
              </div>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a2535", lineHeight: 1.2, marginBottom: 12 }}>
              Constructor de<br />Landings Pro
            </h2>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 28 }}>
              Crea, edita y publica landing pages profesionales con editor visual y exportación responsive lista para usar.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eef0fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#7267ef", fontSize: 14, flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    {f.label}<strong style={{ color: "#1a2535" }}>{f.bold}</strong>{f.rest}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom copyright */}
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 32 }}>
            © 2026 LandingBuilder · Mentalidad Web
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: "44px 48px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <LogoIcon size={56} style={{ marginBottom: 20 }} />

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2535", marginBottom: 6, textAlign: "center" }}>Iniciar sesión</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 28, textAlign: "center" }}>Ingresa con tu cuenta corporativa</p>

          {/* Error */}
          {error && (
            <div style={{ width: "100%", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#dc2626", marginBottom: 16, textAlign: "center" }}>
              {error}
            </div>
          )}

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 20px", border: "1.5px solid #d1d5db", borderRadius: 10, background: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, color: "#1a2535", marginBottom: 20, transition: "box-shadow .15s", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <GoogleIcon />
            Iniciar sesión con Google
          </button>

          {/* Divider */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>o con correo y contraseña</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          {/* Credentials form */}
          <form onSubmit={handleCredentials} style={{ width: "100%" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 6 }}>Correo Electrónico</label>
              <div style={{ position: "relative" }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@mentalidadweb.com"
                  style={{ width: "100%", padding: "11px 44px 11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#1a2535", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "#7267ef", borderRadius: 5, padding: "2px 5px", fontSize: 9, color: "#fff", fontWeight: 700 }}>···</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 6 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: "100%", padding: "11px 44px 11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#1a2535", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#7267ef", border: "none", borderRadius: 5, padding: "2px 5px", fontSize: 9, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                  {showPass ? "ocultar" : "···"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "#1a2535", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, marginBottom: 16 }}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
            Solo cuentas <strong style={{ color: "#1a2535" }}>@mentalidadweb.com</strong> tienen acceso.
          </p>

          <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
            © 2026 Aceleración IA · Mentalidad Web
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Mentalidad Web circular logo ────────────────────────────────────────────
function LogoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="#1a2535" strokeWidth="4" fill="none" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="#1a2535" strokeWidth="3.5" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#1a2535" strokeWidth="3.5" />
      <line x1="16" y1="16" x2="84" y2="84" stroke="#1a2535" strokeWidth="3.5" />
      <line x1="84" y1="16" x2="16" y2="84" stroke="#1a2535" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="7" fill="#1a2535" />
    </svg>
  );
}

// ── Google "G" icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.38 3.09 29.43 1 24 1 14.83 1 7.07 6.41 3.64 14.1l7.09 5.51C12.54 13.36 17.77 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.52 24.5c0-1.56-.14-3.07-.4-4.52H24v8.56h12.66c-.55 2.94-2.22 5.43-4.73 7.11l7.27 5.65C43.25 37.17 46.52 31.33 46.52 24.5z"/>
      <path fill="#FBBC05" d="M10.73 28.38A14.44 14.44 0 019.5 24c0-1.52.26-3 .73-4.38L3.14 14.1A23.97 23.97 0 001 24c0 3.87.93 7.53 2.64 10.77l7.09-6.39z"/>
      <path fill="#34A853" d="M24 47c5.43 0 9.99-1.8 13.32-4.88l-7.27-5.65c-1.79 1.2-4.07 1.92-6.05 1.92-6.23 0-11.46-3.86-13.27-9.22l-7.09 6.39C7.07 41.59 14.83 47 24 47z"/>
    </svg>
  );
}
