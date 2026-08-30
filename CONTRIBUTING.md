# Contributing Guidelines

Welcome, and thank you for your interest in contributing to this project!

There are many ways in which you can contribute, beyond writing code. The goal of this document is to provide a high-level overview of how you can get involved.

## Asking questions and providing feedback

If you have questions about the project or need help with something, please don't hesitate to ask it on [GitHub Discussions board](https://github.com/xfox111/sstatic/discussions).

## Before you start

Before you start working on the codebase, please make sure that there is a related issue on GitHub and that you have been assigned to it.

To do so, find an existing issue that you would like to work on, or create a new one if it doesn't exist. Once you have an issue, please comment on it to let us know that you would like to work on it.

This will help to avoid duplicate work.

### AI Usage Policy

We have nothing against the use of AI tools to assist in development, but to maintain the quality of the codebase and avoid wasting time on low-quality PRs, we ask you to follow these guidelines when using AI tools:

1. **Understand the code you submit**: you should be able to understand and expain any line of code you submit in your own words.
1. **Make sure your code actually works**: before submitting a PR, make sure to test your code and verify that it works as expected. This includes manual testing and/or writing automated tests.
1. **Write your own words**: do not copy/paste AI-generated PR descriptions, comments, etc. on GitHub. Make sure it's concise and to the point.
1. **Disclose AI usage**: Note in the PR description if and how you have used AI tools to assist in the creation of the PR.

> [!IMPORTANT]
> If the PR appears to be low-effort AI slop, it may be close without review.

#### Disclosure examples

```
Used an agentic AI to generate the implementation of the new API endpoint.
I have manually reviewed and tested it before submitting.
```

```
- [X] I have used Copilot (or other AI tools) for autocomplete. I have not used agentic AI tools. I have manually reviewed this PR.
```

```
- [X] I have not used AI tools to assist in the creation of this pull request.
```

> [!IMPORTANT]
> Even if you have not used AI tools, you still need to note that in the PR descrption.
>
> PR description template already includes everything you need.


## Getting started

### Working on the codebase

#### 1. Setting up your development environment

Following tools are needed to set up your development environment:

- .NET SDK 10.0
- Node.js 26 with npm (required for building frontend and docs)
- Docker (required for building a comlete image)
- `dotnet-ef` tool (required for database migrations)
- VS Code (highly recommended)

> [!TIP]
> You can use [Dev Containers](https://code.visualstudio.com/docs/remote/containers) extension in VS Code to set up a development environment with all the required tools pre-installed.

#### 2. Project setup

Following options are required to set up the project:

`api/appsettings.Development.json`:

```jsonc
{
	...
	"App": {
		"DataRoot": "./data",     // Folder for data storage

		// Path prefixes. Required to avoid conflicts with shortener and file server endpoints when using the same domain/hostname.
		"AppPrefix": "/_",        // Base path for the application.
		"ShortenerPrefix": "/s",  // Path prefix for the shortener endpoints.
		"FilesPrefix": "/static", // Path prefix for the file server endpoints.
		...
	},
	"Auth": {
		"Password": {
			"Username": "admin",
			"Password": "admin"
		}
	},
	...
}
```

See [Configuration](https://sstatic.xfox111.net/configuration) page for more information.

`app/vite.config.ts`:

```ts
...
const PROXY_HOST: string = "http://localhost:5141"; // Make sure that the port matches the port exposed by the API.
...
```

#### 3. Running the project

Following commands can be used to run the project:

```bash
# Run the API
cd api && dotnet run
# Run the frontend
cd app && npm run dev
# Run the docs website
cd docs && npm run dev
```

### Submitting a pull request

Before submitting a pull request, please ensure that:

- Your commits and PR title follow [Conventional Commits specification](https://www.conventionalcommits.org/):

	`<type>[optional scope]: <description>`

	Examples:
	```
	fix: fix a bug in the shortener endpoint
	feat(auth): add support for OIDC authentication
	build(deps): update dependencies to latest versions
	```
- You PR has a detailed description and mentions the issue it resolves.
- You have run formatters:
	```bash
	# For API project
	dotnet format api/SStatic.slnx
	# For frontend or docs projects
	npm run format
	```
