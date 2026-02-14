import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InvestmentPlan } from '../backend';

export function useInvestmentPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<InvestmentPlan[]>({
    queryKey: ['investmentPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInvestmentPlans();
    },
    enabled: !!actor && !isFetching,
  });
}
