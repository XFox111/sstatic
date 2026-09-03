import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import footnote from "markdown-it-footnote";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "sstatic",
	description: "A simple self-hosted URL shortener and a file server. A perfect companion for your personal website.",
	lang: "en-US",
	lastUpdated: true,
	cleanUrls: true,
	head: [
		["meta", { name: "copyright", content: `©${new Date().getFullYear()} Eugene Fox` }],
		["meta", { name: "lanugage", content: "en_us" }],
		["meta", { name: "author", content: "Eugene Fox" }],
		["meta", { property: "og:title", content: "sstatic – A simple self-hosted URL shortener and a file server" }],
		["meta", { property: "og:description", content: "A perfect companion for your personal website" }],
		["meta", { property: "og:type", content: "website" }],
		["meta", { property: "og:url", content: "https://sstatic.xfox111.net" }],
		["meta", { property: "og:image", content: "/opengraph.png" }],
		["meta", { property: "og:image:type", content: "image/png" }],
		["meta", { property: "og:image:width", content: "1200" }],
		["meta", { property: "og:image:height", content: "675" }],
		["meta", { property: "og:site_name", content: "sstatic" }],
		["meta", { property: "twitter:card", content: "summary_large_image" }]
	],
	markdown: {
		config(md)
		{
			md.use(groupIconMdPlugin as any);
			md.use(footnote);
		}
	},
	vite: {
		plugins: [
			groupIconVitePlugin()
		],
	},
	themeConfig: {
		logo: {
			dark: "/logo.svg#dark",
			light: "/logo.svg#light"
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
			{ text: "Docs", link: "/get-started/" },
			{ text: "API reference", link: "/scalar.html", target: "_blank" }
		],

		sidebar: [
			{
				text: "Getting started",
				items: [
					{ text: "About sstatic", link: "/get-started/" },
					{ text: "Installation", link: "/get-started/installation" },
					{ text: "Reverse proxy", link: "/get-started/reverse-proxy" }
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
					{ text: "OpenID Connect", link: "/guides/openid-connect" },
					{ text: "Multiple domains", link: "/guides/multiple-domains" },
					{ text: "Analytics", link: "/guides/analytics" },
					{ text: "REST API", link: "/guides/rest-api" },
					{ text: "Healthcheck", link: "/guides/healthcheck" },
				]
			},
			{
				text: "Reference",
				items: [
					{ text: "Route resoltuion", link: "/reference/routes" },
					{ text: "robots.txt", link: "/reference/robots" },
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
