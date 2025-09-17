import { db } from '$lib/server/db';
import { genres } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const prerender = true;

export async function GET() {
	const allGenres = await db.query.genres.findMany();
	return json(allGenres);
}
