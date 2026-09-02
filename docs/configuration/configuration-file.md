# Configuration file

<!--@include: @/parts/wip.md-->

```json [appsettings.json]
{
	"Logging": {
		"LogLevel": {
			"Default": "Information",
			"Microsoft.AspNetCore": "Warning"
		}
	},
	"App": {
		"DataRoot": "/data",
		"EnableOpenApi": null,
		"Host": "*",
		"Prefix": "/",
		"Shortener": {
			"Host": "*",
			"Prefix": "/",
			"CaseInsensitiveSlugs": false,
			"DefaultSlugLength": 8
		},
		"Files": {
			"Host": "*",
			"Prefix": "/",
			"MaxFileUploadSize": 0
		}
	},
	"Auth": {
		"Oidc": {
			"Configuration": "",
			"ClientId": "",
			"ClientSecret": ""
		},
		"Password": {
			"Username": "",
			"Password": "",
			"PasswordHash": ""
		}
	},
	"Analytics": {
		"Plausible": {
			"DomainName": "",
			"Endpoint": "https://plausible.io/api/event"
		}
	}
}
```
