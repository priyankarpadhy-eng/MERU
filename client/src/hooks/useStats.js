import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getStats(),
    staleTime: 60 * 1000,
  });
}
