<script lang="ts">
    import type { TierListItem } from "$lib/classes/Tierlist";
    import {MessageCaptionOutline} from 'flowbite-svelte-icons';
    let { item, isCreating, formModal=$bindable(), editingItem=$bindable() } : { item: TierListItem, isCreating?: boolean, formModal: boolean, editingItem?: TierListItem | null } = $props();

    import annotationModalStore, {type AnnotationModal} from "$lib/stores/AnnotationModal";

    function handleDoubleClick(event: MouseEvent) {
        if(isCreating){
            formModal = true;
            editingItem = item;
        }else{
            let annotationModalParams: AnnotationModal = {
                showModal: true,
                editingItem: item
            };
            annotationModalStore.set(annotationModalParams);
        }
    }
</script>

<button class="hover:bg-gray-500 transition-all inline-block draggable-photo m-1 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-700 relative" title="{item.description}" ondblclick={handleDoubleClick}>
    <img src="{item.image}" alt="" class="w-full h-fullr">
    {#if item.anotacion}
    <div class="absolute top-1 right-1" title="{item.anotacion}">
        <div class="rounded-full p-1 bg-black/50">
            <MessageCaptionOutline size="sm" xlink:title={item.anotacion} class="text-white"/>
        </div>
    </div>
    {/if}
</button>
