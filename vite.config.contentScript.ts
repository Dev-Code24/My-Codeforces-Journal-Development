import { defineConfig } from "vite";
import { resolve } from "path";
import { Plugin } from "vite";

function iifeWrapper(): Plugin {
  return {
    name: "iife-wrapper",
    generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key].type === "chunk") {
          const chunk = bundle[key];
          chunk.code = `(function(){\n${chunk.code}\n})();`;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [iifeWrapper()],
  build: {
    rollupOptions: {
      input: {
        contentScript: resolve(__dirname, "src/contentScript.ts"),
      },
      output: {
        format: "iife",
        entryFileNames: "assets/contentScript.js",
      },
    },
    target: "es2015",
    emptyOutDir: false,
  },
  publicDir: false,
});
