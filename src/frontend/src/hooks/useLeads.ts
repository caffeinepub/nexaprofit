import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead } from '../backend';

export function useLeads(enabled: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: enabled && !!actor && !isFetching,
  });
}
