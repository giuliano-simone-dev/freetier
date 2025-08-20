// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		electronAPI: {
			saveTierlist: (id: string, data: string) => Promise<{ success: boolean; error?: string }>;
			saveEditingTierlist: (id: string, data: string) => Promise<{ success: boolean; error?: string }>;
			getTierlist: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
			getEditingTierlist: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
			getTierlists: () => Promise<{ success: boolean; data?: any; error?: string }>;
			deleteTierlist: (id: string) => Promise<{ success: boolean; error?: string }>;
			resetTierlist: (id: string) => Promise<{ success: boolean; error?: string }>;
		};
	}
}

export {};
