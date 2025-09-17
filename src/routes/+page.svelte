<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let data: PageData;

	let view: 'grid' | 'list' = 'list';
	let nowPlaying: PageData['tracks'][number] | null = null;
	let isPlaying = false;
	let audio: HTMLAudioElement;
	let currentTime = 0;
	let duration = 0;
	let selectedGenreId: number | null = null;

	$: searchTerm = browser ? $page.url.searchParams.get('q') || '' : '';

	$: tracksToShow = data.tracks.filter((track) => {
		const matchesSearchTerm =
			track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			track.artist.name.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesGenre = selectedGenreId
			? track.trackGenres.some((tg) => tg.genreId === selectedGenreId)
			: true;

		return matchesSearchTerm && matchesGenre;
	});

	function playTrack(track: PageData['tracks'][number]) {
		if (nowPlaying?.id !== track.id) {
			nowPlaying = track;
			if (audio) {
				audio.src = track.audioSrc;
				audio.play();
				isPlaying = true;
			}
		} else {
			audio.currentTime = 0;
			audio.play();
			isPlaying = true;
		}
	}

	function togglePlayPause() {
		if (isPlaying) {
			audio.pause();
			isPlaying = false;
		} else {
			audio.play();
			isPlaying = true;
		}
	}

	function playNext() {
		if (!nowPlaying) return;
		const currentIndex = data.tracks.findIndex((t) => t.id === nowPlaying.id);
		const nextIndex = (currentIndex + 1) % data.tracks.length;
		playTrack(data.tracks[nextIndex]);
	}

	function playPrevious() {
		if (!nowPlaying) return;
		const currentIndex = data.tracks.findIndex((t) => t.id === nowPlaying.id);
		const prevIndex = (currentIndex - 1 + data.tracks.length) % data.tracks.length;
		playTrack(data.tracks[prevIndex]);
	}

	function formatTime(time: number) {
		if (isNaN(time)) return '0:00';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	function handleSeek(event: Event) {
		const target = event.target as HTMLInputElement;
		if (audio) {
			audio.currentTime = Number(target.value);
		}
	}

	function selectGenre(genreId: number | null) {
		selectedGenreId = genreId;
	}
</script>

<div class="container mx-auto p-2 flex flex-col h-full">
	<div class="flex justify-between items-center mb-4 flex-shrink-0">
		<h1 class="text-2xl font-bold text-blue-400">My Awesome Music Collection (Beta!)</h1>
		<div class="flex items-center space-x-2">
			<button
				on:click={() => (view = view === 'grid' ? 'list' : 'grid')}
				class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-all duration-300"
			>
				{view === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
			</button>
		</div>
	</div>

	<div class="mb-4 flex flex-wrap gap-1 p-2 bg-gray-800 rounded-xl shadow-inner flex-shrink-0">
		<button
			on:click={() => selectGenre(null)}
			class:bg-blue-500={selectedGenreId === null}
			class:hover:bg-blue-600={selectedGenreId === null}
			class:bg-gray-600={selectedGenreId !== null}
			class:hover:bg-gray-500={selectedGenreId !== null}
			class="text-white font-semibold px-3 py-1 rounded-full transition-colors duration-200 ease-in-out transform hover:scale-105"
		>
			All Genres
		</button>
		{#each data.genres as genre (genre.id)}
			<button
				on:click={() => selectGenre(genre.id)}
				class:bg-blue-500={selectedGenreId === genre.id}
				class:hover:bg-blue-600={selectedGenreId === genre.id}
				class:bg-gray-600={selectedGenreId !== genre.id}
				class:hover:bg-gray-500={selectedGenreId !== genre.id}
				class="text-white font-semibold px-3 py-1 rounded-full transition-colors duration-200 ease-in-out transform hover:scale-105"
			>
				{genre.name}
			</button>
		{/each}
	</div>

	<div class="flex-grow overflow-y-auto overflow-x-hidden pb-32">
		{#if view === 'grid'}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each tracksToShow as track (track.id)}
					<div
						class="bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer text-center transform hover:scale-105 transition-transform duration-200"
						on:click={() => playTrack(track)}
					>
						<img
							src={track.coverArt}
							alt={track.title}
							class="w-full aspect-square object-cover rounded-md mb-2 border-2 border-gray-600"
						/>
						<h2 class="text-base font-semibold truncate text-blue-300">{track.title}</h2>
						<p class="text-sm text-gray-400 truncate">Artist: {track.artist.name}</p>
						<div class="flex flex-wrap justify-center gap-1 mt-2">
							{#each track.trackGenres as tg}
								<span class="text-xs bg-blue-700 text-white px-2 py-1 rounded-full shadow-sm"
									>{tg.genre.name}</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				{#each tracksToShow as track (track.id)}
					<div
						class="bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer flex items-center gap-4 transform hover:translate-x-1 transition-transform duration-200"
						on:click={() => playTrack(track)}
					>
						<img
							src={track.coverArt}
							alt={track.title}
							class="w-12 h-12 object-cover rounded-md border-2 border-gray-600"
						/>
						<div class="flex-grow">
							<h2 class="text-lg font-semibold text-blue-300">{track.title}</h2>
							<p class="text-gray-400">Artist: {track.artist.name}</p>
							<div class="flex flex-wrap gap-1 mt-1">
								{#each track.trackGenres as tg}
									<span class="text-xs bg-blue-700 text-white px-2 py-1 rounded-full shadow-sm"
										>{tg.genre.name}</span>
								{/each}
							</div>
						</div>
						<div class="text-gray-500">{formatTime(track.duration)}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if nowPlaying}
	<div class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-4 border-blue-500 p-2 flex flex-col shadow-2xl">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<img src={nowPlaying.coverArt} alt={nowPlaying.title} class="w-12 h-12 object-cover rounded-md mr-4 border-2 border-white" />
				<div>
					<h2 class="text-lg font-semibold text-white">{nowPlaying.title}</h2>
					<p class="text-gray-400">By: {nowPlaying.artist.name}</p>
				</div>
			</div>
			<div class="flex items-center">
				<button class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-full mx-2 transform hover:scale-110 transition-transform" on:click={playPrevious}> Prev</button>
				<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full mx-2 transform hover:scale-110 transition-transform" on:click={togglePlayPause}>{isPlaying ? ' Pause' : ' Play'}</button>
				<button class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-full mx-2 transform hover:scale-110 transition-transform" on:click={playNext}>Next </button>
			</div>
		</div>
		<div class="w-full flex items-center mt-2">
			<span class="text-xs text-gray-400 mr-2">{formatTime(currentTime)}</span>
			<input type="range" class="w-full" min="0" max={duration} bind:value={currentTime} on:input={handleSeek} />
			<span class="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
		</div>
	</div>
{/if}

<audio bind:this={audio} on:ended={playNext} on:timeupdate={() => currentTime = audio.currentTime} on:loadedmetadata={() => duration = audio.duration} />

<style>
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: 100%;
	}

	input[type='range']:focus {
		outline: none;
	}

	input[type='range']::-webkit-slider-runnable-track {
		background: #4a5568;
		height: 0.5rem;
		border-radius: 0.25rem;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: -4px;
		background-color: #cbd5e0;
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
	}

	input[type='range']:focus::-webkit-slider-thumb {
		outline: 3px solid #cbd5e0;
		outline-offset: 0.125rem;
	}

	input[type='range']::-moz-range-track {
		background: #4a5568;
		height: 0.5rem;
		border-radius: 0.25rem;
	}

	input[type='range']::-moz-range-thumb {
		background-color: #cbd5e0;
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		border: none;
	}

	input[type='range']:focus::-moz-range-thumb {
		outline: 3px solid #cbd5e0;
		outline-offset: 0.125rem;
	}

	/* Custom Scrollbar */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-track {
		background: #2d3748; /* gray-800 */
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: #4a5568; /* gray-600 */
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #6b7280; /* gray-500 */
	}
</style>