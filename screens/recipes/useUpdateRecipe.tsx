import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateNugget } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function useUpdateRecipe(nugget_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (new_nugget: Tables<"Nuggets">) => updateNugget(new_nugget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nugget", nugget_id],
      });
      queryClient.invalidateQueries({ queryKey: ["nuggets"] });
      queryClient.invalidateQueries({ queryKey: ["nugget", nugget_id] });
    },
  });
}
