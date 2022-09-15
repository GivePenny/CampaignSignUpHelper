import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "GPCampaignSignUpHelper",
      fileName: (format) => `gp-campaign-sign-up-helper.${format}.js`,
      formats: ["umd"],
    },
    target: "es2015",
    sourcemap: true,
  },
  publicDir: false,
});
