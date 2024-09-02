import { supabase } from "@/supabase/supabase-client";
import { Tables } from "./database.types";

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
  const userid = await getSupabaseUserId();
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

export async function savePracticeTitle(id: string, title: string) {
  await supabase
    .from("Practices")
    .update({ do100reps_title: title })
    .eq("id", id);
}

export async function getSupabaseRepsByPracticeId(practiceId: string) {
  const { data, error } = await supabase
    .from("Reps")
    .select()
    .eq("practice_id", practiceId)
    .order("created_at", { ascending: false })
    .order("summary", { ascending: false });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getNotesByRepId(rep_id: number) {
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

export async function createNote(rep_id: number, text: string) {
  const { data, error } = await supabase
    .from("RepNotes")
    .insert({ rep_id: rep_id, text: text });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getNuggets() {
  const { data, error } = await supabase
    .from("Nuggets")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getNugget(nugget_id: string) {
  const { data, error } = await supabase
    .from("Nuggets")
    .select()
    .eq("id", nugget_id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data[0];
  }
}

export async function updateNugget(
  new_nugget: Tables<"Nuggets">,
) {
  console.log("Saving nugget text!");
  const { data, error } = await supabase
    .from("Nuggets")
    .update(new_nugget)
    .eq("id", new_nugget.id);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function getSupabasePrograms(practice_id?: number) {
  if (practice_id) {
    const { data, error } = await supabase
      .from("Programs")
      .select()
      .eq("practice", practice_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    } else {
      return data;
    }
  } else {
    const { data, error } = await supabase
      .from("Programs")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    } else {
      return data;
    }
  }
}

export async function getSupabaseProgramById(programId: string) {
  const { data: program, error: programError } = await supabase
    .from("Programs")
    .select()
    .eq("id", programId);

  if (programError) {
    throw new Error(programError.message);
  } else {
    const { data: activities, error: activitiesError } = await supabase
      .from("Activities")
      .select()
      .eq("program_id", programId)
      .order("id");
    if (activitiesError) {
      throw new Error(activitiesError.message);
    } else {
      return { ...program[0], activities: activities };
    }
  }
}

export async function saveNextRep(
  practice_id: string,
  next_rep_text: string,
  next_rep_cnt: number,
): Promise<Tables<"Reps">> {
  if (next_rep_text.length == 0) {
    throw new Error("Error: tried to save empty rep");
  }

  const { data: new_rep, error: errorAddRep } = await supabase
    .from("Reps")
    .insert({ summary: next_rep_text, practice_id: Number(practice_id) })
    .select();

  if (errorAddRep) {
    throw new Error(errorAddRep.message);
  }

  const { error: errorUpdatePractice } = await supabase
    .from("Practices")
    .update({ do100reps_count: next_rep_cnt })
    .eq("id", practice_id);

  if (errorUpdatePractice) {
    throw new Error(errorUpdatePractice.message);
  }

  return new_rep[0];
}

export async function addRepToActivity(activity_id: number, rep_id: number) {
  const { data: activity, error: activityError } = await supabase
    .from("Activities")
    .select()
    .eq("id", activity_id);

  if (activityError) {
    throw new Error(activityError.message);
  }

  let new_related_reps = [];
  if (activity && activity.length > 0 && activity[0].related_reps) {
    if (activity[0].related_reps.includes(rep_id)) {
      console.log(
        "Skipped rep ",
        rep_id,
        " as it already exists in activity ",
        activity,
      );
      return activity;
    } else new_related_reps = [...activity[0].related_reps, rep_id];
  } else new_related_reps = [rep_id];

  const { error: appendRepError } = await supabase
    .from("Activities")
    .update({ related_reps: new_related_reps })
    .eq("id", activity_id);

  if (appendRepError) {
    throw new Error(appendRepError.message);
  }

  console.log("Added rep ", rep_id, " to activity: ", activity);
  return activity;
}
