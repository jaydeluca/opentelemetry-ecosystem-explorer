import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "otel-javaagent-cache";
const DB_VERSION = 1;

const STORES = {
  METADATA: "metadata",
  INSTRUMENTATIONS: "instrumentations",
} as const;

interface CacheEntry<T> {
  key: string;
  data: T;
  cachedAt: number;
}

let dbInstance: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          db.createObjectStore(STORES.METADATA, { keyPath: "key" });
        }

        if (!db.objectStoreNames.contains(STORES.INSTRUMENTATIONS)) {
          db.createObjectStore(STORES.INSTRUMENTATIONS, { keyPath: "key" });
        }
      },
    });

    console.log("IndexedDB initialized");
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const db = await initDB();

    let entry = await db.get(STORES.METADATA, key);

    if (!entry) {
      entry = await db.get(STORES.INSTRUMENTATIONS, key);
    }

    if (!entry) {
      return null;
    }

    return (entry as CacheEntry<T>).data;
  } catch (error) {
    console.error(`Failed to get cached data for ${key}:`, error);
    return null;
  }
}

export async function setCached<T>(
  key: string,
  data: T,
  store: "metadata" | "instrumentations" = "instrumentations"
): Promise<void> {
  try {
    const db = await initDB();
    const storeName = store === "metadata" ? STORES.METADATA : STORES.INSTRUMENTATIONS;

    const entry: CacheEntry<T> = {
      key,
      data,
      cachedAt: Date.now(),
    };

    await db.put(storeName, entry);
  } catch (error) {
    console.error(`Failed to cache data for ${key}:`, error);
  }
}

export async function clearAllCached(): Promise<void> {
  try {
    const db = await initDB();
    await Promise.all([db.clear(STORES.METADATA), db.clear(STORES.INSTRUMENTATIONS)]);
    console.log("Cache cleared");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
}

export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export function isIDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}
