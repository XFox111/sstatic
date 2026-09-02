#!/bin/sh

# if first arg is hash-password, then run the password hashing command and exit
if [ "$1" = "hash-password" ]; then
	dotnet SStatic.dll "$@"
	exit $?
fi

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
	export App__Host="$SSTATIC_APP_HOST"
	echo "SSTATIC_APP_HOST=$SSTATIC_APP_HOST"
fi

if [ -n "$SSTATIC_APP_PREFIX" ]; then
	export App__Prefix="$SSTATIC_APP_PREFIX"
	echo "SSTATIC_APP_PREFIX=$SSTATIC_APP_PREFIX"
fi

if [ -n "$SSTATIC_SHORTENER_HOST" ]; then
	export App__Shortener__Host="$SSTATIC_SHORTENER_HOST"
	echo "SSTATIC_SHORTENER_HOST=$SSTATIC_SHORTENER_HOST"
fi

if [ -n "$SSTATIC_SHORTENER_PREFIX" ]; then
	export App__Shortener__Prefix="$SSTATIC_SHORTENER_PREFIX"
	echo "SSTATIC_SHORTENER_PREFIX=$SSTATIC_SHORTENER_PREFIX"
fi

if [ -n "$SSTATIC_FILES_HOST" ]; then
	export App__Files__Host="$SSTATIC_FILES_HOST"
	echo "SSTATIC_FILES_HOST=$SSTATIC_FILES_HOST"
fi

if [ -n "$SSTATIC_FILES_PREFIX" ]; then
	export App__Files__Prefix="$SSTATIC_FILES_PREFIX"
	echo "SSTATIC_FILES_PREFIX=$SSTATIC_FILES_PREFIX"
fi

if [ -n "$SSTATIC_MAX_FILE_UPLOAD_SIZE" ]; then
	export App__Files__MaxFileUploadSize="$SSTATIC_MAX_FILE_UPLOAD_SIZE"
	echo "SSTATIC_MAX_FILE_UPLOAD_SIZE=$SSTATIC_MAX_FILE_UPLOAD_SIZE"
fi

if [ -n "$SSTATIC_ENABLE_OPENAPI" ]; then
	export App__EnableOpenApi="$SSTATIC_ENABLE_OPENAPI"
	echo "SSTATIC_ENABLE_OPENAPI=$SSTATIC_ENABLE_OPENAPI"
fi

if [ -n "$SSTATIC_CASE_INSENSITIVE_SLUGS" ]; then
	export App__Shortener__CaseInsensitiveSlugs="$SSTATIC_CASE_INSENSITIVE_SLUGS"
	echo "SSTATIC_CASE_INSENSITIVE_SLUGS=$SSTATIC_CASE_INSENSITIVE_SLUGS"
fi

if [ -n "$SSTATIC_DEFAULT_SLUG_LENGTH" ]; then
	export App__Shortener__DefaultSlugLength="$SSTATIC_DEFAULT_SLUG_LENGTH"
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

if [ -n "$WEBHOOK_ENDPOINT" ]; then
	export Analytics__Webhoook__Endpoint="$WEBHOOK_ENDPOINT"
	echo "WEBHOOK_ENDPOINT=$WEBHOOK_ENDPOINT"
fi

if [ -n "$WEBHOOK_METHOD" ]; then
	export Analytics__Webhoook__Method="$WEBHOOK_METHOD"
	echo "WEBHOOK_METHOD=$WEBHOOK_METHOD"
fi

if [ -n "$WEBHOOK_BODY_TEMPLATE_FILE" ]; then
	export Analytics__Webhoook__BodyTemplateFile="$WEBHOOK_BODY_TEMPLATE_FILE"
	echo "WEBHOOK_BODY_TEMPLATE_FILE=$WEBHOOK_BODY_TEMPLATE_FILE"
fi

echo "Ensuring data directories exist..."
mkdir -p "$App__DataRoot/{files,links}"

echo "Starting SStatic..."
dotnet SStatic.dll "$@"
