import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateProgram } from "@/supabase/supabase-queries";

export function useUpdateProgram(program_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      new_title,
      new_description,
    }: {
      new_title: string;
      new_description: string;
    }) => updateProgram(program_id, new_title, new_description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program", program_id] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}
