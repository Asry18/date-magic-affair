import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Heart, Calendar, UtensilsCrossed, LogOut, ArrowLeft } from "lucide-react";
import { getResponses } from "@/lib/responses.functions";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/responses")({
  component: ResponsesPage,
});

function ResponsesPage() {
  const queryClient = useQueryClient();
  const fetchResponses = useServerFn(getResponses);

  const { data: responses = [], isLoading } = useQuery({
    queryKey: ["responses"],
    queryFn: () => fetchResponses(),
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to proposal
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white/80"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-center"
        >
          <Heart className="mx-auto h-10 w-10 text-gradient-heart" fill="url(#heart-grad)" />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="heart-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.2 350)" />
                <stop offset="100%" stopColor="oklch(0.5 0.2 310)" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="mt-4 font-display text-3xl font-medium">All Responses</h1>
          <p className="mt-2 text-muted-foreground">Here is every date and meal chosen so far.</p>
        </motion.div>

        {isLoading ? (
          <div className="mt-10 text-center text-muted-foreground">Loading...</div>
        ) : responses.length === 0 ? (
          <div className="mt-10 text-center text-muted-foreground">
            No responses yet. Share the link and come back!
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {responses.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass flex items-center gap-5 rounded-2xl p-5 shadow-card"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--gradient-heart)" }}>
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span className="font-medium text-foreground">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UtensilsCrossed className="h-4 w-4 text-gold" />
                      <span className="font-medium text-foreground">{r.food}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(r.created_at), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
