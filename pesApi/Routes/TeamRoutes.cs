using pesApi.Models;
using pesApi.Routes; // Import PlayerRoutes namespace

namespace pesApi.Routes;

public static class TeamRoutes
{
  public static List<Team> Teams = new()
  {
    new (Guid.NewGuid(), name: "Manchester City", thumbnail: "manchester-city", isSelected: false),
    new (Guid.NewGuid(), name: "Paris Saint Germain", thumbnail: "paris-saint-germain", isSelected: false),
    new (Guid.NewGuid(), name: "Barcelona", thumbnail: "barcelona", isSelected: false),
    new (Guid.NewGuid(), name: "Juventus", thumbnail: "juventus", isSelected: false),
    new (Guid.NewGuid(), name: "Real Madrid", thumbnail: "real-madrid", isSelected: false),
    new (Guid.NewGuid(), name: "Chelsea", thumbnail: "chelsea", isSelected: false),
    new (Guid.NewGuid(), name: "Arsenal", thumbnail: "arsenal", isSelected: false),
  };

  public static void MapTeamsRoutes(this WebApplication app)
  {
    app.MapGet("/teams", () => Teams);

    app.MapPut("/teams/{id:guid}", (Guid id, Team team) =>
    {
      var found = Teams.Find(t => t.Id == id);
      if (found is null) return Results.NotFound();

      var previouslySelected = Teams.FirstOrDefault(t => t.IsSelected);

      if (previouslySelected != null && previouslySelected.Id != id)
      {
        bool hasPlayers = PlayerRoutes.Players.Any(p => p.Team == previouslySelected.Name);

        if (!hasPlayers)
        {
          previouslySelected.IsSelected = false;
        }
      }

      found.Name = team.Name;
      found.Thumbnail = team.Thumbnail;
      found.IsSelected = team.IsSelected;

      return Results.Ok(found);
    });
  }
}
