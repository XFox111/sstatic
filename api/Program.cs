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

builder.Configuration.AddIniFile("config.ini", optional: true, reloadOnChange: false);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.ConfigureHttpJsonOptions(options =>
	options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower))
);

// Get main configuration
AppConfig appConfig = builder.Configuration.GetSection("App").Get<AppConfig>() ?? new();
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
	.AddShortenerServices(appConfig.DataRoot, builder.Configuration.GetSection("App:Shortener"))
	.AddStaticFilesServices(appConfig.DataRoot, builder.Configuration.GetSection("App:Files"))
	.AddAnalytics(builder.Configuration.GetSection("Analytics"));

// Configure authentication
builder.Services.AddAuthorization();
builder.AddAuthentication(appConfig.Prefix);

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

app.UseWithHost(appConfig.Host, appBuilder =>
	appBuilder.UseSpaStaticFiles(appConfig.Prefix)
);

app.UseSharedStaticFiles();
app.UseShortener();

app.UseWithHost(appConfig.Host, appBuilder =>
	appBuilder.UseSpaIndexFallback(appConfig.Prefix)
);

app.MapAppEndpoints(appConfig.Prefix, mapOpenApi: appConfig.EnableOpenApi.Value)
	.RequireHost(appConfig.Host);

app.MapGet("/robots.txt", (IWebHostEnvironment env) =>
{
	IFileInfo robotsFile = env.WebRootFileProvider.GetFileInfo("robots.txt");

	return robotsFile.Exists
		? Results.File(robotsFile.PhysicalPath!, "text/plain")
		: Results.NotFound();
})
	.ShortCircuit()
	.ExcludeFromDescription();

app.ScheduleLinksCleanup();

app.Run();

void CreatePasswordHash()
{
	string password = args.Length > 1 ? args[1] : string.Empty;

	if (string.IsNullOrEmpty(password))
	{
		Console.Error.Write("Enter password: ");
		password = Utils.ReadPassword();

		if (string.IsNullOrEmpty(password))
		{
			Console.Error.WriteLine("No password was provided.");
			return;
		}

		Console.Error.Write("Repeat password: ");
		if (password != Utils.ReadPassword())
		{
			Console.Error.WriteLine("Passwords don't match.");
			return;
		}
	}

	PasswordHasher<object> hasher = new();
	Console.Write(hasher.HashPassword(null!, password));
	Console.Error.WriteLine();
}
