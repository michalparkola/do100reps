import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addRepToActivity } from "@/supabase/supabase-queries";

export function useRelateRepToActivity(activity_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rep_id: number) => addRepToActivity(activity_id, rep_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
  });
}
