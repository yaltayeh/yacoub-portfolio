import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { profile } from "@/content/profile";
import { LogoMark } from "@/components/icons";
import { LoginForm } from "../_components/LoginForm";
import { Lock } from "../_components/admin-icons";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only same-site admin paths are allowed as a return target.
  const target = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (await getAdminSession()) redirect(target);

  return (
    <main className="login">
      <div className="login__card">
        <div className="login__brand">
          <LogoMark size={24} />
          <span>{profile.name.en} · Admin</span>
        </div>
        <div className="login__intro">
          <h1>Sign in</h1>
          <p>Private area for managing your links.</p>
        </div>
        <LoginForm next={target} />
      </div>
      <p className="login__note">
        <Lock />
        Only the site owner can sign in.
      </p>
    </main>
  );
}
