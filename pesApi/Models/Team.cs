namespace pesApi.Models;

public class Team
{
  public Guid Id { get; set; }
  public string Name { get; set; }
  public string Thumbnail { get; set; }

  public Team(Guid id, string name, string thumbnail)
  {
    Id = id;
    Name = name;
    Thumbnail = thumbnail;
  }
}
