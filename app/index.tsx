import React from "react";
import "react-native-url-polyfill/auto";

import { supabase } from "@/supabase/supabase-client";
import { Session } from "@supabase/supabase-js";
import Auth from "@/screens/Auth";
import PracticeList from "@/screens/practice/PracticeListView";

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
  else return <PracticeList />;
}
