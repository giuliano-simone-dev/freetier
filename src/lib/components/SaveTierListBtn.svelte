<script lang="ts">
    import {CheckCircleSolid} from "flowbite-svelte-icons";
    type Props = {
        saveChanges: () => void;
    }
    let { saveChanges } : Props = $props();
</script>

<button onclick={saveChanges} class="hover:bg-gray-500 transition-all cursor-pointer flex flex-col items-center justify-center flex-wrap text-center m-1 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-700" title="Add item">
    <CheckCircleSolid color="green" size="xl" class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
    <h2 class="text-sm w-full">Guardar TierList</h2>
</button>

