<script lang="ts">
    import type { TierListItem } from "$lib/classes/Tierlist";
    import { Modal, Label, Textarea, Button } from "flowbite-svelte";

    type Props = {
        showModal: boolean;
        editingItem: TierListItem | null;
    };

    let { showModal = $bindable(), editingItem = $bindable() }: Props = $props();

    let open = $derived(showModal && editingItem !== null);

</script>

<Modal title="Editar Anotaciones" form bind:open={open} size="xs" onclose={() => {
    showModal = false;
    editingItem = null;
}}>
    <Label>
        <Textarea bind:value={editingItem!.anotacion} name="anotaciones" class="w-full" placeholder="Escribe tus anotaciones aquí..." />
    </Label>
</Modal>