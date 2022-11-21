import { createCookie } from "@remix-run/node";

const supabaseToken = createCookie("sb:token", {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: 604_800,
});

export default supabaseToken;

// Can't get the cookie to work.  I think it's a mix of remix/supabase conflict
// Should use supabase token and store it?  Still need to verify it
