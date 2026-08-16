"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessageBubble, type ChatMessage } from "@/components/nova/chat-message";
import { askNova } from "@/lib/nova-assistant";
import { useTasksStore } from "@/lib/store/tasks";
import { useProjectsStore } from "@/lib/store/projects";
import { useGoalsStore, useMilestonesStore } from "@/lib/store/goals";
import { useTransactionsStore } from "@/lib/store/finances";
import { useHabitsStore, useHabitEntriesStore } from "@/lib/store/habits";
import { usePreferencesStore } from "@/lib/store/preferences";

const SUGGESTIONS = [
  "Qu'est-ce que je dois faire aujourd'hui ?",
  "Fais-moi le bilan de ma semaine",
  "Combien ai-je dépensé ce mois-ci ?",
  "Sur quels projets suis-je en retard ?",
  "Quels objectifs ai-je négligés ?",
];

export default function NovaAiPage() {
  const firstName = usePreferencesStore((s) => s.preferences.first_name);
  const tasks = useTasksStore((s) => s.items);
  const addTask = useTasksStore((s) => s.add);
  const projects = useProjectsStore((s) => s.items);
  const goals = useGoalsStore((s) => s.items);
  const milestones = useMilestonesStore((s) => s.items);
  const transactions = useTransactionsStore((s) => s.items);
  const habits = useHabitsStore((s) => s.items);
  const habitEntries = useHabitEntriesStore((s) => s.items);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    const reply = askNova(text, {
      tasks,
      projects,
      goals,
      milestones,
      transactions,
      habits,
      habitEntries,
      addTask: (t) => addTask({ title: t.title, priority: "P2", status: "todo", tags: [], due_date: t.due_date }),
    });
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: reply.text };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:h-[calc(100vh-4rem)]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Nova AI</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Assistant local, connecté à tes données — aucune clé API requise.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-background/50 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Bonjour {firstName}, demande-moi un point sur ta journée, ta semaine ou tes finances.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-foreground/80 hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <ChatMessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <div className="glass shadow-soft flex items-center gap-2 rounded-2xl p-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Écris à Nova… (ex. « ajoute appeler le client pour demain »)"
          className="h-9 border-none bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button size="icon-sm" onClick={() => send(input)} disabled={!input.trim()}>
          <Send className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
