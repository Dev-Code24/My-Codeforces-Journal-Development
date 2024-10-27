import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: "manifest.json", dest: "." },
          { src: "public/icon.png", dest: "." },
        ],
      }),
    ],
    DEV_OR_PROD: JSON.stringify(env.VITE_DEV_OR_PROD),
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "index.html"),
          background: resolve(__dirname, "src/background.js"),
        },
        output: {
          format: "es", // ES module format
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
      target: "es2015",
      emptyOutDir: true, // Clears output directory only for the main build
    },
    publicDir: "public",
  };
});
