import { db } from '$lib/server/db';
import { playlists, playlistItems, tracks, artists, albums, genres, trackGenres } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const prerender = true;

export async function GET() {
	const allPlaylists = await db.query.playlists.findMany({
		with: {
			playlistItems: {
				with: {
					track: {
						with: {
							artist: true,
							album: true,
							trackGenres: {
								with: {
									genre: true
								}
							}
						}
					}
				}
			}
		}
	});

	const result = allPlaylists.map((playlist) => ({
		...playlist,
		tracks: playlist.playlistItems.map((item) => ({
			...item.track,
			genres: item.track.trackGenres.map((tg) => tg.genre)
		}))
	}));

	return json(result);
}
