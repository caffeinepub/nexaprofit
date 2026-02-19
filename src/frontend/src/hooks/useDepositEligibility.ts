import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DepositEligibility } from '../backend';

export function useDepositEligibility() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DepositEligibility>({
    queryKey: ['depositEligibility'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkDepositEligibility();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
