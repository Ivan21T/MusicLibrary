using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumsController : ControllerBase
{
	private readonly IAlbumRepository _albumRepository;
	private readonly IMapper _mapper;

	public AlbumsController(IAlbumRepository albumRepository, IMapper mapper)
	{
		_albumRepository = albumRepository;
		_mapper = mapper;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<AlbumDto>>> GetAll()
	{
		var items = await _albumRepository.GetAllAsync();
		return Ok(_mapper.Map<IEnumerable<AlbumDto>>(items));
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<AlbumDto>> GetById(int id)
	{
		var item = await _albumRepository.GetByIdAsync(id);
		return item is null ? NotFound() : Ok(_mapper.Map<AlbumDto>(item));
	}

	[HttpPost]
	public async Task<ActionResult<AlbumDto>> Create([FromBody] CreateAlbumDto dto)
	{
		var entity = _mapper.Map<Album>(dto);
		entity = await _albumRepository.AddAsync(entity);
		var result = _mapper.Map<AlbumDto>(entity);
		return CreatedAtAction(nameof(GetById), new { id = result.AlbumId }, result);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateAlbumDto dto)
	{
		var existing = await _albumRepository.GetByIdAsync(id);
		if (existing is null) return NotFound();
		_mapper.Map(dto, existing);
		await _albumRepository.UpdateAsync(existing);
		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		await _albumRepository.DeleteAsync(id);
		return NoContent();
	}
}


