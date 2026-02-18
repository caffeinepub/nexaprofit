import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Query hook to fetch the authenticated caller's wallet balance
export function useGetCallerWalletBalance() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<number | null>({
    queryKey: ['callerWalletBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerWalletBalance();
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

// Query hook to fetch the authenticated caller's weekly return
export function useGetCallerWeeklyReturn() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<number | null>({
    queryKey: ['callerWeeklyReturn'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerWeeklyReturn();
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

// Mutation hook to purchase an investment plan
export function usePurchaseInvestmentPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, amount }: { planId: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchaseInvestmentPlan(planId, amount);
    },
    onSuccess: () => {
      // Invalidate and refetch wallet balance and weekly return after successful purchase
      queryClient.invalidateQueries({ queryKey: ['callerWalletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyReturn'] });
    },
  });
}

// Mutation hook to initialize the caller's wallet
export function useInitializeCallerWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeCallerWallet();
    },
    onSuccess: () => {
      // Refetch wallet balance after initialization
      queryClient.invalidateQueries({ queryKey: ['callerWalletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyReturn'] });
    },
  });
}
