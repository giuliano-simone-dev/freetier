<script lang="ts">
    import type { TierListLevel } from "$lib/classes/Tierlist";
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import Colors, { TextColors } from "$lib/enums/colors";

    type Props = {
        level: TierListLevel;
        openOptions: boolean;
        addLevel: (level: TierListLevel, direction: 'up' | 'down') => void;
        emptyTier: (level: TierListLevel) => void;
        deleteLevel: (level: TierListLevel) => void;
    }

    let { level, openOptions = $bindable(), addLevel, emptyTier, deleteLevel } : Props = $props();

    function handleDelete(){
        deleteLevel(level);
        openOptions = false; // Cerrar el modal después de borrar el nivel
    }

</script>

<Modal title="Opciones del Tier {level.name}" bind:open={openOptions} size="xs" class="px-2">
    <Label>
        <span class="space-y-2">Nombre</span>
        <Input type="text" bind:value={level.name} placeholder="Nombre del Tier" />
    </Label>
    <Label>
        <span class="space-y-2">Color</span>
        <!-- Selector de colores predefinidos -->
        <div class="grid grid-cols-5 gap-2 mb-2">
            {#each Object.values(Colors) as color}
                <button
                    aria-label="Select color {color}"
                    type="button"
                    class="w-8 h-8 rounded border-2 {level.color === color ? 'border-black' : 'border-gray-300'}"
                    style="background-color: {color}"
                    onclick={() => {level.color = color; }}
                ></button>
            {/each}
        </div>
    </Label>
    {#snippet footer()}
    <div class="grid grid-cols-2 grid-rows-2 gap-y-5 gap-x-2 w-full">
        <Button type="button" onclick={() => addLevel(level, 'up')}>Añadir Tier Arriba</Button>
        <Button type="button" onclick={() => addLevel(level, 'down')}>Añadir Tier Abajo</Button>
        <Button type="button" onclick={() => handleDelete()}>Borrar Tier</Button>
        <Button type="button" onclick={() => emptyTier(level)}>Limpiar Tier</Button>
    </div>
    {/snippet}
</Modal>