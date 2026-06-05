import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { getAuthenticatedUser } from "@/lib/github";
import { prisma } from "@/lib/db";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("gh_oauth_state")?.value;

  // CSRF check
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${appUrl}/login?error=state_mismatch`);
  }

  cookieStore.delete("gh_oauth_state");

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=no_code`);
  }

  // Exchange code for access token
  let accessToken: string;
  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${appUrl}/api/auth/callback`,
        }),
      }
    );
    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
    };
    if (!tokenData.access_token) {
      throw new Error(tokenData.error ?? "no token");
    }
    accessToken = tokenData.access_token;
  } catch {
    return NextResponse.redirect(`${appUrl}/login?error=token_exchange`);
  }

  // Fetch GitHub user
  let ghUser;
  try {
    ghUser = await getAuthenticatedUser(accessToken);
  } catch {
    return NextResponse.redirect(`${appUrl}/login?error=user_fetch`);
  }

  // Upsert user in DB
  let user;
  try {
    user = await prisma.user.upsert({
      where: { githubId: String(ghUser.id) },
      create: {
        githubId: String(ghUser.id),
        githubLogin: ghUser.login,
        githubName: ghUser.name,
        githubAvatarUrl: ghUser.avatar_url,
        githubAccessToken: accessToken,
      },
      update: {
        githubLogin: ghUser.login,
        githubName: ghUser.name,
        githubAvatarUrl: ghUser.avatar_url,
        githubAccessToken: accessToken,
      },
    });
  } catch {
    return NextResponse.redirect(`${appUrl}/login?error=db`);
  }

  // Set session
  const session = await getSession();
  session.userId = user.id;
  session.githubLogin = user.githubLogin;
  session.githubName = user.githubName ?? null;
  session.githubAvatarUrl = user.githubAvatarUrl ?? null;
  session.githubAccessToken = accessToken;
  await session.save();

  return NextResponse.redirect(`${appUrl}/dashboard`);
}
