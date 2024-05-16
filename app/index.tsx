import React from "react";
import "react-native-url-polyfill/auto";
import PracticeView from "../components/PracticeView";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import Auth from "../components/Auth";

export default function Index() {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) return <Auth />;
  else return <PracticeView />;
}
