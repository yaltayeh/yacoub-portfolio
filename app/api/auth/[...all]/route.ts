import { createAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function handler(request: Request) {
  return createAuth(new URL(request.url).origin).handler(request);
}

export { handler as GET, handler as POST };
