# Install sstatic

This page will show you how to deploy sstatic on your server and perform the initial configuration.

## Prerequisites
- Docker installed on your system
- Basic knowledge of Docker and containerization

## Basic configuration

To get started, you can use a simpler configuration that uses password authentication.

First, you need to generate a password hash for the admin user. You can do this by running the following command:

```bash
docker run -it --rm xfox111/sstatic:latest hash-password
```

Next, create a `.env` file with the following content:

```dotenv [.env]
SSTATIC_AUTH_PASSWORD_HASH=#YOUR_PASSWORD_HASH_HERE#
SSTATIC_AUTH_USERNAME=admin

# Specify paths under which each service will be available.
SSTATIC_APP_PREFIX=/_
SSTATIC_SHORTENER_PREFIX=/s
SSTATIC_FILES_PREFIX=/static
```

You can customize variables as needed. The `SSTATIC_APP_PREFIX` variable specifies the base path for the admin app, while `SSTATIC_SHORTENER_PREFIX` and `SSTATIC_FILES_PREFIX` specify paths for the shortener and file server, respectively. It is recommended to use different paths for each service to avoid URL collision when serving under the same domain. See [Route resolution](/reference/routes) for more information.

Alternatively, you can configure sstatic to serve each component under its own domain:

```dotenv [.env]
SSTATIC_AUTH_PASSWORD_HASH=#YOUR_PASSWORD_HASH_HERE#
SSTATIC_AUTH_USERNAME=admin

SSTATIC_APP_PREFIX=/_ # [!code --]
SSTATIC_SHORTENER_PREFIX=/s # [!code --]
SSTATIC_FILES_PREFIX=/static # [!code --]
SSTATIC_APP_HOST=sstatic.example.com # [!code ++]
SSTATIC_SHORTENER_HOST=s.example.com # [!code ++]
SSTATIC_FILES_HOST=files.example.com # [!code ++]
```

Note that omitting any of the `SSTATIC_*_HOST` variables will cause sstatic to serve that component under any domain, which may cause URL collision unless a prefix is specified.

Finally, you can start sstatic using Docker or Docker Compose.

::: code-group

```bash [Docker ~vscode-icons:file-type-docker~]
docker run -d --name sstatic \
    -p 8080:8080 \
    -v data:/data \
    --env-file .env \
    --restart unless-stopped \
    xfox111/sstatic:latest
```

```yaml [docker-compose.yaml  ~vscode-icons:file-type-dockertest~]
volumes:
  data:

services:
  app:
    image: xfox111/sstatic:latest
    restart: unless-stopped
    container_name: sstatic
    env_file: .env
    ports:
      - 8080:8080
    volumes:
      - data:/data
```

:::

## Full config template

If you already know your way around, you can use these templates to get you started:

::: code-group

```bash [Docker ~vscode-icons:file-type-docker~]
docker run -d --name sstatic \
    -p 8080:8080 \
    -v sstatic_data:/data \
    # -v $(pwd)/appsettings.json:/app/appsettings.Production.json:ro \
    # -v $(pwd)/config.ini:/app/config.ini:ro \
    --env-file .env \
    --restart unless-stopped \
    xfox111/sstatic:latest
```

```yaml [docker-compose.yaml  ~vscode-icons:file-type-dockertest~]
volumes:
  data:

services:
  app:
    image: xfox111/sstatic:latest
    restart: unless-stopped
    container_name: sstatic
    env_file: .env
    ports:
      - 8080:8080
    volumes:
      - data:/data
      # - appsettings.json:/app/appsettings.Production.json:ro
      # - config.ini:/app/config.ini:ro
```

```dotenv [.env]
SSTATIC_DATA=/data
SSTATIC_APP_HOST=*
SSTATIC_APP_PREFIX=/
SSTATIC_SHORTENER_HOST=*
SSTATIC_SHORTENER_PREFIX=/
SSTATIC_FILES_HOST=*
SSTATIC_FILES_PREFIX=/
SSTATIC_MAX_FILE_UPLOAD_SIZE=0
SSTATIC_ENABLE_OPENAPI=
SSTATIC_CASE_INSENSITIVE_SLUGS=false
SSTATIC_DEFAULT_SLUG_LENGTH=8

SSTATIC_OIDC_CONFIGURATION=
SSTATIC_OIDC_CLIENT_ID=
SSTATIC_OIDC_CLIENT_SECRET=

# SSTATIC_AUTH_USERNAME=
# SSTATIC_AUTH_PASSWORD_HASH=
# SSTATIC_AUTH_PASSWORD=

# PLAUSIBLE_DOMAIN_NAME=
# PLAUSIBLE_ENDPOINT=
```

```jsonc [appsettings.json]
{
	"Logging": {
		"LogLevel": {
			"Default": "Information",
			"Microsoft.AspNetCore": "Warning"
		}
	},
	"App": {
		"DataRoot": "/data",
		"AppHost": "*",
		"AppPrefix": "/",
		"ShortenerHost": "*",
		"ShortenerPrefix": "/",
		"FilesHost": "*",
		"FilesPrefix": "/",
		"MaxFileUploadSize": 0,
		"EnableOpenApi": null,
		"CaseInsensitiveSlugs": false,
		"DefaultSlugLength": 8
	},
	"Auth": {
		"Oidc": {
			"Configuration": "",
			"ClientId": "",
			"ClientSecret": ""
		}
		/* "Password": {
			"Username": "",
			"Password": "",
			"PasswordHash": ""
		} */
	}
	/* "Analytics": {
		"Plausible": {
			"DomainName": "",
			"Endpoint": "https://plausible.io/api/event"
		}
	} */
}
```

```ini [config.ini]
[Logging:LogLevel]
Default = Information
Microsoft.AspNetCore = Warning

[App]
DataRoot = /data
Host = *
Prefix = /
EnableOpenApi =

[App:Shortener]
Host = *
Prefix = /
CaseInsensitiveSlugs = false
DefaultSlugLength = 8

[App:Files]
Host = *
Prefix = /
MaxFileUploadSize = 0

[Auth:Oidc]
Configuration =
ClientId =
ClientSecret =

; [Auth:Password]
; Username =
; Password =
; PasswordHash =

; [Analytics:Plausible]
; Endpoint = https://plausible.io/api/event
; DomainName =

; [Analytics:Webhook]
; Endpoint =
; Method = GET
; BodyTemplateFile =

; [Analytics:Webhook:Headers]
; X-Test = true
; X-URL = "{{url}}"
```

:::

## Next steps
- [Configure reverse proxy to serve sstatic under HTTPS](/get-started/reverse-proxy)
- [Configure OpenID authentication](/guides/openid-connect)
- [Adjust your configuration to your needs](/configuration/)
