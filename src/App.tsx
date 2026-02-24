import { useState, useEffect } from "react";
import { PollProvider } from "@/context/PollContext";
import { PollPage } from "@/pages/PollPage";
import { AdminPage } from "@/pages/AdminPage";
import { AdminGraphPage } from "@/pages/AdminGraphPage";

function getRoute(): string {
  const hash = window.location.hash.replace("#", "") || "/poll";
  if (hash.startsWith("/admin/graph")) return "admin-graph";
  if (hash.startsWith("/admin")) return "admin";
  return "poll";
}

function Router() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  switch (route) {
    case "admin-graph":
      return <AdminGraphPage />;
    case "admin":
      return <AdminPage />;
    default:
      return <PollPage />;
  }
}

export function App() {
  return (
    <PollProvider>
      <Router />
    </PollProvider>
  );
}
