import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

// Query hook to check if the caller is an admin
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
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

// Mutation hook to credit a user's wallet (admin only)
export function useCreditUserWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, amount }: { userPrincipal: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Parse the principal string
      const principal = Principal.fromText(userPrincipal);
      
      // Call the backend method
      return actor.creditUserWallet(principal, amount);
    },
    onSuccess: () => {
      // Invalidate wallet-related queries after successful credit
      queryClient.invalidateQueries({ queryKey: ['callerWalletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyReturn'] });
    },
  });
}

// Mutation hook to set wallet balance by email (admin only)
export function useSetWalletBalanceByEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, balance }: { email: string; balance: number }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Call the backend method
      return actor.setWalletBalanceByEmail(email, balance);
    },
    onSuccess: () => {
      // Invalidate wallet-related queries after successful balance set
      queryClient.invalidateQueries({ queryKey: ['callerWalletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyReturn'] });
    },
  });
}

// Mutation hook to set wallet balance by Principal (admin only)
export function useSetWalletBalanceByPrincipal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, balance }: { userPrincipal: string; balance: number }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Parse the principal string
      const principal = Principal.fromText(userPrincipal);
      
      // Call the backend method
      return actor.setWalletBalance(principal, balance);
    },
    onSuccess: () => {
      // Invalidate wallet-related queries after successful balance set
      queryClient.invalidateQueries({ queryKey: ['callerWalletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyReturn'] });
    },
  });
}
