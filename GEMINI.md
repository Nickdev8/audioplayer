# GEMINI.md

## 🎯 Goal

Build a small demo website using **SvelteKit** that behaves like a mini Spotify:

* ~25 songs stored in a SQLite database (title, artist, album, **genre(s)**, duration, cover art, audio file path).
* A page to list all songs.
* A simple audio player (play/pause, next/prev).
* (Optional) playlists, likes, play counts.

This is **just a private demo**, so performance/scalability isn’t a big concern.

---

## 🛠️ Current Setup

✅ **SvelteKit** (minimal project, TypeScript enabled)
✅ **Prettier**
✅ **TailwindCSS** (+ typography plugin)
✅ **Drizzle ORM** with **SQLite**
✅ **better-sqlite3** driver

This means:

* I will define my schema using **Drizzle** instead of Prisma.
* I can seed the database using a small script that writes directly with Drizzle.

---

## 📝 What I Need to Do Next

### Current Deployment Issues

We are currently facing challenges deploying the SvelteKit application to a Raspberry Pi.

**Initial Problems & Resolutions:**
1.  **`Error [ERR_MODULE_NOT_FOUND]`:** The application initially failed to start because `npm install` and `npm run build` were not executed on the Raspberry Pi. This was resolved by running these commands on the target device.
2.  **`ERR_DLOPEN_FAILED` for `better-sqlite3`:** This error occurred due to an architecture mismatch (native module compiled on x86, run on ARM). It was resolved by deleting `node_modules` and `package-lock.json` and then re-running `npm install` on the Raspberry Pi to recompile `better-sqlite3` for the correct architecture and Node.js version.
3.  **`ReferenceError: manifest is not defined`:** This occurred during a debugging attempt where the `index.js` file was modified to isolate server initialization. It was resolved by correctly importing the `manifest` object.

**Current Critical Issue: Silent Application Crash**
Despite resolving the above issues and confirming that:
*   Node.js is working correctly (`node test.js` runs).
*   `better-sqlite3` can be initialized in isolation (`node test-sqlite.js` runs).
*   The SvelteKit application builds successfully (`npm run build` completes).
*   The Raspberry Pi has ample free RAM (`free -h` shows 7.2 GiB available).
*   The SvelteKit server's `init` method can be called successfully in isolation.

The application still **crashes silently** immediately after being launched (either via `pm2 start process.json` or directly with `node ./.svelte-kit/output/server/index.js`). No error messages are produced in `pm2` logs, `stdout`, or `stderr`, even with aggressive Node.js debug flags (`--trace-uncaught --abort-on-uncaught-exception`).

This indicates a very low-level issue causing the process to terminate before it can log any errors. The exact point of failure is currently unknown, but it occurs *after* the SvelteKit server's initial setup.

**Next Debugging Steps:**
**Next Debugging Steps:**
We are currently investigating potential issues with the database connection. The `src/lib/server/db/index.ts` file initializes the SQLite database using `better-sqlite3` and Drizzle ORM, relying on the `DB_PATH` environment variable.

**Previous Hypothesis:** A likely point of failure was if `DB_PATH` was unset, incorrect, or pointed to an inaccessible database file, which could cause a synchronous crash not caught by SvelteKit's error handling.

**Resolution:** We confirmed that `local.db` was missing. The database has now been successfully seeded using `npm run db:seed`, and the `local.db` file should now exist.

**Current Status:** We are now re-attempting to start the application to see if the database connection was the cause of the silent crash.

Other potential areas of investigation include:
*   Environment variable loading and access within the full SvelteKit application context.
*   Other SvelteKit hooks or modules that might be causing an unhandled exception.
*   File system access for assets (audio, images) or other resources.

* Tables: `artists`, `albums`, `tracks`, `playlists`, `playlist_items`, **`genres`**, **`track_genres`** (for many-to-many key `(track_id, genre_id)`)
* Use `drizzle-kit` to generate migrations.

> If you prefer a single genre per track, you can instead add a nullable `genre_id` FK on `tracks` and skip the join table — but many-to-many is closer to how music works.

### 2. Seed Database

* Write a `scripts/seed.ts` that inserts:
  * base entities (artists, albums)
  * **genres** (e.g., Pop, Rock, Hip-Hop, Electronic, Jazz, Classical, R&B)
  * 25 tracks with `audio_path`
  * entries in **`track_genres`** to map each track to one or more genres
  * a default playlist covering all tracks
* Include paths to MP3 files stored in `/static/audio`.

### 3. Prepare Assets

* Place MP3 files in `/static/audio`
* Place artist/album images in `/static/images`

### 4. Build API Endpoints

* `GET /api/tracks` → return track list as JSON **including `genres`**
* `GET /api/genres` → list all genres (optional)
* `GET /api/genres/[id]` → tracks filtered by genre (optional)

### 5. Build UI

* Use Tailwind for layout/styling
* `+page.server.ts` → load tracks and playlists from DB **and join `genres`**
* `+page.svelte` → display library + simple audio player
* (Optional) Add a **genre filter** (chips or dropdown) to filter the list client-side or via server load function

### 6. Optional Enhancements

* Likes + play counts (update via POST endpoints)
* Playlist editing and search/filter bar
* **Genre-aware views**: browse by genre, top tracks per genre

### 7. Deployment (Optional)

* Deploy to Vercel/Netlify using SvelteKit Node adapter
* Keep SQLite file for demo or switch to hosted Postgres/Supabase for persistence

---

## 🧾 Deliverables

* SvelteKit repo using **Drizzle + SQLite**
* Seeded database with 25 tracks **and genres**
* Working audio player page with optional genre filtering
* Clear instructions to run locally

---

### (Appendix) Quick ER Diagram

```
Artist 1—N Album
Artist 1—N Track
Album  1—N Track
Track N—M Genre (via track_genres)
Playlist 1—N PlaylistItem N—1 Track
```