import { llmsTxt } from "@/lib/llms";

/** /llms.txt: a short Markdown summary of the site for AI assistants. */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
