using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
	private readonly IArtistRepository _artistRepository;
	private readonly IMapper _mapper;

	public ArtistsController(IArtistRepository artistRepository, IMapper mapper)
	{
		_artistRepository = artistRepository;
		_mapper = mapper;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<ArtistDto>>> GetAll()
	{
		var items = await _artistRepository.GetAllAsync();
		return Ok(_mapper.Map<IEnumerable<ArtistDto>>(items));
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<ArtistDto>> GetById(int id)
	{
		var item = await _artistRepository.GetByIdAsync(id);
		return item is null ? NotFound() : Ok(_mapper.Map<ArtistDto>(item));
	}

	[HttpPost]
	public async Task<ActionResult<ArtistDto>> Create([FromBody] CreateArtistDto dto)
	{
		var entity = _mapper.Map<Artist>(dto);
		entity = await _artistRepository.AddAsync(entity);
		var result = _mapper.Map<ArtistDto>(entity);
		return CreatedAtAction(nameof(GetById), new { id = result.ArtistId }, result);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateArtistDto dto)
	{
		var existing = await _artistRepository.GetByIdAsync(id);
		if (existing is null) return NotFound();
		_mapper.Map(dto, existing);
		await _artistRepository.UpdateAsync(existing);
		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		await _artistRepository.DeleteAsync(id);
		return NoContent();
	}

	[HttpGet("{id}/albums-with-tracks")]
	public async Task<ActionResult<IEnumerable<AlbumWithTracksDto>>> GetAlbumsWithTracks(int id)
	{
		var albums = await _artistRepository.GetAlbumsWithTracksAsync(id);
		return Ok(_mapper.Map<IEnumerable<AlbumWithTracksDto>>(albums));
	}
}


