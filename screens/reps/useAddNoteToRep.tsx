import { useQueryClient, useMutation } from "@tanstack/react-query";

import { createNote } from "@/supabase/supabase-queries";

export function useAddNoteToRep(rep_id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text }: { text: string }) => createNote(rep_id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", rep_id] });
    },
  });
}
