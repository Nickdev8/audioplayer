import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema';
import dotenv from 'dotenv';

dotenv.config();

const sqlite = new Database(process.env.DATABASE_URL!);
const db = drizzle(sqlite, { schema });

function getRandomDuration() {
	return Math.floor(Math.random() * (300 - 180 + 1)) + 180;
}

async function main() {
	console.log('Seeding database...');

	
	await db.delete(schema.playlistItems);
	await db.delete(schema.trackGenres);
	await db.delete(schema.tracks);
	await db.delete(schema.genres);
	await db.delete(schema.albums);
	await db.delete(schema.artists);
	await db.delete(schema.playlists);

	
	const artistsToInsert = [
		{ name: 'NAUTILUS' },
		{ name: 'AC/DC' },
		{ name: 'Andie' },
		{ name: 'Ravyn Lenae' },
		{ name: 'Rex Orange County' },
		{ name: 'Vanilla Ice' },
		{ name: 'The Doors' },
		{ name: 'Danny Vera' },
		{ name: 'Bon Jovi' },
		{ name: 'Leon Thomas' },
		{ name: 'Rick Astley' },
		{ name: 'Bruno Mars' },
		{ name: 'Placeholder Artist 1' },
		{ name: 'Placeholder Artist 2' },
		{ name: 'Placeholder Artist 3' }
	];
	const insertedArtists = await db.insert(schema.artists).values(artistsToInsert).returning();

	const getArtistId = (name: string) => insertedArtists.find((a) => a.name === name)!.id;

	
	const albumsToInsert = [
		{ name: 'Virtual Insanity', artistId: getArtistId('NAUTILUS') },
		{ name: 'Live', artistId: getArtistId('AC/DC') },
		{ name: 'Time Moves Slow', artistId: getArtistId('Andie') },
		{ name: 'Love Me Not', artistId: getArtistId('Ravyn Lenae') },
		{ name: 'To the Extreme', artistId: getArtistId('Vanilla Ice') },
		{ name: 'The Doors', artistId: getArtistId('The Doors') },
		{ name: 'Roller Coaster', artistId: getArtistId('Danny Vera') },
		{ name: 'Cross Road', artistId: getArtistId('Bon Jovi') },
		{ name: 'Electric Soul', artistId: getArtistId('Leon Thomas') },
		{ name: 'Whenever You Need Somebody', artistId: getArtistId('Rick Astley') },
		{ name: 'Die With A Smile', artistId: getArtistId('Bruno Mars') },
		{ name: 'Placeholder Album 1', artistId: getArtistId('Placeholder Artist 1') },
		{ name: 'Placeholder Album 2', artistId: getArtistId('Placeholder Artist 2') },
		{ name: 'Placeholder Album 3', artistId: getArtistId('Placeholder Artist 3') }
	];
	const insertedAlbums = await db.insert(schema.albums).values(albumsToInsert).returning();

	const getAlbumId = (name: string) => insertedAlbums.find((a) => a.name === name)!.id;

	
	const genresToInsert = [
		{ name: 'Rock' },
		{ name: 'Pop' },
		{ name: 'Electronic' },
		{ name: 'Jazz' },
		{ name: 'Hip-Hop' },
		{ name: 'Acoustic' },
		{ name: 'Alternative' },
		{ name: 'R&B' },
		{ name: 'Classical' }
	];
	const insertedGenres = await db.insert(schema.genres).values(genresToInsert).returning();

	const getGenreId = (name: string) => insertedGenres.find((g) => g.name === name)!.id;

	
	const tracksToInsert = [
		{
			title: 'Virtual Insanity',
			albumId: getAlbumId('Virtual Insanity'),
			artistId: getArtistId('NAUTILUS'),
			duration: getRandomDuration(),
			audioSrc: '/audio/nautilus-virtual-insanity.flac',
			coverArt: '/images/virtual-insanity.jpg',
			genres: ['Jazz', 'Electronic']
		},
		{
			title: 'Thunderstruck (Live)',
			albumId: getAlbumId('Live'),
			artistId: getArtistId('AC/DC'),
			duration: getRandomDuration(),
			audioSrc: '/audio/ac-dc-brian-johnson-thunderstruck-live.flac',
			coverArt: '/images/acdc.jpg',
			genres: ['Rock']
		},
		{
			title: 'Back In Black (Live)',
			albumId: getAlbumId('Live'),
			artistId: getArtistId('AC/DC'),
			duration: getRandomDuration(),
			audioSrc: '/audio/ac-dc-brian-johnson-back-in-black-live.flac',
			coverArt: '/images/acdc.jpg',
			genres: ['Rock']
		},
		{
			title: 'Time Moves Slow',
			albumId: getAlbumId('Time Moves Slow'),
			artistId: getArtistId('Andie'),
			duration: getRandomDuration(),
			audioSrc: '/audio/andie-time-moves-slow.flac',
			coverArt: '/images/time-moves-slow.jpg',
			genres: ['Alternative', 'R&B']
		},
		{
			title: 'Love Me Not',
			albumId: getAlbumId('Love Me Not'),
			artistId: getArtistId('Ravyn Lenae'),
			duration: getRandomDuration(),
			audioSrc: '/audio/ravyn-lenae-rex-orange-county-love-me-not-feat-rex-orange-county.flac',
			coverArt: '/images/love-me-or-not.jpg',
			genres: ['R&B', 'Pop']
		},
		{
			title: 'Jump Around',
			albumId: getAlbumId('To the Extreme'),
			artistId: getArtistId('Vanilla Ice'),
			duration: getRandomDuration(),
			audioSrc: '/audio/vanilla-ice-jump-around.flac',
			coverArt: '/images/jump-around.jpg',
			genres: ['Hip-Hop']
		},
		{
			title: 'The Crystal Ship',
			albumId: getAlbumId('The Doors'),
			artistId: getArtistId('The Doors'),
			duration: getRandomDuration(),
			audioSrc: '/audio/the-doors-the-crystal-ship.flac',
			coverArt: '/images/the-crystal-ship.jpg',
			genres: ['Rock', 'Alternative']
		},
		{
			title: 'Roller Coaster',
			albumId: getAlbumId('Roller Coaster'),
			artistId: getArtistId('Danny Vera'),
			duration: getRandomDuration(),
			audioSrc: '/audio/danny-vera-roller-coaster.flac',
			coverArt: '/images/rollercoaster.jpg',
			genres: ['Pop', 'Acoustic']
		},
		{
			title: "It's My Life (2003 Acoustic Version)",
			albumId: getAlbumId('Cross Road'),
			artistId: getArtistId('Bon Jovi'),
			duration: getRandomDuration(),
			audioSrc: '/audio/bon-jovi-its-my-life-2003-acoustic-version.flac',
			coverArt: '/images/its-my-life.jpg',
			genres: ['Rock', 'Acoustic']
		},
		{
			title: 'MUTT',
			albumId: getAlbumId('Electric Soul'),
			artistId: getArtistId('Leon Thomas'),
			duration: getRandomDuration(),
			audioSrc: '/audio/leon-thomas-mutt.flac',
			coverArt: '/images/mutt.jpeg',
			genres: ['R&B', 'Jazz']
		},
		{
			title: 'Never Gonna Give You Up (Pianoforte)',
			albumId: getAlbumId('Whenever You Need Somebody'),
			artistId: getArtistId('Rick Astley'),
			duration: getRandomDuration(),
			audioSrc: '/audio/rick-astley-never-gonna-give-you-up-pianoforte.flac',
			coverArt: '/images/never-gonna-give-you-up.jpg',
			genres: ['Pop', 'Acoustic']
		},
		{
			title: 'Die With A Smile',
			albumId: getAlbumId('Die With A Smile'),
			artistId: getArtistId('Bruno Mars'),
			duration: getRandomDuration(),
			audioSrc: '/audio/die-with-a-smile.flac',
			coverArt: '/images/die-with-a-smile.jpg',
			genres: ['Pop', 'R&B']
		}
	];

	
	for (let i = 1; i <= 13; i++) {
		tracksToInsert.push({
			title: `Placeholder Track ${i}`,
			albumId: getAlbumId('Placeholder Album 1'),
			artistId: getArtistId('Placeholder Artist 1'),
			duration: getRandomDuration(),
			audioSrc: '/audio/placeholder.mp3',
			coverArt: '/images/placeholder.jpg',
			genres: ['Pop']
		});
	}

	const insertedTracks = await db.insert(schema.tracks).values(
		tracksToInsert.map(({ genres, ...track }) => track)
	).returning();

	
	const trackGenresToInsert = [];
	for (const track of tracksToInsert) {
		const trackId = insertedTracks.find((t) => t.title === track.title)!.id;
		for (const genreName of track.genres) {
			trackGenresToInsert.push({ trackId, genreId: getGenreId(genreName) });
		}
	}
	await db.insert(schema.trackGenres).values(trackGenresToInsert);

	
	const playlist = await db.insert(schema.playlists).values({ name: 'All Tracks' }).returning();
	await db
		.insert(schema.playlistItems)
		.values(insertedTracks.map((t) => ({ playlistId: playlist[0].id, trackId: t.id })));

	console.log('Database seeded successfully!');
	
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
