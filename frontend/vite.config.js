import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        // Mientras programas, las peticiones a /reservas van al backend del puerto 3001.
        proxy: {
            "/reservas": "http://localhost:3001",
        },
    },
});
