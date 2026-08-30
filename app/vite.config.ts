import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PROXY_HOST: string = "http://localhost:5141";

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
				target: PROXY_HOST + "/_/",
				changeOrigin: false
			},
			"/api/":
			{
				target: PROXY_HOST + "/_/",
				changeOrigin: false
			},
			"/scalar/":
			{
				target: PROXY_HOST + "/_/",
				changeOrigin: false
			},
			"/static/":
			{
				target: PROXY_HOST,
				changeOrigin: false
			},
			"/s/":
			{
				target: PROXY_HOST,
				changeOrigin: false
			},
			"/_/":
			{
				target: PROXY_HOST,
				changeOrigin: false
			},
		},
		allowedHosts: true
	}
});
