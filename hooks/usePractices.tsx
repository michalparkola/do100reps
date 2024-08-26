import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getSupabaseUserId,
  getSupabasePractices,
} from "../supabase/supabase-queries";
import { Tables } from "@/supabase/database.types";

export function usePractices(): UseQueryResult<Tables<"Practices">[]> {
  const { data: userid } = useQuery({
    queryKey: ["userid"],
    queryFn: getSupabaseUserId,
  });

  return useQuery({
    queryKey: ["practices", userid],
    queryFn: () => {
      if (userid) {
        const data = getSupabasePractices(userid);
        return data;
      }
    },
    enabled: !!userid,
  });
}
