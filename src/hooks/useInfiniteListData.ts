import { useMemo } from 'react';

export default function useInfiniteListData<T>(pages?: { data: T[] }[]) {
  return useMemo(() => {
    return pages?.flatMap(page => page.data) || [];
  }, [pages]);
}
