import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ayfqyadblshevleutyge.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZnF5YWRibHNoZXZsZXV0eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1MjE1NDEsImV4cCI6MjAyNTA5NzU0MX0.419Zb1gezpJtCv8VxYBaQuxOjhLKYQjMFKYQeamXht0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export const handleLogout = async () => {
  if (!supabase) {
    console.error("Supabase context is null");
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error.message);
};