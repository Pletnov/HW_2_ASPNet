using HW_2.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


var messages = new List<Message>
{
    new Message { Id=1, Email = "john@gmail.com", Text="Hello Roman!", Date = DateOnly.Parse("27-05-2025"), Time = TimeOnly.Parse("21:00:00")},
    new Message { Id=2, Email = "roman@gmail.com", Text="Hello John!", Date = DateOnly.Parse("28-05-2025"), Time = TimeOnly.Parse("18:32:54")}
};


app.MapGet("/api/messages", async (HttpContext context) =>
{
    context.Response.ContentType = "application/json; charset=utf-8";
    await context.Response.WriteAsJsonAsync(messages);
});

app.MapGet("/api/messages/{email}", async (HttpContext context, [FromRoute] string email) =>
{
    var message = messages.FirstOrDefault(m => m.Email == email);
    context.Response.ContentType = "application/json; charset=utf-8";
    if (message != null)
    {
        await context.Response.WriteAsJsonAsync(message);
    }
    else
    {
        context.Response.StatusCode = 404;
    }
});

app.MapGet("/api/messages/{id:int}", async (HttpContext context, [FromRoute] int id) =>
{
    var message = messages.FirstOrDefault(m => m.Id == id);
    context.Response.ContentType = "application/json; charset=utf-8";
    if (message != null)
    {
        await context.Response.WriteAsJsonAsync(message);
    }
    else
    {
        context.Response.StatusCode = 404;
    }
});
app.MapPost("/api/messages", async (HttpContext context, [FromForm] Message message) =>
{
    var maxId = messages.Any() ? messages.Max(m => m.Id) : 0;
    message.Id = maxId + 1;
    messages.Add(message);
    context.Response.Redirect("/index.html");

}).DisableAntiforgery();
app.MapDelete("/api/messages/{id:int}", async (HttpContext context, [FromRoute] int id) =>
{
    var messageToRemove = messages.FirstOrDefault(m => m.Id == id);
    if(messageToRemove != null)
    {
        messages.Remove(messageToRemove);
        context.Response.StatusCode = 204;
    } else
    {
        context.Response.StatusCode = 404;
    }
}).DisableAntiforgery();

app.UseStaticFiles();

app.Run();
