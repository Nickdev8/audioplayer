<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation'; // Import goto

	export let searchTerm = '';

	afterNavigate(() => {
		const url = new URL($page.url);
		searchTerm = url.searchParams.get('q') || '';
	});

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		const url = new URL($page.url);
		if (target.value) {
			url.searchParams.set('q', target.value);
		} else {
			url.searchParams.delete('q');
		}
		// Use goto instead of window.history.pushState and custom event
		goto(url.toString(), { replaceState: true, keepFocus: true });
	}
</script>

<header class="bg-gray-900 text-white p-3 flex items-center justify-between">
	<div class="flex items-center">
		<img src="/icon.png" alt="Logo" class="w-8 h-8 mr-4 invert" />
		<h1 class="text-xl font-bold">Music Player</h1>
	</div>
	<div class="flex items-center">
		<input
			type="search"
			placeholder="Search for a song..."
			class="bg-gray-800 text-white px-4 py-2 rounded-md w-full sm:w-auto"
			bind:value={searchTerm}
			on:input={handleSearch}
		/>
	</div>
</header>