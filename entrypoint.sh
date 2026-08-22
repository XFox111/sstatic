#!/bin/sh

echo "sstatic";
echo "Version: $SSTATIC_VERSION";
echo "Commit hash: $SSTATIC_COMMIT";

echo "Mapping configuration from environment variables..."

export App__DataRoot="/data"

if [ -n "$SSTATIC_DATA" ]; then
	export App__DataRoot="$SSTATIC_DATA"
	echo "SSTATIC_DATA=$SSTATIC_DATA"
fi

if [ -n "$SSTATIC_APP_HOST" ]; then
	export App__AppHost="$SSTATIC_APP_HOST"
	echo "SSTATIC_APP_HOST=$SSTATIC_APP_HOST"
fi

if [ -n "$SSTATIC_APP_PREFIX" ]; then
	export App__AppPrefix="$SSTATIC_APP_PREFIX"
	echo "SSTATIC_APP_PREFIX=$SSTATIC_APP_PREFIX"
fi

if [ -n "$SSTATIC_SHORTENER_HOST" ]; then
	export App__ShortenerHost="$SSTATIC_SHORTENER_HOST"
	echo "SSTATIC_SHORTENER_HOST=$SSTATIC_SHORTENER_HOST"
fi

if [ -n "$SSTATIC_SHORTENER_PREFIX" ]; then
	export App__ShortenerPrefix="$SSTATIC_SHORTENER_PREFIX"
	echo "SSTATIC_SHORTENER_PREFIX=$SSTATIC_SHORTENER_PREFIX"
fi

if [ -n "$SSTATIC_FILES_HOST" ]; then
	export App__FilesHost="$SSTATIC_FILES_HOST"
	echo "SSTATIC_FILES_HOST=$SSTATIC_FILES_HOST"
fi

if [ -n "$SSTATIC_FILES_PREFIX" ]; then
	export App__FilesPrefix="$SSTATIC_FILES_PREFIX"
	echo "SSTATIC_FILES_PREFIX=$SSTATIC_FILES_PREFIX"
fi

if [ -n "$SSTATIC_MAX_FILE_UPLOAD_SIZE" ]; then
	export App__MaxFileUploadSize="$SSTATIC_MAX_FILE_UPLOAD_SIZE"
	echo "SSTATIC_MAX_FILE_UPLOAD_SIZE=$SSTATIC_MAX_FILE_UPLOAD_SIZE"
fi

if [ -n "$SSTATIC_ENABLE_OPENAPI" ]; then
	export App__EnableOpenApi="$SSTATIC_ENABLE_OPENAPI"
	echo "SSTATIC_ENABLE_OPENAPI=$SSTATIC_ENABLE_OPENAPI"
fi

if [ -n "$SSTATIC_CASE_INSENSITIVE_SLUGS" ]; then
	export App__CaseInsensitiveSlugs="$SSTATIC_CASE_INSENSITIVE_SLUGS"
	echo "SSTATIC_CASE_INSENSITIVE_SLUGS=$SSTATIC_CASE_INSENSITIVE_SLUGS"
fi

if [ -n "$SSTATIC_DEFAULT_SLUG_LENGTH" ]; then
	export App__DefaultSlugLength="$SSTATIC_DEFAULT_SLUG_LENGTH"
	echo "SSTATIC_DEFAULT_SLUG_LENGTH=$SSTATIC_DEFAULT_SLUG_LENGTH"
fi

if [ -n "$SSTATIC_OIDC_CONFIGURATION" ]; then
	export Auth__Oidc__Configuration="$SSTATIC_OIDC_CONFIGURATION"
	echo "SSTATIC_OIDC_CONFIGURATION=$SSTATIC_OIDC_CONFIGURATION"
fi

if [ -n "$SSTATIC_OIDC_CLIENT_ID" ]; then
	export Auth__Oidc__ClientId="$SSTATIC_OIDC_CLIENT_ID"
	echo "SSTATIC_OIDC_CLIENT_ID=***"
fi

if [ -n "$SSTATIC_OIDC_CLIENT_SECRET" ]; then
	export Auth__Oidc__ClientSecret="$SSTATIC_OIDC_CLIENT_SECRET"
	echo "SSTATIC_OIDC_CLIENT_SECRET=***"
fi

if [ -n "$SSTATIC_AUTH_USERNAME" ]; then
	export Auth__Password__Username="$SSTATIC_AUTH_USERNAME"
	echo "SSTATIC_AUTH_USERNAME=***"
fi

if [ -n "$SSTATIC_AUTH_PASSWORD" ]; then
	export Auth__Password__Password="$SSTATIC_AUTH_PASSWORD"
	echo "SSTATIC_AUTH_PASSWORD=***"
fi

if [ -n "$SSTATIC_AUTH_PASSWORD_HASH" ]; then
	export Auth__Password__PasswordHash="$SSTATIC_AUTH_PASSWORD_HASH"
	echo "SSTATIC_AUTH_PASSWORD_HASH=***"
fi

if [ -n "$PLAUSIBLE_DOMAIN_NAME" ]; then
	export Analytics__Plausible__DomainName="$PLAUSIBLE_DOMAIN_NAME"
	echo "PLAUSIBLE_DOMAIN_NAME=$PLAUSIBLE_DOMAIN_NAME"
fi

if [ -n "$PLAUSIBLE_ENDPOINT" ]; then
	export Analytics__Plausible__Endpoint="$PLAUSIBLE_ENDPOINT"
	echo "PLAUSIBLE_ENDPOINT=$PLAUSIBLE_ENDPOINT"
fi

echo "Ensuring data directories exist..."
mkdir -p "$App__DataRoot/{files,links}"

echo "Starting SStatic..."
dotnet SStatic.dll
