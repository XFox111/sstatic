# Configuration file

<!--@include: @/parts/wip.md-->

::: code-group

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
		},
		"Webhook": {
			"Endpoint": "",
			"Method": "GET",
			"Headers": {},
			"BodyTemplateFile": ""
		}
	}
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

[Auth:Password]
Username =
Password =
PasswordHash =

[Analytics:Plausible]
Endpoint = https://plausible.io/api/event
DomainName =

[Analytics:Webhook]
Endpoint =
Method = GET
BodyTemplateFile =

[Analytics:Webhook:Headers]
; X-Test = true
; X-URL = "{{url}}"
```

:::
