import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Sign in — Patchwork" };

export default async function LoginPage() {
  const session = await requireSession();
  if (session) redirect("/dashboard");

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      {/* Video background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,12,0.45)" }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
      <div
        className="liquid-glass-strong"
        style={{
          borderRadius: 24,
          padding: "48px 40px",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            fontWeight: 700,
            fontSize: 26,
            marginBottom: 6,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          patchwork
        </div>
        <p
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 36,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Generate AI-powered changelogs from your GitHub commit history.
        </p>

        <a
          href="/api/auth/github"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#fff",
            color: "#000",
            padding: "13px 20px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
            fontFamily: "var(--font-poppins, sans-serif)",
            transition: "opacity 0.15s",
          }}
        >
          <GitHubIcon />
          Continue with GitHub
        </a>

        <p
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            marginTop: 24,
            lineHeight: 1.7,
          }}
        >
          Patchwork requests <strong>read-only</strong> access to your repositories to fetch commit history. No write access is requested.
        </p>
      </div>
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
