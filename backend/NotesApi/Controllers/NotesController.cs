using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApi.Data;
using NotesApi.Dtos;
using NotesApi.Models;

namespace NotesApi.Controllers;

[ApiController]
[Authorize]
[Route("api/notes")]
public class NotesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteResponse>>> GetAll()
    {
        var userId = GetUserId();
        var notes = await db.Notes
            .AsNoTracking()
            .Where(note => note.UserId == userId)
            .OrderByDescending(note => note.UpdatedAt)
            .Select(note => new NoteResponse(
                note.Id,
                note.Title,
                note.Content,
                note.CreatedAt,
                note.UpdatedAt))
            .ToListAsync();

        return Ok(notes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NoteResponse>> GetById(int id)
    {
        var userId = GetUserId();
        var note = await db.Notes
            .AsNoTracking()
            .Where(note => note.Id == id && note.UserId == userId)
            .Select(note => new NoteResponse(
                note.Id,
                note.Title,
                note.Content,
                note.CreatedAt,
                note.UpdatedAt))
            .SingleOrDefaultAsync();

        return note is null ? NotFound() : Ok(note);
    }

    [HttpPost]
    public async Task<ActionResult<NoteResponse>> Create(NoteRequest request)
    {
        var userId = GetUserId();
        var now = DateTime.UtcNow;
        var user = await db.Users.SingleAsync(user => user.Id == userId);

        var note = new Note
        {
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            CreatedAt = now,
            UpdatedAt = now,
            UserId = userId,
            User = user
        };

        db.Notes.Add(note);
        await db.SaveChangesAsync();

        var response = new NoteResponse(note.Id, note.Title, note.Content, note.CreatedAt, note.UpdatedAt);
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<NoteResponse>> Update(int id, NoteRequest request)
    {
        var userId = GetUserId();
        var note = await db.Notes.SingleOrDefaultAsync(note => note.Id == id && note.UserId == userId);

        if (note is null)
        {
            return NotFound();
        }

        note.Title = request.Title.Trim();
        note.Content = request.Content.Trim();
        note.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(new NoteResponse(note.Id, note.Title, note.Content, note.CreatedAt, note.UpdatedAt));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var note = await db.Notes.SingleOrDefaultAsync(note => note.Id == id && note.UserId == userId);

        if (note is null)
        {
            return NotFound();
        }

        db.Notes.Remove(note);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private int GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : 0;
    }
}
