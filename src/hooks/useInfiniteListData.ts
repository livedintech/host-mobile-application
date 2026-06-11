import { useMemo } from 'react';

export default function useInfiniteListData<T extends { id: string | number }>(
  pages?: any[],
) {
  return useMemo(() => {
    if (!pages) return [];

    const map = new Map<string | number, T>();

    pages.forEach(page => {
      const list =
        page?.chats ||
        page?.data ||
        page?.items ||
        page?.results ||
        page?.conversations ||
        [];

      list.forEach((item: T) => {
        map.set(item.id, item); // duplicates override
      });
    });

    return Array.from(map.values());
  }, [pages]);
}
