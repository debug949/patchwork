import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Sign in — Patchwork" };

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"

export default async function LoginPage() {
  const session = await requireSession();
  if (session) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      {/* Blurry video background — same as landing */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          autoPlay muted loop playsInline preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
            filter: "blur(14px) brightness(0.38)",
            transform: "scale(1.06)",
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 40,
          }}
        >
          patchwork
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(42px, 8vw, 72px)",
            color: "#fff",
            margin: "0 0 12px",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Welcome back.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            color: "rgba(255,255,255,0.4)",
            fontSize: 15,
            margin: "0 0 48px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Sign in to generate and manage your changelogs.
        </p>

        {/* GitHub button */}
        <a
          href="/api/auth/github"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 100,
            textDecoration: "none",
            fontWeight: 500,
            fontSize: 15,
            fontFamily: "var(--font-poppins, sans-serif)",
            transition: "background 0.2s, border-color 0.2s",
            minWidth: 240,
          }}
        >
          <GitHubIcon />
          Continue with GitHub
        </a>

        {/* Fine print */}
        <p
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            color: "rgba(255,255,255,0.2)",
            fontSize: 12,
            marginTop: 28,
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 300,
          }}
        >
          Read-only access to your repositories. No write permissions.
        </p>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
