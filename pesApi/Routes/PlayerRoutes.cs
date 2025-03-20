using pesApi.Models;

namespace pesApi.Routes;

public static class PlayerRoutes
{
  // Empty list for players
  public static List<Player> Players = new List<Player>();

  // Mapping routes player
  public static void MapPlayersRoutes(this WebApplication app)
  {
    app.MapGet("/players", () => Players);

    app.MapPost("/players", (Player player) =>
    {
      Players.Add(player);
      return Results.Ok(player);
    });

    app.MapPut("/players/{id:guid}", (Guid id, Player player) =>
    {
      var found = Players.Find(item => item.Id == id);

      if (found == null) Results.NotFound();

      if (found != null) found.Name = player.Name;

      return Results.Ok(player);
    });

    app.MapDelete("/players/{id:guid}", (Guid id) =>
    {
      var found = Players.Find(item => item.Id == id);

      if (found == null)
      {
        return Results.NotFound("Player not found!");
      }

      Players.Remove(found);
      return Results.Ok(new { message = "Successfully deleted!" });
    });
  }
}
