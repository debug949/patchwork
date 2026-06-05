import { NextResponse } from "next/server";

export async function GET() {
  const result: Record<string, unknown> = {
    ok: false,
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV,
    dbUrlSet: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.slice(0, 40) ?? "NOT SET",
    error: null,
    errorCode: null,
    prismaError: null,
    stack: null,
  };

  // Dynamic import so module-load errors are also caught
  try {
    const { prisma } = await import("@/lib/db");
    result.prismaLoaded = true;
    const rows = await prisma.repository.findMany({ take: 5, select: { fullName: true } });
    result.ok = true;
    result.repositories = rows;
  } catch (e) {
    result.ok = false;
    if (e instanceof Error) {
      result.error = e.message;
      result.errorCode = (e as { code?: string }).code ?? null;
      result.stack = e.stack?.split("\n").slice(0, 8).join(" | ");
    } else {
      result.error = String(e);
    }
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
