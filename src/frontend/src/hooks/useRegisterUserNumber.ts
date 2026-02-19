import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useRegisterUserNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (number: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(BigInt(number));
    },
    onSuccess: () => {
      // Invalidate eligibility and unique number queries
      queryClient.invalidateQueries({ queryKey: ['depositEligibility'] });
      queryClient.invalidateQueries({ queryKey: ['uniqueNumber'] });
    },
  });
}
