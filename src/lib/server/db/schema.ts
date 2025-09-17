import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const artists = sqliteTable('artists', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export const albums = sqliteTable('albums', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	artistId: integer('artist_id').references(() => artists.id)
});

export const tracks = sqliteTable('tracks', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	albumId: integer('album_id').references(() => albums.id),
	artistId: integer('artist_id').references(() => artists.id),
	duration: integer('duration').notNull(),
	audioSrc: text('audio_src').notNull(),
	coverArt: text('cover_art')
});

export const genres = sqliteTable('genres', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export const trackGenres = sqliteTable(
	'track_genres',
	{
		trackId: integer('track_id')
			.notNull()
			.references(() => tracks.id),
		genreId: integer('genre_id')
			.notNull()
			.references(() => genres.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.trackId, t.genreId] })
	})
);

export const playlists = sqliteTable('playlists', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export const playlistItems = sqliteTable('playlist_items', {
	id: integer('id').primaryKey(),
	playlistId: integer('playlist_id')
		.notNull()
		.references(() => playlists.id),
	trackId: integer('track_id')
		.notNull()
		.references(() => tracks.id)
});

export const artistRelations = relations(artists, ({ one, many }) => ({
	tracks: many(tracks),
	albums: many(albums)
}));

export const albumRelations = relations(albums, ({ one, many }) => ({
	artist: one(artists, {
		fields: [albums.artistId],
		references: [artists.id]
	}),
	tracks: many(tracks)
}));

export const trackRelations = relations(tracks, ({ one, many }) => ({
	artist: one(artists, {
		fields: [tracks.artistId],
		references: [artists.id]
	}),
	album: one(albums, {
		fields: [tracks.albumId],
		references: [albums.id]
	}),
	trackGenres: many(trackGenres)
}));

export const genreRelations = relations(genres, ({ many }) => ({
	trackGenres: many(trackGenres)
}));

export const trackGenresRelations = relations(trackGenres, ({ one }) => ({
	track: one(tracks, {
		fields: [trackGenres.trackId],
		references: [tracks.id]
	}),
	genre: one(genres, {
		fields: [trackGenres.genreId],
		references: [genres.id]
	})
}));

export const playlistRelations = relations(playlists, ({ many }) => ({
	playlistItems: many(playlistItems)
}));

export const playlistItemRelations = relations(playlistItems, ({ one }) => ({
	playlist: one(playlists, {
		fields: [playlistItems.playlistId],
		references: [playlists.id]
	}),
	track: one(tracks, {
		fields: [playlistItems.trackId],
		references: [tracks.id]
	})
}));