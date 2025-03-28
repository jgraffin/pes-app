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

      // Store the previous team before updating
      string? oldTeam = found.Team;

      // Update the player details
      found.Name = player.Name;
      found.Team = player.Team;
      found.Thumbnail = player.Thumbnail;
      found.UpdatedAt = DateTime.UtcNow;

      // Deselect the old team if no players are left
      if (!string.IsNullOrEmpty(oldTeam))
      {
        bool hasOtherPlayers = Players.Any(p => p.Team == oldTeam && p.Id != found.Id);
        if (!hasOtherPlayers)
        {
          var oldTeamObject = TeamRoutes.Teams.FirstOrDefault(t => t.Name == oldTeam);
          if (oldTeamObject != null)
          {
            oldTeamObject.IsSelected = false;
          }
        }
      }

      // Select the new team
      var newTeamObject = TeamRoutes.Teams.FirstOrDefault(t => t.Name == player.Team);
      if (newTeamObject != null)
      {
        newTeamObject.IsSelected = true;
      }

      return Results.Ok(found);
    });

    app.MapPost("/random-players", (List<Player> randomPlayers) =>
    {
      var randomPlayersId = Guid.NewGuid().ToString(); // Generate a UUID for the list
      var rng = new Random();

      var processedPlayers = randomPlayers
        .Select(player => new Player
        {
          Id = Guid.NewGuid(),
          Name = player.Name,
          Team = player.Team,
          Thumbnail = player.Thumbnail,
          CreatedAt = DateTime.UtcNow,
          UpdatedAt = DateTime.UtcNow
        })
        .OrderBy(_ => rng.Next()) // Shuffle the list randomly
        .ToList();

      return Results.Ok(new
      {
        randomPlayersId,
        players = processedPlayers
      });
    });



    app.MapDelete("/players/{id:guid}", (Guid id) =>
    {
      var found = Players.Find(item => item.Id == id);

      if (found is null)
        return Results.NotFound("Player not found!");

      Players.Remove(found);

      // Check if the deleted player's team is still assigned to other players
      bool hasOtherPlayers = Players.Any(p => p.Team == found.Team);

      if (!hasOtherPlayers)
      {
        // Find the team and reset isSelected if no players are left
        var team = TeamRoutes.Teams.FirstOrDefault(t => t.Name == found.Team);
        if (team != null)
        {
          team.IsSelected = false;
        }
      }

      return Results.Ok(new { message = $"{found.Name} Successfully deleted!" });
    });

  }
}
