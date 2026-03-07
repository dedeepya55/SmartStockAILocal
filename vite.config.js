import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // allows all hosts
    port: process.env.PORT || 5173,
    allowedHosts: ["smartstock-frontend-pud5.onrender.com"] // allow Render domain
  }
});
