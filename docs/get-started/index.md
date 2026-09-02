# Welcome to sstatic!

sstatic is a simple self-hosted URL shortener and a file server. A perfect companion for your personal website.

<div class="badges">
	<a href="https://github.com/xfox111/sstatic/releases/latest" target="_blank">
		<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/xfox111/sstatic" />
	</a>
	<a href="https://hub.docker.com/r/xfox111/sstatic" target="_blank">
		<img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/xfox111/sstatic" />
	</a>
	<a href="https://github.com/XFox111/sstatic/commits/main" target="_blank">
		<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/xfox111/sstatic?label=Last+update" />
	</a>
</div>

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="https://static.xfox111.net/projects/sstatic/sstatic-dark.webp">
	<source media="(prefers-color-scheme: light)" srcset="https://static.xfox111.net/projects/sstatic/sstatic-light.webp">
	<img alt="">
</picture>

## Features
- **Personalized URL shortener**: Create short links on your personal domain with a simple and easy-to-use interface
- **Static file server**: Want to share your work with the world? Serve your static files in a few clicks
- **Multi-domain support**: Serve your short links and static files on different domains with a single sstatic instance
- **OIDC support out of the box**: Already have an identity provider? sstatic can integrate with it easily
- **Bring your own analytics**: sstatic intergrates with several popular analytics providers (including open source ones) to help you better understand your users
- **Built with Docker**: Deploy sstatic in a few minutes with Docker and Docker Compose
- PWA application
- Fully documented REST API for integration with other applications
- Built-in `robots.txt` to prevent indexing and AI usage
- Open source, licensed under the MIT license

## Quick start

If you want to quickly test sstatic, you can use the following command:

```bash
docker run -d --name sstatic \
    -p 8080:8080 \
    -e 'SSTATIC_AUTH_USERNAME=admin' \
    -e 'SSTATIC_AUTH_PASSWORD=admin' \
    xfox111/sstatic:latest
```

This command will start sstatic on port `8080` with the username `admin` and password `admin` for authentication. You can access the application at `http://localhost:8080`.

> [!CAUTION]
> The above command is for testing purposes only. Do not use in production!

Visit the [Installation](/get-started/installation) page for instructions on how to deploy production-ready sstatic instance.

## Screenshots

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="/assets/shortener-dark.png">
	<source media="(prefers-color-scheme: light)" srcset="/assets/shortener-light.png">
	<img alt="">
</picture>

<br />

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="/assets/files-dark.png">
	<source media="(prefers-color-scheme: light)" srcset="/assets/files-light.png">
	<img alt="">
</picture>

## Contributing

<div class="badges">
	<a href="https://github.com/xfox111/sstatic/issues" target="_blank">
		<img alt="GitHub issues" src="https://img.shields.io/github/issues/xfox111/sstatic" />
	</a>
	<a href="https://github.com/XFox111/sstatic/actions/workflows/cd_pipeline.yml" target="_blank">
		<img alt="CI" src="https://github.com/XFox111/sstatic/actions/workflows/release.yml/badge.svg" />
	</a>
	<a href="https://github.com/xfox111/sstatic" target="_blank">
		<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/xfox111/sstatic?label=repo%20size" />
	</a>
</div>

There are many ways in which you can participate in the project, for example:
- [Submit bugs and feature requests](https://github.com/xfox111/sstatic/issues), and help us verify as they are checked in
- Review [source code changes](https://github.com/xfox111/sstatic/pulls)
- Review documentation and make pull requests for anything from typos to new content

If you are interested in fixing issues and contributing directly to the code base, please refer to the [Contribution Guidelines](https://github.com/XFox111/sstatic/blob/main/CONTRIBUTING.md)

---

<div class="badges">
	<a href="https://bsky.app/profile/xfox111.net" target="_blank">
		<img alt="Bluesky" src="https://img.shields.io/badge/%40xfox111.net-BSky?logo=bluesky&logoColor=%230285FF&label=Bluesky&labelColor=white&color=%230285FF" />
	</a>
	<a href="https://github.com/xfox111" target="_blank">
		<img alt="GitHub" src="https://img.shields.io/badge/%40xfox111-GitHub?logo=github&logoColor=%23181717&label=GitHub&labelColor=white&color=%23181717" />
	</a>
	<a href="https://buymeacoffee.com/xfox111" target="_blank">
		<img alt="Buy Me a Coffee" src="https://img.shields.io/badge/%40xfox111-BMC?logo=buymeacoffee&logoColor=black&label=Buy%20me%20a%20coffee&labelColor=white&color=%23FFDD00" />
	</a>
</div>

> ©2026 Eugene Fox. Licensed under [MIT license](https://github.com/XFox111/sstatic/blob/main/LICENSE)
