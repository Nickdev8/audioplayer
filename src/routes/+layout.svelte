<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<!-- Make the entire body a flex column -->
<div class="flex flex-col h-screen">
    <Header />
    <!-- Main content area, takes up remaining height -->
    <main class="flex-grow overflow-hidden"> <!-- overflow-hidden here is fine for the main slot, as the page content will manage its own scroll -->
        <slot />
    </main>
</div>
