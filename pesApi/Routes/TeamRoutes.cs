using pesApi.Models;

namespace pesApi.Routes;

public static class TeamRoutes
{

  // Static list of teams
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

  // Mapping routes for the api
  public static void MapTeamsRoutes(this WebApplication app)
  {
    app.MapGet("/teams", () => Teams);

    app.MapPut("/teams/{id:guid}", (Guid id, Team team) =>
    {
      var found = Teams.Find(item => item.Id == id);

      if (found is null) return Results.NotFound();

      found.Name = team.Name;
      found.Thumbnail = team.Thumbnail;

      if (found.IsSelected)
      {
        found.IsSelected = false;
      }

      found.IsSelected = true;

      return Results.Ok(found);
    });

  }

}
