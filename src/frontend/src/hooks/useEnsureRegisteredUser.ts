import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook that ensures the authenticated user is registered in the backend.
 * This hook automatically calls registerAuthenticatedUser() when an authenticated
 * actor is available, creating missing profile and wallet entries if needed.
 */
export function useEnsureRegisteredUser() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<void>({
    queryKey: ['ensureRegisteredUser', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.registerAuthenticatedUser();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: 1,
    staleTime: Infinity, // Only run once per session
  });

  return {
    ...query,
    isRegistering: actorFetching || query.isLoading,
    isRegistered: query.isSuccess,
    registrationError: query.error,
  };
}
