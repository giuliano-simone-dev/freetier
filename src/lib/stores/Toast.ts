import {writable} from 'svelte/store';
import type {Component} from "svelte";

export type ToastColor = 
    | "green" | "primary" | "gray" | "red" | "orange" 
    | "amber" | "yellow" | "lime" | "emerald" | "teal" 
    | "cyan" | "sky" | "blue" | "indigo" | "violet" 
    | "purple" | "fuchsia" | "pink" | "rose" 
    | undefined;
    
export type ToastStore = {
    showToast: boolean;
    title: string;
    icon: Component<any, any, any>|null;
    class: string;
    color: ToastColor;
}

const toastStore = writable<ToastStore>({
    showToast: false,
    title: "",
    icon: null,
    class: "",
    color: undefined
})

export function showToast(params: {title: string, icon: Component<any, any, any>|null, class?: string, duration?: number, color?: ToastColor}) {
    toastStore.set({
        showToast: true,
        title: params.title,
        icon: params.icon,
        class: params.class || "",
        color: params?.color
    });
    setTimeout(() => {
        toastStore.set({
            showToast: false,
            title: "",
            icon: null,
            class: "",
            color: undefined
        });
    }, params.duration || 3000);
}

export default toastStore;