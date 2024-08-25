import { useQueryClient, useMutation } from "@tanstack/react-query";
import { saveNextRep } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";
import { addRepToActivity } from "@/supabase/supabase-queries";

export function useAddRep(
  practice_id: string,
  next_rep_cnt: number,
  activity_id?: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (next_rep_text: string) =>
      saveNextRep(practice_id, next_rep_text, next_rep_cnt),
    onSuccess: (data: Tables<"Reps">) => {
      console.log("New rep id = ", data.id);
      if (activity_id) {
        addRepToActivity(activity_id, data.id);
      }

      queryClient.invalidateQueries({ queryKey: ["reps", practice_id] });
    },
  });
}
