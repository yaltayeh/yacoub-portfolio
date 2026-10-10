import { llmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: the full text of every public page, in English and Arabic. */
export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
