import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        await router.navigate({ to: "/responses" });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        await router.navigate({ to: "/responses" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        await router.navigate({ to: "/responses" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-glow"
      >
        <div className="mb-6 flex items-center justify-center">
          <Heart className="h-10 w-10 text-gradient-heart" fill="url(#heart-grad)" />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="heart-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.2 350)" />
                <stop offset="100%" stopColor="oklch(0.5 0.2 310)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-center font-display text-2xl font-medium">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to view all responses"
            : "Sign up to access your dashboard"}
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-white/50 py-3 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-white/50 py-3 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-display text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--gradient-heart)" }}
          >
            {loading ? (
              "Loading..."
            ) : mode === "signin" ? (
              <>
                Sign in <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Sign up <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background/80 px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/60 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white/80 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 text-gold" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to proposal
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
