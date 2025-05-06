import { useState, useCallback } from "react";

type FetchSource<T> = string | ((id: number | string) => Promise<T>);

export function useCachedItem<T>(source: FetchSource<T>) {
  const [cache, setCache] = useState<Record<string, T>>({});

  const fetchItem = async (id: number | string): Promise<T> => {
    const key = String(id);
    console.log("find item", key, cache[key]);
    if (id === null || id === undefined) {
      return undefined;
    }
    if (cache[key]) return cache[key];

    let item: T;

    if (typeof source === "function") {
      item = await source(id);
    } else if (typeof source === "string") {
      const url = source.replace("{id}", key);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
      item = await response.json();
    } else {
      throw new Error("Invalid source type");
    }

    console.log("Fetching item:", item);

    setCache(prev => ({ ...prev, [key]: item }));
    return item;
  };

  const getItem = useCallback(fetchItem, [cache, source]);

  return { getItem, cache };
}

export default useCachedItem;
