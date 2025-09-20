import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

// AMP integration - processing handled in middleware
function ampIntegration() {
  return {
    name: "amp-integration",
    hooks: {
      "astro:config:setup": () => {
        console.log("🚀 AMP processing enabled via middleware");
      },
    },
  };
}

const config = {
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react(), ampIntegration()],
  server: {
    port: 3000,
  },
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
    },
  },
  vite: {
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "src/components"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@lib": path.resolve(__dirname, "src/lib"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@constant": path.resolve(__dirname, "src/constant"),
        "@styles": path.resolve(__dirname, "src/styles"),
      },
    },
    css: {
      modules: {
        generateScopedName: isProd
          ? "[hash:base64:6]"
          : "[name]__[local]___[hash:base64:6]",
      },
      preprocessorOptions: {
        scss: {
          outputStyle: "compressed",
          additionalData: `@use "src/styles/_mixins-new.scss" as *;`,
        },
      },
    },
    build: {
      minify: isProd ? "esbuild" : false,
      target: "es2017",
      cssCodeSplit: true,
    },
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
    },
  },
};

export default defineConfig(config);
