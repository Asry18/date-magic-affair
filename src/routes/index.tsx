import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Calendar as CalendarIcon, Pizza, Coffee, Cake, Soup, Fish } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useServerFn } from "@tanstack/react-start";
import { saveResponse } from "@/lib/responses.functions";

export const Route = createFileRoute("/")({
  component: ProposalPage,
});

type Step = "ask" | "date" | "food" | "done";


const foods = [
  { name: "Pizza", note: "Classic & cheesy", icon: Pizza },
  { name: "Pasta", note: "Lady & the Tramp vibes", icon: Soup },
  { name: "Sushi", note: "Elegant rolls", icon: Fish },
  { name: "Dessert", note: "Sweet for my sweet", icon: Cake },
  { name: "Coffee", note: "Just to talk forever", icon: Coffee },
];

function Sparkle({ delay = 0, x = "50%", y = "50%" }: { delay?: number; x?: string; y?: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
    >
      <Sparkles className="h-4 w-4 text-gold" />
    </motion.div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i * 0.6) % 6;
        const duration = 8 + (i % 5);
        const size = 12 + (i % 4) * 6;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${left}%`, bottom: -40 }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -1000, opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
          >
            <Heart
              className="text-primary/40"
              style={{ width: size, height: size, filter: "drop-shadow(0 0 8px oklch(0.75 0.18 340 / 0.6))" }}
              fill="currentColor"
            />
          </motion.div>
        );
      })}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sparkle key={`s-${i}`} delay={i * 0.4} x={`${(i * 53) % 100}%`} y={`${(i * 31) % 100}%`} />
      ))}
    </div>
  );
}

function RunawayNoButton({ onYes }: { onYes: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  const labels = ["No", "Are you sure?", "Really sure?", "Think again 💭", "Last chance!", "Please? 🥺", "Pretty please?", "💔"];
  const label = labels[Math.min(dodges, labels.length - 1)];

  const dodge = () => {
    const max = 220;
    const x = (Math.random() - 0.5) * 2 * max;
    const y = (Math.random() - 0.5) * 2 * (max * 0.6);
    setPos({ x, y });
    setDodges((d) => d + 1);
  };

  return (
    <motion.button
      ref={ref}
      onMouseEnter={dodge}
      onFocus={dodge}
      onTouchStart={dodge}
      onClick={dodge}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="rounded-full border border-border bg-white/60 px-8 py-4 font-display text-xl text-foreground shadow-card backdrop-blur-md transition-colors hover:bg-white/80"
    >
      {label}
    </motion.button>
  );
}

function AskStep({ next }: { next: () => void }) {
  return (
    <motion.section
      key="ask"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <FloatingHearts />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2, duration: 1.2 }}
        className="relative mb-8"
      >
        <Heart className="h-20 w-20 animate-heartbeat text-gradient-heart" fill="url(#heart-grad)" />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="heart-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.75 0.2 350)" />
              <stop offset="100%" stopColor="oklch(0.5 0.2 310)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-script text-3xl text-gradient-gold sm:text-4xl"
      >
        Hi Fazna_Faws,
      </motion.p>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="mt-4 max-w-3xl font-display text-5xl font-medium leading-tight text-foreground sm:text-7xl md:text-8xl"
      >
        Will you go on a <span className="font-script text-gradient-heart">DATE</span> with me?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg"
      >
        Tap "Yes" — the other one is a little shy.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative mt-12 flex flex-wrap items-center justify-center gap-6"
      >
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="relative rounded-full px-12 py-5 font-display text-2xl font-medium text-primary-foreground shadow-glow"
          style={{ background: "var(--gradient-heart)" }}
        >
          <span className="relative z-10">Yes 💖</span>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--gradient-gold)" }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
        <RunawayNoButton onYes={next} />
      </motion.div>
    </motion.section>
  );
}

function DateStep({ next, setDate }: { next: () => void; setDate: (d: string) => void }) {
  const [selected, setSelected] = useState<Date | undefined>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSelect = (d: Date | undefined) => {
    if (!d) return;
    setSelected(d);
    setDate(format(d, "EEEE, MMM d, yyyy"));
    setTimeout(next, 800);
  };

  return (
    <motion.section
      key="date"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      <FloatingHearts />
      <CalendarIcon className="mb-4 h-10 w-10 text-gold animate-float" />
      <p className="font-script text-3xl text-gradient-gold">yay! now…</p>
      <h2 className="mt-2 text-center font-display text-4xl font-medium sm:text-6xl">
        Pick a <span className="text-gradient-heart">day</span>
      </h2>
      <p className="mt-3 text-center text-muted-foreground">
        Any future day — I'm already counting down.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass relative mt-10 rounded-3xl p-4 shadow-glow sm:p-8"
      >
        <div className="pointer-events-none absolute -right-3 -top-3">
          <Sparkles className="h-6 w-6 text-gold animate-sparkle" />
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={{ before: new Date(today.getTime() + 86400000) }}
          initialFocus
          className="pointer-events-auto [--cell-size:2.75rem]"
        />
        {selected && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center font-script text-2xl text-gradient-heart"
          >
            {format(selected, "EEEE, MMM d")} 💖
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
}

function FoodStep({ next, setFood }: { next: () => void; setFood: (f: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <motion.section
      key="food"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      <FloatingHearts />
      <p className="font-script text-3xl text-gradient-gold">and to eat…</p>
      <h2 className="mt-2 text-center font-display text-4xl font-medium sm:text-6xl">
        What sounds <span className="text-gradient-heart">delicious</span>?
      </h2>

      <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {foods.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.name}
              onClick={() => {
                setSelected(i);
                setFood(f.name);
                setTimeout(next, 700);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`glass group relative flex flex-col items-center gap-3 rounded-3xl p-6 transition-all ${
                selected === i ? "shadow-glow ring-2 ring-primary" : ""
              }`}
            >
              <motion.div
                className="grid h-16 w-16 place-items-center rounded-full shadow-gold"
                style={{ background: "var(--gradient-gold)" }}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <div className="font-display text-xl font-medium">{f.name}</div>
              <div className="text-center text-xs text-muted-foreground">{f.note}</div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

function DoneStep({ date, food }: { date: string; food: string }) {
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;

    const submit = async () => {
      try {
        await saveResponse({
          data: {
            date,
            food,
          },
        });

        console.log("Response saved!");
      } catch (err) {
        console.error("Failed to save response:", err);
      }
    };

    submit();
  }, [date, food]);
  return (
    <motion.section
      key="done"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
    >
      <FloatingHearts />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mb-8"
      >
        <div className="relative">
          <Heart className="h-28 w-28 text-primary" fill="currentColor" style={{ filter: "drop-shadow(0 0 30px oklch(0.7 0.2 340 / 0.7))" }} />
          <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-gold animate-sparkle" />
        </div>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-script text-4xl text-gradient-gold sm:text-5xl"
      >
        thank you
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 max-w-3xl font-display text-5xl font-medium leading-tight sm:text-7xl"
      >
        for saying <span className="text-gradient-heart">yes</span>.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass mt-12 w-full max-w-xl rounded-3xl p-8"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">our plan</p>
        <div className="mt-6 grid grid-cols-2 gap-6 text-left">
          <div>
            <div className="font-script text-xl text-gradient-gold">when</div>
            <div className="mt-1 font-display text-2xl">{date}</div>
          </div>
          <div>
            <div className="font-script text-xl text-gradient-gold">what</div>
            <div className="mt-1 font-display text-2xl">{food}</div>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 max-w-xl font-display text-xl italic leading-relaxed text-foreground/80 sm:text-2xl"
      >
        "Every love story is beautiful, but ours is my favorite. I can't wait to make another memory with you."
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-6 font-script text-3xl text-gradient-heart"
      >
        — yours, always
      </motion.p>
    </motion.section>
  );
}

function ProposalPage() {
  const [step, setStep] = useState<Step>("ask");
  const [date, setDate] = useState("");
  const [food, setFood] = useState("");
  const save = useServerFn(saveResponse);

  useEffect(() => {
    document.querySelector('[data-lovable-blank-page-placeholder]')?.remove();
  }, []);

  const goToDone = async () => {
    if (date && food) {
      try {
        await save({ data: { date, food } });
      } catch {
        // silently ignore — the confirmation screen still shows
      }
    }
    setStep("done");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-soft/30 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <AnimatePresence mode="wait">
        {step === "ask" && <AskStep key="ask" next={() => setStep("date")} />}
        {step === "date" && <DateStep key="date" next={() => setStep("food")} setDate={setDate} />}
        {step === "food" && <FoodStep key="food" next={goToDone} setFood={setFood} />}
        {step === "done" && <DoneStep key="done" date={date} food={food} />}
      </AnimatePresence>
    </main>
  );
}
