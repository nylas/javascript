import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        connect: resolve(__dirname, "src/connect.ts"),
        elements: resolve(__dirname, "src/elements.ts"),
        notetaker: resolve(__dirname, "src/notetaker.ts"),
        utils: resolve(__dirname, "src/utils.ts"),
      },
      formats: ["es", "cjs"],
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: "esbuild",
    target: "es2022",
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "@nylas/core",
        "@nylas/connect",
        "@nylas/web-elements",
        "@nylas/web-elements/components",
        "@nylas/web-elements/loader",
        /^@nylas\/web-elements\/dist\/components\//,
        "@stencil/react-output-target/runtime",
      ],
      output: {
        exports: "named",
        globals: {
          "react-dom": "ReactDom",
          react: "React",
        },
        entryFileNames: "[format]/[name].js",
        chunkFileNames: "[format]/[name].js",
      },
    },
  },
});
