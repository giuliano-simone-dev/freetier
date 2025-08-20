const { contextBridge, ipcRenderer } = require('electron');

interface ElectronAPI {
    saveTierlist: (id: string, data: string) => Promise<{ success: boolean; error?: string }>;
    saveEditingTierlist: (id: string, data: string) => Promise<{ success: boolean; error?: string }>;
    getTierlist: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    getEditingTierlist: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    getTierlists: () => Promise<{ success: boolean; data?: any; error?: string }>;
    deleteTierlist: (id: string) => Promise<{ success: boolean; error?: string }>;
    resetTierlist: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const electronAPI: ElectronAPI = {
    saveTierlist: (id: string, data: string) => ipcRenderer.invoke('db-save-tierlist', id, data),
    saveEditingTierlist: (id: string, data: string) => ipcRenderer.invoke('db-save-editing-tierlist', id, data),
    getTierlist: (id: string) => ipcRenderer.invoke('db-get-tierlist', id),
    getEditingTierlist: (id: string) => ipcRenderer.invoke('db-get-editing-tierlist', id),
    getTierlists: () => ipcRenderer.invoke('db-get-tierlists'),
    deleteTierlist: (id: string) => ipcRenderer.invoke('db-delete-tierlist', id),
    resetTierlist: (id: string) => ipcRenderer.invoke('db-reset-tierlist', id)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);