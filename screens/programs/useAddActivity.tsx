import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addActivity } from "@/supabase/supabase-queries";

export function useAddActivity(program_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => addActivity(program_id, title, description),
    onSuccess: () => {
      console.log("Added activity to program: ", program_id);

      queryClient.invalidateQueries({ queryKey: ["program", program_id] });
    },
  });
}
