import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build:
	{
		chunkSizeWarningLimit: 1000
	},
	base: "./",
	server:
	{
		proxy:
		{
			"/auth/":
			{
				target: "http://localhost:5141/_/",
				changeOrigin: false
			},
			"/api/":
			{
				target: "http://localhost:5141/_/",
				changeOrigin: false
			},
			"/scalar/":
			{
				target: "http://localhost:5141/_/",
				changeOrigin: false
			},
			"/static/":
			{
				target: "http://localhost:5141",
				changeOrigin: false
			},
			"/s/":
			{
				target: "http://localhost:5141",
				changeOrigin: false
			},
			"/_/":
			{
				target: "http://localhost:5141",
				changeOrigin: false
			},
		},
		allowedHosts: true
	}
});
