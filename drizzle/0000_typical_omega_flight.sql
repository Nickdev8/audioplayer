CREATE TABLE `albums` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`artist_id` integer,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `artists` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `playlist_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`playlist_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `track_genres` (
	`track_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`track_id`, `genre_id`),
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`album_id` integer,
	`artist_id` integer,
	`duration` integer NOT NULL,
	`audio_src` text NOT NULL,
	`cover_art` text,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE no action
);
