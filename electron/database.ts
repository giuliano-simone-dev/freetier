import Database from 'better-sqlite3';
import { app, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const dbPath =
	process.env.NODE_ENV === "development"
		? "./tierlist.db"
		: path.join(app.getPath('userData'), "./tierlist.db")

        let db:any;
try{
    db = new Database(dbPath)    
}catch (error) {
    console.error("Error opening database:", error);
}
db.pragma("journal_mode = WAL")


// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS tierlists (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS editingTierlists (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    );
`);

// IPC handlers
ipcMain.handle('db-save-tierlist', async (event, id: string, data: string) => {
    try {
        db.prepare("INSERT OR REPLACE INTO tierlists (id, data) VALUES (?, ?)").run(id, data);
        db.prepare("DELETE FROM editingTierlists WHERE id = ?").run(id); // Clear editing tierlist on save
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-save-editing-tierlist', async (event, id: string, data: string) => {
    try {
        db.prepare("INSERT OR REPLACE INTO editingTierlists (id, data) VALUES (?, ?)").run(id, data);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-get-tierlist', async (event, id: string) => {
    try {
        const tierlist = db.prepare("SELECT * FROM tierlists WHERE id = ?").get(id);
        if (!tierlist) {
            return { success: false, error: 'Tierlist not found' };
        }
        return { success: true, data: tierlist };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-get-tierlists', async () => {
    try {
        const tierlists = db.prepare("SELECT * FROM tierlists").all();
        return { success: true, data: tierlists };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-delete-tierlist', async (event, id: string) => {
    try {
        db.prepare("DELETE FROM tierlists WHERE id = ?").run(id);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-get-editing-tierlist', async (event, id: string) => {
    try {
        const tierlist = db.prepare("SELECT * FROM editingTierlists WHERE id = ?").get(id);
        console.log(`[${Date.now()}] Fetching editing tierlist:`, id);
        if (!tierlist) {
            // Load Original Tierlist if not found in editing
            const original = db.prepare("SELECT * FROM tierlists WHERE id = ?").get(id);
            if (!original) {
                return { success: false, error: 'Tierlist not found' };
            }
            return { success: true, data: original };
        }
        return { success: true, data: tierlist };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('db-reset-tierlist', async (event, id: string) => {
    try {
        db.prepare("DELETE FROM editingTierlists WHERE id = ?").run(id);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
});

export default db;