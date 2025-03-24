import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-03-23",
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:6969",
    },
  },
});
