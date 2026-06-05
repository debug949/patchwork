import { requireSession } from "@/lib/session";
import { LandingClient } from "@/components/LandingClient";

export default async function LandingPage() {
  const session = await requireSession();
  return <LandingClient isLoggedIn={!!session} />;
}
