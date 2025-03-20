using pesApi.Models;

namespace pesApi.Routes;

public static class TeamRoutes
{

  // Static list of teams
  public static List<Team> Teams = new()
  {
    new (Guid.NewGuid(), name: "Manchester City", thumbnail: "manchester-city"),
    new (Guid.NewGuid(), name: "Paris Saint Germain", thumbnail: "paris-saint-germain"),
    new (Guid.NewGuid(), name: "Barcelona", thumbnail: "barcelona"),
    new (Guid.NewGuid(), name: "Juventus", thumbnail: "juventus"),
    new (Guid.NewGuid(), name: "Real Madrid", thumbnail: "real-madrid"),
    new (Guid.NewGuid(), name: "Chelsea", thumbnail: "chelsea"),
    new (Guid.NewGuid(), name: "Arsenal", thumbnail: "arsenal"),
  };

  // Mapping routes for the api
  public static void MapTeamsRoutes(this WebApplication app)
  {
    app.MapGet("/teams", () => Teams);
  }

}
