<script lang="ts">
    import type {PageProps} from './$types';
    import Tierlist from "$lib/classes/Tierlist";
    import TierlistComponent from "$lib/components/Tierlist.svelte";
    let { data } : PageProps = $props();
    let tierlist: Tierlist = $state(Tierlist.fromJSON(data.tierlist));
</script>

<main class="hero-container">
    <div class="padding-5p">
        <TierlistComponent isCreating={true} {tierlist} />
    </div>
</main>

<style>
    .padding-5p {
        padding: 5%;
    }
</style>