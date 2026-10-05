namespace NotesApi.Models;

public class Note
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public required User User { get; set; }
}
