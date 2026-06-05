import Link from "next/link"

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
      style={{
        borderBottom: "1px solid var(--color-border)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(13,17,23,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Left: logo + breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            fontWeight: 700,
            fontSize: 17,
            textDecoration: "none",
            color: "var(--color-fg)",
            letterSpacing: "-0.03em",
          }}
        >
          patchwork
        </Link>
        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--color-border)", fontSize: 16, lineHeight: 1 }}>/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                style={{
                  color: "var(--color-muted)",
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
                  color: "var(--color-fg)",
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
