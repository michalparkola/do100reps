import { useQueryClient, useMutation } from "@tanstack/react-query";
import { saveNextRep } from "@/supabase/supabase-queries";

export function useAddRep(practice_id: string, next_rep_cnt: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (next_rep_text: string) =>
      saveNextRep(practice_id, next_rep_text, next_rep_cnt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reps", practice_id] });
    },
  });
}
