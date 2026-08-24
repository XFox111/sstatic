# Install sstatic

<!--@include: @/parts/wip.md-->

## Quick start

```bash
docker run -d --name sstatic \
    -p 8080:8080 \
    -v ./data:/data \
    -e 'SSTATIC_AUTH_USERNAME=admin' \
    -e 'SSTATIC_AUTH_PASSWORD=admin' \
    xfox111/sstatic:latest
```

> [!CAUTION]
> The above command is for testing purposes only. Do not use in production!

## Hosting on single domain with password authentication

```bash
echo "SSTATIC_PASSWORD_HASH=$(docker run -it --rm xfox111/sstatic:latest hash-password)" > .env
```

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

```dotenv [.env]
SSTATIC_AUTH_PASSWORD_HASH=AQAAAAIAAYagAAAAEE/Z4rw6w60N1ZC8wkXLtMx76JVj16pj+3rw/4GMKbzieBSNPTFvhchyqi+G3wJa0Q==
SSTATIC_AUTH_USERNAME=admin

# Specify paths under which each service will be available.
SSTATIC_PREFIX=/_
SSTATIC_SHORTENER_PREFIX=/s
SSTATIC_FILES_PREFIX=/static
```

:::

## Full config template

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

```dotenv [.env]
SSTATIC_DATA=/data
SSTATIC_APP_HOST=*
SSTATIC_PREFIX=/
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

:::

## Next steps
- Configure reverse proxy to serve sstatic under HTTPS
- Configure OpenID authentication
- Configure separate domains for the shortener, file server, and the admin app
