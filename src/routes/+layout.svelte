<script lang="ts">
	// TODO: Separar este componente en varios más pequeños (Navbar, Footer, etc.)
	import '../app.css';
	import { Toast } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropzone, Dropdown, DropdownItem } from "flowbite-svelte";
	import { DarkMode } from "flowbite-svelte";
	import type { UUID } from '$lib/types/UUID';
	import toastStore, { type ToastStore, showToast } from '$lib/stores/Toast';
	import { ExclamationCircleOutline, ChevronDownOutline, CloseCircleSolid, UploadOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { Modal, Button, P } from 'flowbite-svelte';
	import Tierlist from '$lib/classes/Tierlist';
	import { goto } from '$app/navigation';
	let toast: ToastStore = $state({
		showToast: false,
		title: 'Toast Notifications',
		icon: null,
		color: undefined,
		class: ""
	})
	let tierlist: Tierlist | null = $state(null);
	let alreadyExists = $state(false);

	let importModal = $state(false);

	let Icon = $derived(toast.icon);
	let fileList: FileList|null = $state(null);
	let importFile: File | null = $derived(Array.from(fileList??[null])[0]);


	function overrideTierlist(){
		if (!tierlist) return;

		tierlist.saveToDatabase().then(response => {
				showToast({
					title: "Tierlist actualizada",
					icon: CloseCircleSolid,
					color: "green",
					class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
				});
				goto(`./#/editor/${tierlist?.id}`);
				importModal = false;
				importFile = null;
				alreadyExists = false;
			}).catch(error => {
				showToast({
					title: "Error al importar la tierlist",
					icon: CloseCircleSolid,
					color: "red",
					class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
				});
			}
		);}

	$effect(() => {
		if (!importFile) return;

		Tierlist.importFromFile(importFile).then((result) => {
			tierlist = result;
			// Check if the tierlist already exists
			return Tierlist.getById(tierlist.id as UUID)
				// If the endpoint returns 404, it means the tierlist does not exist, so we can create it
	
		}).then(response => {
			if (response === null) {
					return tierlist?.saveToDatabase();
				} else {
					// If it exists, we can update it
					alreadyExists = true;
					return null;
				}
		})
		.then((next) => {
			if(next !== undefined) return;
			importModal = false;
			importFile = null;
			alreadyExists = false;
			showToast({
				title: "Tierlist Importada",
				icon: CloseCircleSolid,
				color: "green",
				class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			});
			goto(`./#/editor/${tierlist?.id}`);
		})
		.catch((error) => {
			showToast({
				title: "Error al importar la tierlist",
				icon: CloseCircleSolid,
				color: "red",
				class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			});
			importModal = false;
			importFile = null;
			console.error(error);
		})
		
	});

	let _unsubscribe = toastStore.subscribe((value: ToastStore) => {
		toast = value;
	});

	$effect(() =>{
		toastStore.set(toast);
	});

	let { children } = $props();
</script>

<Navbar class="bg-white bg-gray-100 dark:bg-gray-950 dark:text-white">
	<NavBrand href="./" class="text-xl font-semibold">
		FreeTier
	</NavBrand>
	<NavHamburger />
	<NavUl class="ml-auto">
		<NavLi href="./#/mis-listas">Mis Listas</NavLi>
		<NavLi class="cursor-pointer">Nueva Lista<ChevronDownOutline class="text-primary-800 inline h-6 w-6 dark:text-white" /></NavLi>
		<Dropdown simple class="min-w-25">
			<DropdownItem href="./#/editor" class="">
				<CirclePlusOutline size="sm" class="text-gray-500 inline align-middle" />
				<span class="leading-none align-middle">Crear</span>
			</DropdownItem>
			<DropdownItem onclick={() => (importModal = true)} class="">
				<UploadOutline size="sm" class="text-gray-500 inline align-middle" />
				<span class="leading-none align-middle">Importar</span>
			</DropdownItem>
		</Dropdown>
		<DarkMode />
	</NavUl>
</Navbar>

<div class="w-full dark:bg-gray-900 dark:text-white min-h-screen">
	{@render children()}
</div>

{#if toast.showToast}
	<div class="fixed bottom-0 right-0 m-4" in:fly={{ y: 100, duration: 300 }} out:fly={{ y: 100, duration: 300 }}>
		<Toast title={toast.title} class={toast.class} color={toast.color} onclose={() => toast.showToast = false}>
			{#snippet icon()}
				{#if Icon}
					<Icon></Icon>
				{/if}
			{/snippet}
			{toast.title}
		</Toast>
	</div>
{/if}

<Modal title="Importar Tierlist" form bind:open={importModal}>

	{#if alreadyExists}
		<div class="flex flex-col items-center justify-center text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-4">
			<ExclamationCircleOutline class="w-16 h-16 text-red-500 mb-3" />
			<h3 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">¡Atención!</h3>
			<p class="text-lg text-red-700 dark:text-red-300">La tierlist ya existe en tu colección</p>
			<p class="text-sm text-red-600 dark:text-red-400 mt-1">¿Deseas sobreescribirla?</p>
		</div>
	{:else}
		<Dropzone id="my-awesome-dropzone" bind:files={fileList} accept=".tierlist">
			<UploadOutline class="mb-3 h-10 w-10 text-gray-400" />
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			<span class="font-semibold">Click para importar</span>
			o Arrastre y Suelta el archivo
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">Tierlist</p>
		</Dropzone>
	{/if}
	{#snippet footer()}
		{#if alreadyExists}
			<div class="w-full justify-end flex">
				<Button color="red" class="mt-4" onclick={overrideTierlist}>Sobreescribir</Button>
			</div>
		{/if}
	{/snippet}

</Modal>
