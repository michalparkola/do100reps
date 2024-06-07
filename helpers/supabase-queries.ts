import { supabase } from "@/helpers/supabase";

export async function getSupabaseUserId() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    } else {
      return data.user.id;
    }
  }
  
export async function getSupabasePractices(userid: string) {
    const { data, error } = await supabase
      .from("Practices")
      .select()
      .eq("user_id", userid)
      .not("do100reps_title", "is", null);
  
    if (error) {
      throw new Error(error.message);
    } else {
      return data;
    }
  }