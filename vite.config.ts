import { resolve } from "path";
import { defineConfig } from "vite";
import * as dns from "dns";

dns.setDefaultResultOrder("verbatim");

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
  server: {
    port: 8080,
  },
});
