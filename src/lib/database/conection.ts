interface DatabaseResult {
    success: boolean;
    data?: any;
    error?: string;
}

declare global {
    interface Window {
        electronAPI: {
            saveTierlist: (id: string, data: string) => Promise<DatabaseResult>;
            saveEditingTierlist: (id: string, data: string) => Promise<DatabaseResult>;
            getTierlist: (id: string) => Promise<DatabaseResult>;
            getEditingTierlist: (id: string) => Promise<DatabaseResult>;
            getTierlists: () => Promise<DatabaseResult>;
            deleteTierlist: (id: string) => Promise<DatabaseResult>;
            resetTierlist: (id: string) => Promise<DatabaseResult>;
        };
    }
}

class DatabaseConnection {
    private get api() {
        return window.electronAPI;
    }

    async saveTierlist(id: string, data: string): Promise<DatabaseResult> {
        return await this.api.saveTierlist(id, data);
    }

    async saveEditingTierlist(id: string, data: string): Promise<DatabaseResult> {
        return await this.api.saveEditingTierlist(id, data);
    }

    async getTierlist(id: string): Promise<DatabaseResult> {
        return await this.api.getTierlist(id);
    }

    async getEditingTierlist(id: string): Promise<DatabaseResult> {
        return await this.api.getEditingTierlist(id);
    }

    async getTierlists(): Promise<DatabaseResult> {
        return await this.api.getTierlists();
    }

    async deleteTierlist(id: string): Promise<DatabaseResult> {
        return await this.api.deleteTierlist(id);
    }

    async resetTierlist(id: string): Promise<DatabaseResult> {
        return await this.api.resetTierlist(id);
    }
}

export default new DatabaseConnection();