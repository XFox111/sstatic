---
outline: deep
---

# Setting up OpenID authentication

This guide will walk you through the steps to set up OpenID authentication for your application. OpenID Connect is an identity layer on top of the OAuth 2.0 protocol, allowing clients to verify the identity of end-users based on the authentication performed by an authorization server.

## Learn URL of your instance

Throughout this guide we use `<host>` template that you will need to replace with absolute URL to your sstatic instance admin app (including its path).

For example, if you have set `SSTATIC_APP_HOST` to `example.com` and `SSTATIC_APP_PREFIX` to `/_`, you will need to replace `<host>` with `https://example.com/_`. And, for example, the result callback URL should be `https://example.com/_/auth/oidc_signin`.

## Create an OIDC Client

First, you need to create an OIDC client for your sstatic instance. Here're guide for some of the popular identity providers:

> [!IMPORTANT]
> Your sstatic instance must be able to reach your identity provider in order to fetch configuration.

### Pocket ID

1. Go to `Administration > OIDC Clients > Add OIDC Client`:
	- Name: `sstatic`
	- Client Launch URL: `<host>/`
	- Callback URLs: `<host>/auth/oidc_signin`
	- Logout Callback URLs: `<host>/auth/oidc_logout`
	- Public Client: `no`
	- PKCE: `yes`
	- (optional) Upload Logo: `<host>/logo.svg`
	- (recommended) Advanced > Requires Pushed Authorization Requests: `yes`
1. Adjust other settings as needed and click `Save`
1. Copy `Client ID`
1. Copy `OIDC Discovery URL` (click `Show more details`)
1. Copy `Client secret` (go to `Credentials > Add client secret`)


### Generic IdP

Use following options when creating an OIDC client:

- Name: `sstatic`
- Callback URL: `<host>/auth/oidc_signin`
- Logout Callback URL: `<host>/auth/oidc_logout` (if applicable)
- Client Launch URL: `<host>/` (if applicable)
- Public Client: `no` (if applicable)
- Public Key for Code Exchange (PKCE): `yes` (if applicable, recommended)
- Force Pushed Authorization Requests (PAR): `yes` (if applicable, recommended)
- App logo: `<host>/logo.svg` (if applicable)

Once you've created your OIDC client, you will need to copy following values:

- OIDC Discovery URL (usually ends with `/.well-known/openid-configuration`)
- Client ID
- Client secret

## Configure sstatic

Now, you need to replace password authentication with OIDC OAuth.
Go to your `.env`, `appsettings.json`, or `config.ini` file and update following lines:

::: code-group

```dotenv [.env]
SSTATIC_AUTH_USERNAME=admin # [!code --]
SSTATIC_AUTH_PASSWORD_HASH=#password_hash # [!code --]
SSTATIC_AUTH_PASSWORD= # [!code --]
SSTATIC_OIDC_CONFIGURATION=#YOUR_OIDC_DISCOVERY_URL_HERE# # [!code ++]
SSTATIC_OIDC_CLIENT_ID=#YOUR_CLIENT_ID_HERE# # [!code ++]
SSTATIC_OIDC_CLIENT_SECRET=#YOUR_CLIENT_SECRET_HERE# # [!code ++]
...
```

```jsonc [appsettings.json]
{
	"Auth": {
		"Password": { // [!code --]
			"Username": "admin", // [!code --]
			"Password": null, // [!code --]
			"PasswordHash": "password_hash" // [!code --]
		} // [!code --]
		"Oidc": { // [!code ++]
			"Configuration": "YOUR_ODIC_DISCOVERY_URL_HERE", // [!code ++]
			"ClientId": "YOUR_CLIENT_ID_HERE", // [!code ++]
			"ClientSecret": "YOUR_CLIENT_SECRET_HERE" // [!code ++]
		} // [!code ++]
	},
	...
}
```

```ini [config.ini]
[Auth:Password] ; [!code --]
Username = admin ; [!code --]
Password = ; [!code --]
PasswordHash = password_hash ; [!code --]
[Auth:Oidc] ; [!code ++]
Configuration = YOUR_ODIC_DISCOVERY_URL_HERE ; [!code ++]
ClientId = YOUR_CLIENT_ID_HERE ; [!code ++]
ClientSecret = YOUR_CLIENT_SECRET_HERE ; [!code ++]
...
```

:::

Restart your sstatic instance.

```bash
docker restart sstatic
```

Verify that you are now able to log in using your OIDC provider.

## Configuring access control

sstatic does not have any built-in access control features. By default, any user that can authorize with your OIDC client will be able to log in to your sstatic instance.

If you want to restrict access to specific users, you can use your identity provider's features to limit access to your OIDC client.

Here're some examples:

### Pocket ID

1. Go to `Administration > User Groups > Add Group`
1. Set both `Friendly Name` and `Name` to `sstatic` and cick `Save`
1. Go to `Users` tab and select the users you want to allow access to your sstatic instance
1. Go to `Allowed OIDC Clients` tab and select `sstatic`
1. Click `Save`

Now only users that are members of `sstatic` group will be able to log in to your sstatic instance.

## Claim mapping

Some identity providers may use different claim names for user information. Here's the list of claims that sstatic expects:

| Claim | Description |
|-------|-------------|
| `iss` | Issuer identifier for the OIDC provider |
| `aud` | Audience identifier for the OIDC client |
| `sub` | Unique identifier for the user |
| `name` | Display name of the user (usually the user's full name) |
| `email` | Email address of the user |
| `picture` | URL of the user's profile picture |

Most of the IdPs use standard `iss`, `aud`, and `sub` claim names, so you should not expect any issues with authentication.

But if your IdP uses different claim names for `name`, `email`, or `picture`, you may see this information missing in your sstatic admin app.

This does not impact performance or security in any way, but if you wish to display this information in your sstatic admin app, you can use your IdP's claim mapping features to map these claims to the expected names.
