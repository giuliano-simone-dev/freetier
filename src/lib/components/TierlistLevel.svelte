<script lang="ts">
    import type { TierListLevel } from "$lib/classes/Tierlist";
    import { CogSolid, CaretDownSolid, CaretUpSolid } from 'flowbite-svelte-icons';
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import DragablePhoto from "./DragablePhoto.svelte";
    import LevelOptions from "./LevelOptions.svelte";
    import Colors, { TextColors } from "$lib/enums/colors";

    type Props = {
        level: TierListLevel;
        moveLevel: (level: TierListLevel, direction: 'up' | 'down') => void;
        addLevel: (level: TierListLevel, direction: 'up' | 'down') => void;
        emptyTier: (level: TierListLevel) => void;
        deleteLevel: (level: TierListLevel) => void;
        handleDrop?: (event: any, level: TierListLevel, saveDB?: boolean) => void;
        updateLevel?: (updatedLevel: TierListLevel) => void;
        isCreating?: boolean;
    }

    let { level = $bindable(), moveLevel, addLevel, emptyTier, deleteLevel, isCreating, handleDrop, updateLevel } : Props = $props();

    let titleColor = $derived.by(() => {
        const colorKey = Object.entries(Colors).find(([_key, value]) => value === level.color)?.[0] as keyof typeof Colors;
        return colorKey ? TextColors[colorKey] : TextColors.BLACK;
    });
    let openOptions = $state(false);

    function handleDropInternal(event: any, saveDB = true) {
        if (handleDrop) {
            handleDrop(event, level, saveDB);
        } else {
            // Actualizar items directamente si no se proporciona handleDrop
            level.items = event.detail.items;
        }
    }

    $effect(() => {
        // Actualizar el nombre del nivel cuando cambie
        if (level.name) {
            level.name = level.name;
        }
        updateLevel?.(level);
    });


</script>


<div class="tierlist-level border-gray-300 dark:border-gray-800 border-b-2 last:border-b-0">
    <div 
        bind:innerHTML={level.name} 
        contenteditable="true"
        class="text-center text-black tierlist-level-name border-r border-gray-300 dark:border-gray-600 h-full {titleColor}" 
        style="background-color: {level.color};">
    </div>
    {#if isCreating}
        <div class="tierlist-level-content bg-gray-100 dark:bg-gray-950">
            {#each level.items as item(item.id)}
                <div class="inline-block" animate:flip={{duration: 100}} >
                    <DragablePhoto item={item} isCreating={false} formModal={false} />
                </div>
            {/each}
        </div>
    {:else}
        <div use:dndzone={{items: level.items, flipDurationMs: 100}} onconsider={(event) => handleDropInternal(event, false)} onfinalize={handleDropInternal} class="tierlist-level-content bg-gray-100 dark:bg-gray-950">
            {#each level.items as item(item.id)}
                <div class="inline-block" animate:flip={{duration: 100}} >
                    <DragablePhoto item={item} isCreating={false} formModal={false} />
                </div>
            {/each}
        </div>
    {/if}
    <div class="options bg-black text-white h-full">
        <button class="hover:bg-gray-700 open-options flex items-center justify-center" onclick={()=> {openOptions = true;}}><CogSolid size="xl" /></button>
        <button class="hover:bg-gray-700 subir-level flex items-center justify-center" onclick={()=> moveLevel(level,"up")}><CaretUpSolid size="xl" /></button>
        <button class="hover:bg-gray-700 bajar-level flex items-center justify-center" onclick={()=> moveLevel(level,"down")}><CaretDownSolid size="xl" /></button>
    </div>
</div>

{#if openOptions}
    <LevelOptions {level} bind:openOptions={openOptions} {addLevel} {emptyTier} {deleteLevel}/>
{/if}


<style>
.tierlist-level-name {
    display: flex;
    align-items: center;
    justify-content: center;
}
.tierlist-level {
    display: grid;
    grid-template-columns: 100px 1fr minmax(100px, auto);
    grid-template-rows: minmax(100px, auto);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}
.options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 2fr);
}
.open-options {
    grid-row: span 2 / span 2;
}


.bajar-level {
    grid-column-start: 2;
    grid-row-start: 2;
}

/* Eliminar el puntero de texto cuando se clickea tierlist-level-content */
.tierlist-level-content {
    user-select: none;
    cursor: default;
}

</style>