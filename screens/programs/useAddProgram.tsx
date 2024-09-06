import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addProgramToPractice } from "@/supabase/supabase-queries";

export function useAddProgram(practice_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (program_title: string) =>
      addProgramToPractice(practice_id, program_title),
    onSuccess: () => {
      console.log("Added program to practice: ", practice_id);

      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}
