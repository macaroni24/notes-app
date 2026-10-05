using System.ComponentModel.DataAnnotations;

namespace NotesApi.Dtos;

public class NoteRequest
{
    [Required, StringLength(100, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(3000)]
    public string Content { get; set; } = string.Empty;
}
