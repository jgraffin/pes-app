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
      player.Id = Guid.NewGuid();
      player.CreatedAt = DateTime.UtcNow;
      player.UpdatedAt = DateTime.UtcNow;

      Players.Add(player);
      return Results.Ok(player);
    });

    app.MapPut("/players/{id:guid}", (Guid id, Player player) =>
    {
      var found = Players.Find(item => item.Id == id);

      if (found == null) return Results.NotFound();

      // Update only necessary fields, keeping the original Id
      found.Name = player.Name;
      found.Team = player.Team;
      found.Thumbnail = player.Thumbnail;
      found.UpdatedAt = DateTime.UtcNow;

      return Results.Ok(found); // Return the updated existing player, not the request body
    });


    app.MapDelete("/players/{id:guid}", (Guid id) =>
    {
      var found = Players.Find(item => item.Id == id);

      if (found is null)
        return Results.NotFound("Player not found!");


      Players.Remove(found);
      return Results.Ok(new { message = "Successfully deleted!" });
    });
  }
}
