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

export async function getSupabasePracticeById(practiceid: string) {
  let userid = await getSupabaseUserId();
  const { data, error } = await supabase
    .from("Practices")
    .select()
    .eq("user_id", userid)
    .eq("id", practiceid);

  if (error) {
    throw new Error(error.message);
  } else {
    return data[0];
  }
}

export async function getSupabaseRepsByPracticeName(practiceName: string) {
  const { data, error } = await supabase
    .from("Reps")
    .select()
    .eq("practice", practiceName)
    .order("created_at", { ascending: false })
    .order("summary", { ascending: false });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getSupabaseRepsByPracticeId(practiceId: string) {
  let practice = await getSupabasePracticeById(practiceId);
  const practiceName = practice ? practice[0].name : "";

  const { data, error } = await supabase
    .from("Reps")
    .select()
    .eq("practice", practiceName)
    .order("created_at", { ascending: false })
    .order("summary", { ascending: false });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getNotesByRepId(rep_id: string) {
  const { data, error } = await supabase
    .from("RepNotes")
    .select()
    .eq("rep_id", rep_id)
    .order("modified_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function updateNote(note_id: string, text: string) {
  const { data, error } = await supabase
    .from("RepNotes")
    .update({ text: text })
    .eq("id", note_id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function createNote(rep_id: string, text: string) {
  const { data, error } = await supabase
    .from("RepNotes")
    .insert({ rep_id: rep_id, text: text });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
