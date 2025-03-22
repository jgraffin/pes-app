namespace pesApi.Models;

public class Team
{
  public Guid Id { get; set; }
  public string Name { get; set; }
  public string Thumbnail { get; set; }
  public bool IsSelected { get; set; }

  public Team(Guid id, string name, string thumbnail, bool isSelected)
  {
    Id = id;
    Name = name;
    Thumbnail = thumbnail;
    IsSelected = isSelected;
  }
}
