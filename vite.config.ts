import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

// Workers Builds sets WORKERS_CI_BRANCH. Builds of any branch other than `main`
// use the `preview` Wrangler env so they bind the preview D1 database.
// An explicit CLOUDFLARE_ENV always wins.
const branch = process.env.WORKERS_CI_BRANCH;
if (!process.env.CLOUDFLARE_ENV && branch && branch !== "main") {
  process.env.CLOUDFLARE_ENV = "preview";
}

export default defineConfig({
  plugins: [
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
