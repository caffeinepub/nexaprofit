import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Query hook to fetch the authenticated caller's unique number
export function useGetCallerNumber() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<bigint | null>({
    queryKey: ['callerUniqueNumber'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerNumber();
      } catch (error) {
        // If user hasn't been assigned a number yet, return null instead of throwing
        console.error('Error fetching unique number:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
