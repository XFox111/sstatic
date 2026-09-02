# Docker health check

If you want, you can add a health check to your sstatic Docker container. This will allow Docker to monitor the health of your container and restart it if it becomes unhealthy.

Here's a generic example of a health check that you can add:

::: code-group

```bash [Docker ~vscode-icons:file-type-docker~]
docker run -d --name sstatic \
    -p 8080:8080 \
    -v data:/data \
    --env-file .env \
    --restart unless-stopped \
    # [!code ++]
    --health-cmd "wget --quiet --tries=1 --spider 'http://localhost:8080/api/healthz' || exit 1" \
    # [!code ++]
    --health-interval=60s \
    # [!code ++]
    --health-timeout=10s \
    # [!code ++]
    --health-retries=3 \
    # [!code ++]
    --health-start-period=20s \
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
    healthcheck: # [!code ++]
      test: "wget --quiet --tries=1 --spider 'http://localhost:8080/api/healthz' || exit 1" # [!code ++]
      interval: 60s # [!code ++]
      timeout: 10s # [!code ++]
      retries: 3 # [!code ++]
      start_period: 20s # [!code ++]
```

:::

Note that if you've modified `SSTATIC_APP_PREFIX` or `SSTATIC_APP_HOST` variables, you will need to update the health check URL accordingly. For example, if you've set `SSTATIC_APP_PREFIX=/sstatic-admin/` and `SSTATIC_APP_HOST=example.com`, your health check URL would be:

::: code-group

```bash [Docker ~vscode-icons:file-type-docker~]
docker run -d --name sstatic \
    -p 8080:8080 \
    -v data:/data \
    --env-file .env \
    --restart unless-stopped \
    # [!code --]
    --health-cmd "wget --quiet --tries=1 --spider 'http://localhost:8080/api/healthz' || exit 1" \
    # [!code ++]
    --health-cmd "wget --quiet --tries=1 --spider --header 'Host: example.com' 'http://localhost:8080/sstatic-admin/api/healthz' || exit 1" \
    --health-interval=60s \
    --health-timeout=10s \
    --health-retries=3 \
    --health-start-period=20s \
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
    healthcheck:
      test: "wget --quiet --tries=1 --spider 'http://localhost:8080/api/healthz' || exit 1" # [!code --]
      test: "wget --quiet --tries=1 --spider --header 'Host: example.com' 'http://localhost:8080/sstatic-admin/api/healthz' || exit 1" # [!code ++]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 20s
```

:::
