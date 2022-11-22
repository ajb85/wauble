import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </main>
  );
}
