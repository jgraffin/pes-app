namespace pesApi.Models;

public class Player
{
  public Guid Id { get; set; }
  public string Name { get; set; }
  public string Team { get; set; }
  public string Thumbnail { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
