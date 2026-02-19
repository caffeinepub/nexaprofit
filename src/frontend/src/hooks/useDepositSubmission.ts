import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { ExternalBlob } from '@/backend';

interface DepositSubmissionParams {
  file: File;
  onProgress?: (percentage: number) => void;
}

export function useDepositSubmission() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ file, onProgress }: DepositSubmissionParams): Promise<string> => {
      // Explicit authentication guard
      if (!identity) {
        throw new Error('You must be logged in to submit deposits');
      }

      if (!actor) {
        throw new Error('Actor not available');
      }

      // Convert File to Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob from bytes
      let blob = ExternalBlob.fromBytes(bytes);

      // Attach upload progress callback if provided
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }

      // Submit deposit to backend
      const result = await actor.submitDeposit(blob);
      return result;
    },
  });
}
