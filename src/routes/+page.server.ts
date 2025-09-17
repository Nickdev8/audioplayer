import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async ({ fetch }) => {
	const [tracksResponse, playlistsResponse, genresResponse] = await Promise.all([
		fetch('/api/tracks'),
		fetch('/api/playlists'),
		fetch('/api/genres')
	]);

	const tracks = await tracksResponse.json();
	const playlists = await playlistsResponse.json();
	const genres = await genresResponse.json();

	return {
		tracks,
		playlists,
		genres
	};
};