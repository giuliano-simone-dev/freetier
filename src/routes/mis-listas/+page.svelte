<script lang="ts">
    import type { PageProps } from './$types';
    import Tierlist from '$lib/classes/Tierlist';
	import CardTierList from '$lib/components/tierlist/Card.svelte';
  	import type { UUID } from 'crypto';
	import { showToast } from '$lib/stores/Toast';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	import { fly, fade } from 'svelte/transition';
  	import { goto } from '$app/navigation';
	let { data }: PageProps = $props();
	let tierlistsObjects = $state((data.tierlists as string[]).map((tierlist)=> Tierlist.fromJSON(tierlist)));

	function deleteTierlist(tierlist: Tierlist) {
		// Aquí puedes implementar la lógica para eliminar la tierlist
		// Por ejemplo, hacer una llamada a la API para eliminarla del servidor
		tierlist.deleteFromDatabase().then(() => {
			tierlistsObjects = tierlistsObjects.filter(t => t.id !== tierlist.id);
			showToast({
				title: "Tierlist eliminada",
				icon: CloseCircleSolid,
				color: "red",
				class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			});
		}).catch(error => {
			showToast({
				title: "Error al eliminar la tierlist",
				icon: CloseCircleSolid,
				color: "red",
				class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			});
			console.error(error);
		});
	}

	function resetList(tierlist: Tierlist) {
		tierlist.resetEditing().then(() => {
			showToast({
				title: "Lista reiniciada",
				icon: CloseCircleSolid,
				color: "blue",
				class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
			});
			goto(`./#/tierlist/${tierlist.id}`);
		}).catch(error => {
			showToast({
				title: "Error al reiniciar la lista",
				icon: CloseCircleSolid,
				color: "red",
				class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			});
			console.error(error);
		});
	}

</script>
<div class="padding-5p" in:fly={{ y: -100, duration: 300 }} >
	<h1 class="text-4xl font-bold mb-5">Mis Listas</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each tierlistsObjects as tierlist(tierlist.id)}
			<div out:fade={{ duration: 300 }} class="w-full">
				<CardTierList tierlist={tierlist} {deleteTierlist} {resetList} />
			</div>
		{/each}
	</div>
</div>

<style>
    .padding-5p {
        padding: 5%;
    }
</style>