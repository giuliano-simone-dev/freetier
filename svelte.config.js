import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: ".vite/renderer/main_window",
      assetPrefix: "./",
      assets: ".vite/renderer/main_window",
      fallback: "index.html",
      precompress: false,
      strict: true
    }),
    paths: {
      base: "",
      assets: ""
    },
    appDir: "_app",
    router: {
      type: "hash",
    },
  },
};

export default config;