<script lang="ts">
    import {CirclePlusSolid} from "flowbite-svelte-icons";
    import CreateItemModal from "./tierlist/modals/items/Data.svelte";
    let formModal = $state(false);
    let { addItem } : { addItem: (image: string, description: string) => void; } = $props();
</script>

<button onclick={() => formModal = true} class="hover:bg-gray-500 transition-all cursor-pointer flex flex-col items-center justify-center flex-wrap text-center m-1 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-700" title="Add item">
    <CirclePlusSolid size="xl" class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
    <h2 class="text-sm w-full">Añadir Item</h2>
</button>

<CreateItemModal bind:formModal={formModal} {addItem} />
