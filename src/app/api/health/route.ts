import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const result: Record<string, unknown> = {
    ok: false,
    db: null,
    tables: [],
    error: null,
    errorCode: null,
    stack: null,
  };

  try {
    // Test basic connectivity
    const repos = await prisma.repository.findMany({ take: 3 });
    result.ok = true;
    result.db = "connected";
    result.tables = repos.map((r) => ({ id: r.id, fullName: r.fullName }));
  } catch (e) {
    result.ok = false;
    if (e instanceof Error) {
      result.error = e.message;
      result.stack = e.stack?.split("\n").slice(0, 5).join("\n");
      // Prisma errors have a 'code' property
      result.errorCode = (e as { code?: string }).code ?? null;
    }
  }

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
  });
}
