import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AIInsight } from '../backend';

export function useAIInsights() {
  const { actor, isFetching } = useActor();

  return useQuery<AIInsight[]>({
    queryKey: ['aiInsights'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAIInsights();
    },
    enabled: !!actor && !isFetching,
  });
}
