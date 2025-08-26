using AutoMapper;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.Application.Mapping;

public class MappingProfile : Profile
{
	public MappingProfile()
	{
		CreateMap<Artist, ArtistDto>();
		CreateMap<CreateArtistDto, Artist>();
		CreateMap<UpdateArtistDto, Artist>();

		CreateMap<Album, AlbumDto>();
		CreateMap<CreateAlbumDto, Album>();
		CreateMap<UpdateAlbumDto, Album>();
		CreateMap<Album, AlbumWithTracksDto>()
			.ForCtorParam("Tracks", opt => opt.MapFrom(a => a.Tracks));

		CreateMap<Track, TrackDto>();
		CreateMap<CreateTrackDto, Track>();
		CreateMap<UpdateTrackDto, Track>();
		CreateMap<Track, TrackWithDetailsDto>()
			.ForCtorParam("Album", opt => opt.MapFrom(t => t.Album))
			.ForCtorParam("Artists", opt => opt.MapFrom(t => t.TrackArtists.Select(ta => ta.Artist!)));
	}
}


