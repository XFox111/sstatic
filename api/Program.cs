using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SStatic;
using SStatic.Analytics;
using SStatic.Auth;
using SStatic.Endpoints;
using SStatic.Middleware;
using SStatic.OpenApi;
using SStatic.Shortener;
using SStatic.Shortener.Middleware;
using SStatic.StaticFiles;
using SStatic.StaticFiles.Middleware;

if (args.FirstOrDefault()?.Equals("hash-password") ?? false)
{
	CreatePasswordHash();
	return;
}

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.ConfigureHttpJsonOptions(options =>
{
	options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower));
});

// Get main configuration
AppConfig appConfig = builder.Configuration.GetSection("App").Get<AppConfig>() ?? new();
Directory.CreateDirectory(appConfig.FilesRoot);
Directory.CreateDirectory(appConfig.LinksRoot);
appConfig.EnableOpenApi ??= builder.Environment.IsDevelopment();
builder.Services.AddSingleton(appConfig);

// Configure database connection
builder.Services.AddDbContext<DatabaseContext>(options =>
{
	options.UseSqlite(appConfig.SqliteConnectionString);
	options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

// Configure basic services
builder.Services
	.AddValidation()
	.AddProblemDetails()
	.AddHealthChecks();

// Configure OpenAPI
if (appConfig.EnableOpenApi is true)
	builder.Services
		.AddOpenApi(options =>
			options.AddTransformers()
		)
		.AddHttpContextAccessor(); // Needed to determine whether we use https

// Configure key services
builder.Services
	.AddShortenerServices()
	.AddStaticFilesServices()
	.AddAnalytics(builder.Configuration);

// Configure authentication
builder.Services.AddAuthorization();
builder.AddAuthentication(appConfig.AppPrefix);

builder.Services.AddCors(options =>
	options.AddDefaultPolicy(policy =>
		policy
			.WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH")
			.AllowAnyOrigin()
	)
);

WebApplication app = builder.Build();

// Perform database migration, if needed
using (IServiceScope scope = app.Services.CreateScope())
{
	DatabaseContext context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
	context.Database.Migrate();
}

app.UseCors();
app.UseRouting();

// Use this middleware only if request was resolved to an endpoint
app.UseWhen(context => context.GetEndpoint()?.RequestDelegate is not null, appBuilder =>
{
	appBuilder.UseStatusCodePages();
	appBuilder.UseAuthentication();
	appBuilder.UseAuthorization();
});

app.UseWithHost(appConfig.AppHost, appBuilder =>
	appBuilder.UseSpaStaticFiles(appConfig.AppPrefix)
);

app.UseWithHost(appConfig.FilesHost, appBuilder =>
	appBuilder.UseSharedStaticFiles(appConfig.FilesPrefix)
);

app.UseWithHost(appConfig.ShortenerHost, appBuilder =>
	appBuilder.UseShortener(appConfig.ShortenerPrefix)
);

app.UseWithHost(appConfig.AppHost, appBuilder =>
	appBuilder.UseSpaIndexFallback(appConfig.AppPrefix)
);

app.MapAppEndpoints(appConfig.AppPrefix, mapOpenApi: appConfig.EnableOpenApi.Value)
	.RequireHost(appConfig.AppHost);

app.MapGet("/robots.txt", (IWebHostEnvironment env) =>
{
	IFileInfo robotsFile = env.WebRootFileProvider.GetFileInfo("robots.txt");

	if (robotsFile.Exists)
		return Results.File(robotsFile.PhysicalPath!, "text/plain");

	return Results.NotFound();
})
	.ShortCircuit()
	.ExcludeFromDescription();

app.RunLinksCleanup();

app.Run();

void CreatePasswordHash()
{
	string password = args.Length > 1 ? args[1] : string.Empty;

	if (string.IsNullOrEmpty(password))
	{
		Console.Write("Enter password: ");
		password = Utils.ReadPassword();

		if (string.IsNullOrEmpty(password))
		{
			Console.WriteLine("No password was provided.");
			return;
		}

		Console.Write("Repeat password: ");
		if (password != Utils.ReadPassword())
		{
			Console.WriteLine("Passwords don't match.");
			return;
		}
	}

	PasswordHasher<object> hasher = new();
	Console.WriteLine(hasher.HashPassword(null!, password));
}
