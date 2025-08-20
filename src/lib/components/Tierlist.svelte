<script lang="ts">
    import TierlistLevel from './TierlistLevel.svelte';
    import ItemsHolder from './ItemsHolder.svelte';
    import AnnotationModal from './tierlist/modals/items/Anotaciones.svelte';

    import { flip } from "svelte/animate";
    import { goto } from "$app/navigation";
    import { showToast } from "$lib/stores/Toast";
    import annotationModalStore from '$lib/stores/AnnotationModal';
    import Colors from '$lib/enums/colors';
    import {CheckCircleSolid, CloseCircleSolid} from 'flowbite-svelte-icons';

    import Tierlist from '$lib/classes/Tierlist';
    import type {TierListLevel as TierListLevelType} from '$lib/classes/Tierlist';
    import type { TierListItem } from "$lib/classes/Tierlist";
    import type {AnnotationModal as AnnotationModalType} from '$lib/stores/AnnotationModal';
    let { tierlist, isCreating = false } : { tierlist: Tierlist, isCreating?: boolean } = $props();

    let availableItems = $state([...tierlist.availableItems]);

    let annotationModalParams:AnnotationModalType = $state({
        showModal: false,
        editingItem: null
    });
    annotationModalStore.subscribe((value) => {
        annotationModalParams = value;
    });

    $effect(() => {
        annotationModalStore.set(annotationModalParams)
    });

    $effect(() => {
        // Actualizar availableItems cuando tierlist.availableItems cambie
        availableItems = [...tierlist.availableItems];
    });
    // Hacer los levels reactivos con $state
    let levels = $state([...tierlist.levels]);
    $effect(() => {
        // Actualizar levels cuando tierlist.levels cambie
        levels = [...tierlist.levels];
    });

    const updateDB = (() => {

        if(isCreating) return;

        tierlist.saveToEditingDatabase().catch((error) => {
            showToast({
                title: "Error al guardar la tierlist",
                icon: CloseCircleSolid,
                class: "bg-red-500 text-white",
                color: "red"
            });
        });
    });

    function updateLevel(updatedLevel: TierListLevelType) {
        const index = tierlist.levels.findIndex(l => l.id === updatedLevel.id);
        if (index !== -1) {
            tierlist.levels[index].name = updatedLevel.name;
            tierlist.levels[index].color = updatedLevel.color;
            tierlist.levels[index].items = updatedLevel.items;
        }
        updateDB();
    }
    function addItem(image: string, description: string) {
        tierlist.addAvailableItem(image, description);
        // Actualizar itemsDnD directamente
        availableItems = tierlist.availableItems;
    }
    function removeItem(item: TierListItem) {
        tierlist.removeAvailableItem(item);
        // Actualizar itemsDnD directamente
        availableItems = tierlist.availableItems;
    }
    function moveLevel(level: TierListLevelType, direction: 'up' | 'down') {
        const currentIndex = tierlist.levels.findIndex(l => l.id === level.id);
        if (direction === 'up' && currentIndex > 0) {
            // Intercambiar posiciones
            [tierlist.levels[currentIndex - 1], tierlist.levels[currentIndex]] = 
            [tierlist.levels[currentIndex], tierlist.levels[currentIndex - 1]];
        } else if (direction === 'down' && currentIndex < tierlist.levels.length - 1) {
            // Intercambiar posiciones
            [tierlist.levels[currentIndex], tierlist.levels[currentIndex + 1]] = 
            [tierlist.levels[currentIndex + 1], tierlist.levels[currentIndex]];
        }
        levels = [...tierlist.levels]; // Actualizar levels para reflejar el cambio
        updateDB();
    }

    function addLevel(level: TierListLevelType, direction: 'up' | 'down') {
        const baseIndex = tierlist.levels.findIndex(l => l.id === level.id);
        const newLevel = {
            id: crypto.randomUUID(), // Generar un ID único para el nuevo nivel
            name: `Nivel ${tierlist.levels.length + 1}`,
            color: Colors.CYAN, // Color por defecto
            items: []
        };

        if (direction === 'up') {
            tierlist.levels.splice(baseIndex, 0, newLevel);
        } else if (direction === 'down') {
            tierlist.levels.splice(baseIndex + 1, 0, newLevel);
        }
        levels = [...tierlist.levels]; // Actualizar levels para reflejar el cambio
        updateDB();
    }

    function emptyTier(level: TierListLevelType) {
        const index = levels.findIndex(l => l === level);
        if (index !== -1) {
            // Agregar items directamente al array de availableItems
            // También actualizar el tierlist
            tierlist.addAvailableItems(level.items);
            level.items = [];
            availableItems = tierlist.availableItems;
        }
        updateDB();
    }

    function deleteLevel(level: TierListLevelType) {
        const index = tierlist.levels.findIndex(l => l.id === level.id);
        if (index !== -1) {
            emptyTier(level); // Vaciar el nivel antes de eliminarlo
            // Eliminar el nivel del array
            tierlist.levels.splice(index, 1);
            levels = [...tierlist.levels]; // Actualizar levels para reflejar el cambio
        }
        updateDB();
    }

    function handleDropHolder(event: any, saveDB = false) {
        tierlist.availableItems = event.detail.items;
        availableItems = tierlist.availableItems;
        if (saveDB) {
            updateDB();
        }
    }
    function handleDropLevel(event: any, level: TierListLevelType, saveDB = false) {
        level.items = event.detail.items;
        if (saveDB) {
            updateDB();
        }
    }

    function saveChanges(){
        if(!isCreating) return;
        if(tierlist.availableItems.length === 0) {
            showToast({
                title: "No hay items disponibles",
                icon: CloseCircleSolid,
                class: "bg-red-500 text-white",
                color: "red"
            });
            return;
        }
        tierlist.saveToDatabase().then(() => {
            goto("./#/mis-listas");
            showToast({
                title: "Tierlist guardada correctamente",
                icon: CheckCircleSolid,
                class: "bg-blue-500 text-white",
                color: "green"
            });
        }).catch((error) => {
            console.error("Error guardando la tierlist:", error);
            showToast({
                title: "Error al guardar la tierlist",
                icon: CloseCircleSolid,
                class: "bg-red-500 text-white",
                color: "red"
            });
        });
        showToast({
            title: "Cambios Guardados",
            icon: CheckCircleSolid,
            class: "bg-blue-500 text-white",
            color: "green"
        });
    }

</script>

<div class="width-full text-center mb-4">
    {#if isCreating}
        <h1 contenteditable="true" bind:innerHTML={tierlist.name} class="text-3xl font-bold mb-4"></h1>
        <p contenteditable="true" bind:innerHTML={tierlist.description} class="text-gray-600 dark:text-gray-400"></p>

    {:else}
        <h1 class="text-3xl font-bold mb-4">{tierlist.name}</h1>
        <p class="text-gray-600 dark:text-gray-400">{tierlist.description}</p>
    {/if}
</div>

<div class="hero-container margin-25p">
    <main class="tierlist-container border-2 border-gray-300 dark:border-gray-800">
        {#each levels as level,i(level.id)}
            <div animate:flip={{ duration: 100 }}>
                <TierlistLevel level={levels[i]} {moveLevel} {addLevel} {emptyTier} {deleteLevel} {updateLevel} {isCreating} handleDrop={handleDropLevel} />
            </div>
        {/each}
    </main>
</div>

<ItemsHolder items={availableItems} {addItem} {removeItem} {saveChanges} isCreating={isCreating} handleDrop={handleDropHolder} />

<AnnotationModal bind:showModal={annotationModalParams.showModal} bind:editingItem={annotationModalParams.editingItem} />

<style>
     :global(#dnd-action-dragged-el .draggable-photo) {
        box-shadow: none;
        border: solid 2px white !important;
        outline: none !important;
    }
    
    /* También puedes probar sobrescribiendo el contenedor del elemento arrastrado */
    :global(#dnd-action-dragged-el) {
        border: none !important;
        outline: none !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important; /* Sombra más suave */
    }
    
    /* O eliminar completamente todos los bordes y sombras */
    :global(#dnd-action-dragged-el) {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    /* Eliminar borde al texto cuando se esta editando */
    [contenteditable="true"]:focus {
        outline: none !important;
        border: none !important;
    }
</style>