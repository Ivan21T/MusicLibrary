using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TracksController : ControllerBase
{
	private readonly ITrackRepository _trackRepository;
	private readonly IMapper _mapper;

	public TracksController(ITrackRepository trackRepository, IMapper mapper)
	{
		_trackRepository = trackRepository;
		_mapper = mapper;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<TrackDto>>> GetAll()
	{
		var items = await _trackRepository.GetAllAsync();
		return Ok(_mapper.Map<IEnumerable<TrackDto>>(items));
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<TrackWithDetailsDto>> GetById(int id)
	{
		var item = await _trackRepository.GetByIdAsync(id);
		return item is null ? NotFound() : Ok(_mapper.Map<TrackWithDetailsDto>(item));
	}

	[HttpGet("by-genre/{genre}")]
	public async Task<ActionResult<IEnumerable<TrackWithDetailsDto>>> FindByGenre(string genre)
	{
		var items = await _trackRepository.FindByGenreWithDetailsAsync(genre);
		return Ok(_mapper.Map<IEnumerable<TrackWithDetailsDto>>(items));
	}

	[HttpPost]
	public async Task<ActionResult<TrackDto>> Create([FromBody] CreateTrackDto dto)
	{
		var entity = _mapper.Map<Track>(dto);
		entity = await _trackRepository.AddAsync(entity);
		if (dto.ArtistIds is { Count: > 0 })
		{
			await _trackRepository.SetTrackArtistsAsync(entity.TrackId, dto.ArtistIds);
		}
		var result = _mapper.Map<TrackDto>(entity);
		return CreatedAtAction(nameof(GetById), new { id = result.TrackId }, result);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateTrackDto dto)
	{
		var existing = await _trackRepository.GetByIdAsync(id);
		if (existing is null) return NotFound();
		_mapper.Map(dto, existing);
		await _trackRepository.UpdateAsync(existing);
		if (dto.ArtistIds is { Count: > 0 })
		{
			await _trackRepository.SetTrackArtistsAsync(existing.TrackId, dto.ArtistIds);
		}
		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		await _trackRepository.DeleteAsync(id);
		return NoContent();
	}
}


