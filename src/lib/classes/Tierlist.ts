import Colors from "$lib/enums/colors";
import { type UUID } from 'crypto';
import db from "$lib/database/conection";
import { invalidate } from "$app/navigation";

export interface TierListItem {
    id: UUID;
    image: string;
    description: string;
    anotacion?: string; // Optional field for additional notes
}

export interface TierListLevel{
    id: UUID;
    name: string;
    color: Colors;
    items: TierListItem[];
}

export default class Tierlist {
    private _id: UUID|null = null; // Optional ID for the tier list, can be set later
    private _name: string;
    private _description: string;
    private _levels: TierListLevel[];
    private _availableItems: TierListItem[];

    constructor(name:string, description:string, levels:TierListLevel[], availableItems: TierListItem[] = []) {
        this._name = name;
        this._description = description;
        this._levels = levels;
        this._availableItems = availableItems;
    }

    public get id(): UUID|null {
        return this._id;
    }

    public set id(value: UUID|null) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get levels(): TierListLevel[] {
        return this._levels;
    }

    public set levels(value: TierListLevel[]) {
        this._levels = value;
    }

    public addLevel(level: TierListLevel): void {
        this._levels.push(level);
    }
    public removeLevel(level: TierListLevel): void {
        if(this._levels.length === 1) {
            throw new Error("Cannot remove the last level from the tier list.");
        }
        const index = this._levels.indexOf(level);
        if (index > -1) {
            this._levels.splice(index, 1);
        }
    }

    public get availableItems(): TierListItem[] {
        return this._availableItems;
    }

    public set availableItems(value: TierListItem[]) {
        this._availableItems = value;
    }
    public addAvailableItem(image: string, description:string): void {
        const newItem: TierListItem = {
            id: crypto.randomUUID(),
            image: image,
            description: description
        };
        this._availableItems.push(newItem);
    }
    public addAvailableItems(items: TierListItem[]): void {
        this._availableItems.push(...items);
    }
    public removeAvailableItem(item: TierListItem): void {
        const index = this._availableItems.findIndex(i => i.id == item.id);
        if (index > -1) {
            this._availableItems.splice(index, 1);
        }
    }

    public moveLevelUp(level: TierListLevel): void {
        const index = this._levels.indexOf(level);
        if (index > 0) {
            const temp = this._levels[index - 1];
            this._levels[index - 1] = this._levels[index];
            this._levels[index] = temp;
        }
    }

    public moveLevelDown(level: TierListLevel): void {
        const index = this._levels.indexOf(level);
        if (index < this._levels.length - 1) {
            const temp = this._levels[index + 1];
            this._levels[index + 1] = this._levels[index];
            this._levels[index] = temp;
        }
    }

    public toJSON(): string {
        return JSON.stringify({
            id: this._id,
            name: this._name,
            description: this._description,
            levels: this._levels,
            availableItems: this._availableItems
        });
    }


    public exportToFile(): string {
        const data = this.toJSON();
        // Comprimir data y parsear
        let compressedData = btoa(encodeURIComponent(data));

        const blob = new Blob([compressedData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        return url;
    }

    static fromJSON(json: string|object): Tierlist {
        const data = typeof json === "string" ? JSON.parse(json) : json;
        const tierlist = new Tierlist(
            data.name,
            data.description,
            data.levels,
            data.availableItems
        );
        tierlist.id = data.id;
        return tierlist;
    }

    static importFromFile(file: File): Promise<Tierlist> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = event.target?.result as string;
                    const json = decodeURIComponent(atob(data));
                    const tierlist = Tierlist.fromJSON(json);
                    resolve(tierlist);
                } catch (error) {
                    reject(new Error("Failed to parse tier list from file"));
                }
            };
            reader.onerror = () => {
                reject(new Error("Failed to read file"));
            };
            reader.readAsText(file);
        });
    }

    static getDefaultTierList(): Tierlist {
        return new Tierlist("New Tier List", "This is a new tier list description.", [
            { id: crypto.randomUUID(), name: "Nivel 1", color: Colors.RED, items: [] },
            { id: crypto.randomUUID(), name: "Nivel 2", color: Colors.GREEN, items: [] },
            { id: crypto.randomUUID(), name: "Nivel 3", color: Colors.BLUE, items: [] },
            { id: crypto.randomUUID(), name: "Nivel 4", color: Colors.PINK, items: [] },
            { id: crypto.randomUUID(), name: "Nivel 5", color: Colors.LIME, items: [] }
        ]);
    }

    // DB Functions
    public async saveToDatabase(): Promise<void> {
        try {
            if (!this._id) {
                this._id = crypto.randomUUID();
            }
            const data = this.toJSON();
            const result = await db.saveTierlist(this._id, data);
            invalidate(`tierlist:${this._id}`);
            if (!result.success) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error saving tier list to database:", error);
            throw new Error("Failed to save tier list to database");
        }
    }

    public async saveToEditingDatabase(): Promise<void> {
        try {
            if (!this._id) {
                throw new Error("Tier list ID is not set. Cannot save to editing database.");
            }
            const data = this.toJSON();
            const result = await db.saveEditingTierlist(this._id, data);
            invalidate(`tierlist:${this._id}`);
            if (!result.success) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error saving tier list to editing database:", error);
            throw new Error("Failed to save tier list to editing database");
        }
    }

    public async resetEditing(): Promise<void> {
        try {
            if (!this._id) {
                throw new Error("Tier list ID is not set. Cannot reset editing.");
            }
            const result = await db.resetTierlist(this._id);
            if (!result.success) {
                throw new Error(result.error);
            }
            invalidate(`tierlist:${this._id}`);
        } catch (error) {
            console.error("Error resetting tier list editing:", error);
            throw new Error("Failed to reset tier list editing");
        }
    }

    public async deleteFromDatabase(): Promise<void> {
        try {
            if (!this._id) {
                throw new Error("Tier list ID is not set. Cannot delete from database.");
            }
            const result = await db.deleteTierlist(this._id);
            if (!result.success) {
                throw new Error(result.error);
            }
            invalidate(`tierlist:${this._id}`);
        } catch (error) {
            console.error("Error deleting tier list from database:", error);
            throw new Error("Failed to delete tier list from database");
        }
    }

    static async getById(id: UUID): Promise<Tierlist|null> {
        try {
            const result = await db.getTierlist(id);
            if (!result.success) {
                return null; // Return null if the tier list is not found
            }
            return result.data ? Tierlist.fromJSON(result.data.data) : null;
        } catch (error) {
            console.error("Error getting tier list by ID:", error);
            throw new Error("Failed to get tier list by ID");
        }
    }

    static async getEditingById(id: UUID): Promise<Tierlist|null> {
        try {
            if (!id) {
                throw new Error("ID is required to get the editing tier list.");
            }
            const result = await db.getEditingTierlist(id);
            if (!result.success) {
                return null; // Return null if the tier list is not found
            }
            return Tierlist.fromJSON(result.data.data);
        } catch (error) {
            console.error("Error getting editing tier list by ID:", error);
            return null;
        }
    }

    static async getAllFromDatabase(): Promise<Tierlist[]> {
        try {
            const result = await db.getTierlists();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data.map((item: {id: UUID, data: string}) => 
                Tierlist.fromJSON(item.data)
            );
        } catch (error) {
            console.error("Error getting tierlists from database:", error);
            throw new Error("Failed to get tierlists from database");
        }
    }


}