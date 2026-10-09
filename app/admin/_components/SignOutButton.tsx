"use client";

import { useState } from "react";
import { SignOutIcon } from "./admin-icons";

export function SignOutButton({ className }: { className?: string }) {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/auth/sign-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        }).catch(() => undefined);
        window.location.assign("/admin/login");
      }}
    >
      <SignOutIcon size={22} />
      Sign out
    </button>
  );
}
