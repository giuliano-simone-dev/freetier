<script lang="ts">
    import type { TierListItem } from "$lib/classes/Tierlist";
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    type Props = {
        formModal: boolean;
        addItem?: (image: string, description: string) => void;
        removeItem?: (item: TierListItem) => void;
        item?: TierListItem;
    }
    let { formModal= $bindable(), addItem, removeItem, item} : Props = $props();
    const editing = Boolean(item);

    if(!item) item = {
        image: "",
        description: ""
    } as TierListItem;

    // Aserción de que item nunca será undefined después de la inicialización
    let currentItem = $state(item!);

    function clearItem() {
        item = {
            image: "",
            description: ""
        } as TierListItem; // Reset item when modal is closed
        currentItem = item!;
    }

    function handleRemove() {
        if (!removeItem || !item?.id) return;
        removeItem(item!);
        formModal = false;
        clearItem();
    }

    function onaction({ action, data } : { action: string, data: FormData }) {
        if(!addItem) return;
        let imageUrl = data.get("imageUrl");
        let description = data.get("description");
        if (action === "send" && imageUrl && description) {
        addItem(
            imageUrl.toString(),
            description.toString()
        );
        formModal = false;
        clearItem();
        }
    }
    $effect(() => {
        if(!formModal) {
            item = {
                image: "",
                description: ""
            } as TierListItem; // Reset item when modal is closed
        }
    });
    currentItem = item!; // Ensure currentItem is always the latest item
</script>

<Modal form bind:open={formModal} size="xs" {onaction}>
    <Label>
        <span class="space-y-2">URL de la imagen</span>
        <Input bind:value={currentItem.image} name="imageUrl" type="text" placeholder="https://example.com/image.jpg" />
    </Label>
    <Label>
        <span class="space-y-2">Descripción</span>
        <Input bind:value={currentItem.description} name="description" type="text" placeholder="Descripción del item" />
    </Label>
    {#if editing}
        <Button color="red" type="button" onclick={handleRemove} class="w-full">ELIMINAR</Button>
    {:else}
        <Button type="submit" value="send" class="w-full">Crear Item</Button>
    {/if}
</Modal>