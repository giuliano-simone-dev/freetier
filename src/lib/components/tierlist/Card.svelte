<script lang="ts">
    import { Card } from "flowbite-svelte";
    import type Tierlist from "$lib/classes/Tierlist";
    import { Dropdown, DropdownItem, ToolbarButton, DropdownDivider } from "flowbite-svelte";
    import { DotsVerticalOutline, EditOutline, TrashBinOutline, FileExportOutline, RefreshOutline } from "flowbite-svelte-icons";
  import { preventDefault } from "svelte/legacy";

    type Props = {
        tierlist: Tierlist,
        deleteTierlist?: (tierlist: Tierlist) => void;
        resetList?: (tierlist: Tierlist) => void;
    }
    let {tierlist, deleteTierlist, resetList} : Props = $props();

    let collageItems = $derived(tierlist.availableItems.slice(0, 4));
    
    // Determinar el layout del collage basado en la cantidad de items
    let collageLayout = () => {
            const count = collageItems.length;
            switch(count) {
                case 1: return 'single';
                case 2: return 'double';
                case 3: return 'triple';
                case 4: return 'quad';
            default: return 'empty';
        }
    };

    let dropdownClass = $derived("dots-menu-"+tierlist.id);

</script>

<div class="space-y-4 py-2">
    <Card class="max-w-sm overflow-hidden h-80 flex flex-col relative" href={`./#/tierlist/${tierlist.id}`}>
        <div class="absolute right-0 z-10" role="presentation">
            <button class="group p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200" onclick={(e) => e.preventDefault()} onkeypress={(e) => e.preventDefault()}>
                <DotsVerticalOutline class="{dropdownClass} dots-menu text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white w-4 h-4" />
            </button>
            <Dropdown simple triggeredBy=".{dropdownClass}">
                <DropdownItem href="#/editor/{tierlist.id}" class="cursor-pointer">
                    <EditOutline size="sm" class="text-gray-500 inline align-middle" />
                    <p class="inline align-middle">Editar</p>
                </DropdownItem>
                {#if resetList}
                    <DropdownItem class="cursor-pointer" onclick={() => resetList(tierlist)}>
                        <RefreshOutline size="sm" class="text-gray-500 inline align-middle" />
                        <p class="inline align-middle">Reiniciar</p>
                    </DropdownItem>
                {/if}
                <DropdownItem class="cursor-pointer" href={tierlist.exportToFile()} download={`${tierlist.name}.tierlist`}>
                    <FileExportOutline size="sm" class="text-gray-500 inline align-middle" />
                    <p class="inline align-middle">Exportar</p>
                </DropdownItem>
                {#if deleteTierlist}
                    <DropdownDivider />
                    <DropdownItem class="cursor-pointer" onclick={(e:MouseEvent) => {e.preventDefault(); deleteTierlist?.(tierlist)}}>
                        <TrashBinOutline size="sm" class="inline align-middle text-red-500" />
                        <p class="inline align-middle text-red-500">Eliminar</p>
                    </DropdownItem>
                {/if}
            </Dropdown>
        </div>
        <!-- Collage de imágenes -->
        <div class="w-full h-48 relative">
            {#if collageLayout() === 'empty'}
                <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <span class="text-gray-400">Sin imágenes</span>
                </div>
            {:else if collageLayout() === 'single'}
                <img src={collageItems[0].image} alt={collageItems[0].description} class="w-full h-full object-cover object-top" />
            {:else if collageLayout() === 'double'}
                <div class="grid grid-cols-2 h-full gap-0.5">
                    <img src={collageItems[0].image} alt={collageItems[0].description} class="w-full h-full object-cover object-top" />
                    <img src={collageItems[1].image} alt={collageItems[1].description} class="w-full h-full object-cover object-top" />
                </div>
            {:else if collageLayout() === 'triple'}
                <div class="grid grid-cols-3 grid-rows-2 h-full gap-0.5">
                    <img src={collageItems[0].image} alt={collageItems[0].description} class="col-span-2 row-span-2 w-full h-full object-cover object-top" />
                    <img src={collageItems[1].image} alt={collageItems[1].description} class="w-full h-full object-cover object-top" />
                    <img src={collageItems[2].image} alt={collageItems[2].description} class="w-full h-full object-cover object-top" />
                </div>
            {:else if collageLayout() === 'quad'}
                <div class="grid grid-cols-2 grid-rows-2 h-full gap-0.5">
                    <img src={collageItems[0].image} alt={collageItems[0].description} class="w-full h-full object-cover object-top" />
                    <img src={collageItems[1].image} alt={collageItems[1].description} class="w-full h-full object-cover object-top" />
                    <img src={collageItems[2].image} alt={collageItems[2].description} class="w-full h-full object-cover object-top" />
                    <img src={collageItems[3].image} alt={collageItems[3].description} class="w-full h-full object-cover object-top" />
                </div>
            {/if}
        </div>
        
        <div class="px-6 py-4 flex-1 flex flex-col justify-between">
            <div>
                <h5 class="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{tierlist.name}</h5>
                <p class="text-sm text-gray-700 dark:text-gray-400 line-clamp-3 leading-relaxed">{tierlist.description}</p>
            </div>
        </div>
    </Card>
</div>