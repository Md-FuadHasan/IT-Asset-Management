import Fuse from 'fuse.js';

/**
 * Perform a search that prioritizes exact matches but includes fuzzy results.
 * @param list - The array of items to search.
 * @param term - The search query term.
 * @param keys - The keys to search within the items.
 * @returns The filtered list of items.
 */
export function fuzzySearch<T>(list: T[], term: string, keys: string[]): T[] {
  if (!term.trim()) return list;

  // 1. Check for exact matches first (case-insensitive) across any of the specified keys
  const lowerTerm = term.toLowerCase();
  const exactMatches = list.filter((item: any) => 
    keys.some(key => {
      const val = item[key]?.toString().toLowerCase();
      return val === lowerTerm;
    })
  );

  // 2. Setup Fuse for fuzzy search
  const options = {
    keys,
    threshold: 0.3, // Lower is stricter (0.0 is perfect match)
    includeScore: true,
    shouldSort: true,
  };

  const fuse = new Fuse(list, options);
  const fuzzyResults = fuse.search(term).map(result => result.item);

  // 3. Combine and deduplicate
  // We prioritize exact matches by putting them at the top
  const combined = [...exactMatches, ...fuzzyResults];
  return Array.from(new Set(combined));
}
