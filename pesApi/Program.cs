using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;
using pesApi.Routes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngularApp",
    policy =>
    {
      policy.WithOrigins("http://localhost:8100", "http://192.168.18.3:8100") // Allow Angular origin
        .AllowAnyMethod() // Allow any HTTP method (GET, POST, PUT, DELETE, etc.)
        .AllowAnyHeader() // Allow any headers
        .AllowCredentials(); // Allow credentials (if using authentication)
    });
});


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngularApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger(); // Enables Swagger JSON endpoint
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // Makes Swagger UI available at the root URL (http://localhost:5000/)
  });
}

app.UseHttpsRedirection();
app.MapTeamsRoutes();
app.MapPlayersRoutes();


app.Run();

