import Link from "next/link"
import { Globe } from "lucide-react"

interface Crumb {
  label: string
  href?: string
}

interface AppNavProps {
  crumbs?: Crumb[]
  rightSlot?: React.ReactNode
}

export function AppNav({ crumbs = [], rightSlot }: AppNavProps) {
  return (
    <header
      className="liquid-glass"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Left: logo + breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <Globe size={20} color="#fff" />
          <span
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              fontWeight: 600,
              fontSize: 16,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            patchwork
          </span>
        </Link>

        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16, lineHeight: 1 }}>/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 14,
                  textDecoration: "none",
                  fontFamily: "var(--font-poppins, sans-serif)",
                }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 14,
                  fontFamily: "var(--font-poppins, sans-serif)",
                  fontWeight: 500,
                }}
              >
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Right slot */}
      {rightSlot && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {rightSlot}
        </div>
      )}
    </header>
  )
}
