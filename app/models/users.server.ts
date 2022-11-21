import type { Profiles } from "@prisma/client";
import { supabase } from "~/db.server";

export function findByEmail(email: string): Profiles {
  return supabase
    .from("Profiles")
    .select(`*`)
    .eq("email", email)
    .limit(1)
    .single();
}
