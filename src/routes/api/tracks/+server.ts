import { db } from '$lib/server/db';
import { tracks, artists, albums, genres, trackGenres } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';

export const prerender = true;

export async function GET() {
	const allTracks = await db.query.tracks.findMany({
		with: {
			artist: true,
			album: true,
			trackGenres: {
				with: {
					genre: true
				}
			}
		}
	});

	const result = allTracks.map((track) => ({
		...track,
		genres: track.trackGenres.map((tg) => tg.genre)
	}));

	return json(result);
}
