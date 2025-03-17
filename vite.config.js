import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import laravel from "laravel-vite-plugin";
import * as ctx from "standardized-audio-context";

for (const key of Object.keys(ctx)) {
    globalThis[key] = ctx[key];
}

export default defineConfig({
    plugins: [laravel(["resources/js/src/main.tsx"]), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
