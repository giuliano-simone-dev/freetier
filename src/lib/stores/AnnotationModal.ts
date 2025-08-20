import {writable} from 'svelte/store';
import type {Component} from "svelte";
import type { TierListItem } from '$lib/classes/Tierlist';

export type AnnotationModal = {
    showModal: boolean;
    editingItem: TierListItem | null;
}

const annotationModalStore = writable<AnnotationModal>({
    showModal: false,
    editingItem: null
});

export default annotationModalStore;