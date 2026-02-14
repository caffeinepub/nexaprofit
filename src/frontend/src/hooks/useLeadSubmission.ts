import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface LeadSubmission {
  name: string;
  email: string;
  message: string;
}

export function useLeadSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, message }: LeadSubmission) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitLead(name, email, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
