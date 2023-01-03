import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://hapovpxkklgqzwcyipsj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcG92cHhra2xncXp3Y3lpcHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1Nzc1MDIsImV4cCI6MTk4NzE1MzUwMn0.PrcZsUvEMlp-Vek4DcYOt0_-arIOXq6P6i3vbfCWV3E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});
