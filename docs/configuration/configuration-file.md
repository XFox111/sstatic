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
