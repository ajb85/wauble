import type { Profiles } from "@prisma/client";
import { supabase } from "~/db.server";

export async function findByEmail(email: string): Profiles {
  const { data } = await supabase
    .from("Profiles")
    .select(`*`)
    .eq("email", email)
    .limit(1)
    .single();

  return data;
}
