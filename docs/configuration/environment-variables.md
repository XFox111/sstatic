# Environment variables

<!--@include: @/parts/wip.md-->

## Basic configuration

| Name | Description | Default value |
| ---- | ----------- | ------------- |
| `SSTATIC_DATA` | The path to the data directory. | `/data` |
| `SSTATIC_APP_HOST` | The host on which the admin application will run. May be a glob pattern (e.g. `*.example.com`) | `*` |
| `SSTATIC_PREFIX` | The prefix for the admin application's routes. | `/` |
| `SSTATIC_ENABLE_OPENAPI` | Whether to enable the OpenAPI endpoints. | `null`[^1] |

[^1]: By default, OpenAPI endpoints will be disabled, unless `ASPNETCORE_ENVIRONMENT` variable is set to `Development` or `Staging`.

## Shortener configuration

| Name | Description | Default value |
| ---- | ----------- | ------------- |
| `SSTATIC_SHORTENER_HOST` | The host on which the shortener will run. May be a glob pattern (e.g. `*.example.com`) | `*` |
| `SSTATIC_SHORTENER_PREFIX` | The prefix for the shortener's routes. | `/` |
| `SSTATIC_CASE_INSENSITIVE_SLUGS` | Whether to treat short URL slugs as case-insensitive. | `false` |
| `SSTATIC_DEFAULT_SLUG_LENGTH` | The default length of a random slug. | `8` |

## Static files configuration

| Name | Description | Default value |
| ---- | ----------- | ------------- |
| `SSTATIC_FILES_HOST` | The host on which the files will run. May be a glob pattern (e.g. `*.example.com`) | `*` |
| `SSTATIC_FILES_PREFIX` | The prefix for the files' routes. | `/` |
| `SSTATIC_MAX_FILE_UPLOAD_SIZE` | The maximum size of a file that can be uploaded in bytes. | `0` |

## Authentication

### OpenID Connect (OIDC)

| Name | Description |
| ---- | ----------- |
| `SSTATIC_OIDC_CONFIGURATION` | The configuration for the OIDC provider. |
| `SSTATIC_OIDC_CLIENT_ID` | The client ID for the OIDC provider. |
| `SSTATIC_OIDC_CLIENT_SECRET` | The client secret for the OIDC provider. |

### Password

| Name | Description |
| ---- | ----------- |
| `SSTATIC_AUTH_USERNAME` | The username for authentication. |
| `SSTATIC_AUTH_PASSWORD` | The password for authentication. |
| `SSTATIC_AUTH_PASSWORD_HASH` | The hash of the password for authentication. |

## Analytics

### Plausible

| Name | Description | Default value |
| ---- | ----------- | ------------- |
| `PLAUSIBLE_DOMAIN_NAME` | The domain name for Plausible. | |
| `PLAUSIBLE_ENDPOINT` | The endpoint for Plausible. | `https://plausible.io/api/event` |
