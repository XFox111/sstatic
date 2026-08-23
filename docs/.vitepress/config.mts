import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "sstatic",
	description: "A simple self-hosted URL shortener and a file server. A perfect companion for your personal website.",
	lastUpdated: true,
	cleanUrls: true,
	markdown: {
		config(md)
		{
			md.use(groupIconMdPlugin as any);
		}
	},
	vite: {
		plugins: [
			groupIconVitePlugin()
		],
	},
	themeConfig: {
		logo: {
			src: "./assets/logo.svg",
		},
		search: {
			provider: "local"
		},
		editLink: {
			pattern: 'https://github.com/xfox111/sstatic/edit/main/docs/:path'
		},
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Docs", link: "/markdown-examples" },
			{ text: "API reference", link: "/scalar" }
		],

		sidebar: [
			{
				text: "Getting started",
				items: [
					{ text: "Installation", link: "/installation" },
					{ text: "Reverse proxy", link: "/reverse-proxy" }
				]
			},
			{
				text: "Configuration",
				items: [
					{ text: "Overview", link: "/configuration/overview" },
					{ text: "Environment variables", link: "/configuration/environment-variables" },
					{ text: "Configuration file", link: "/configuration/configuration-file" },
				]
			},
			{
				text: "Guides",
				items: [
					{ text: "Overview", link: "/guides/overview" },
					{ text: "OpenID Connect", link: "/guides/openid-connect" },
					{ text: "Multiple domains", link: "/guides/multiple-domains" },
					{ text: "Analytics", link: "/guides/analytics" },
					{ text: "REST API", link: "/guides/rest-api" },
				]
			}
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/xfox111/sstatic" },
			{ icon: "bluesky", link: "https://bsky.app/profile/xfox111.net" },
			{ icon: "buymeacoffee", link: "https://buymeacoffee.com/xfox111" },
		],

		footer:
		{
			message: "Released under the MIT License.",
			copyright: `©${new Date().getFullYear()} Eugene Fox`
		}
	}
});
