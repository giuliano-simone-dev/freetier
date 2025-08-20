<script lang="ts">
    import type { TierListItem } from "$lib/classes/Tierlist";
    import {dndzone} from "svelte-dnd-action";
    import ItemDataModal from "./tierlist/modals/items/Data.svelte";
    import DragablePhoto from "./DragablePhoto.svelte";
    import { flip } from "svelte/animate";
    import CreateItem from "./CreateItem.svelte";
    import SaveTierListBtn  from "./SaveTierListBtn.svelte";
    type Props = {
        items: TierListItem[];
        isCreating?: boolean;
        handleDrop: (event: any, saveDB?: boolean) => void;
        removeItem?: (item: TierListItem) => void;
        addItem: (image: string, description: string) => void;
        saveChanges: () => void;
    }
    let { items, isCreating = false, handleDrop, addItem, removeItem, saveChanges } : Props = $props();
    let formModal = $state(false);
    let editingItem: TierListItem | null = $state(null);

</script>
<div class="flex lista">
<div class="flex flex-wrap w-full min-h-30" use:dndzone={{items: items, flipDurationMs: 100}} onconsider={(event) => handleDrop(event, false)} onfinalize={(event) => handleDrop(event, true)}>
    {#each items as item(item.id)}
        <div class="flex flex-wrap" animate:flip={{duration: 100}} >
            <DragablePhoto item={item} isCreating={isCreating} bind:formModal={formModal} bind:editingItem={editingItem} />
        </div>
    {/each}
</div>
{#if isCreating}
    <div class="block">
        <CreateItem {addItem} />
        <SaveTierListBtn {saveChanges} />
    </div>
{/if}
</div>

{#if formModal && editingItem}
    <ItemDataModal bind:formModal item={editingItem} removeItem={removeItem} />
{/if}