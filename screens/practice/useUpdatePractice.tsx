import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePractice } from "@/supabase/supabase-queries";

export function useUpdatePractice(practice_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      new_title,
      new_is_shelved,
    }: {
      new_title: string;
      new_is_shelved: boolean;
    }) => updatePractice(practice_id, new_title, new_is_shelved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice", practice_id] });
      queryClient.invalidateQueries({ queryKey: ["practices"] });
    },
  });
}
