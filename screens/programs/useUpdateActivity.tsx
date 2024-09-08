import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateActivity } from "@/supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function useUpdateActivity(activity: Tables<"Activities">) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      new_title,
      new_description,
    }: {
      new_title: string;
      new_description: string;
    }) => updateActivity(activity.id, new_title, new_description),
    onSuccess: () => {
      console.log(
        "Updated activity: ",
        activity.id,
        " from program ",
        activity.program_id
      );

      queryClient.invalidateQueries({
        queryKey: ["program", String(activity.program_id)],
      });
    },
  });
}
