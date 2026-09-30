import { Link } from "react-router-dom";
import { ArrowRight, AudioLines, Languages, NotebookPen } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { ConnectSarvam } from "@/components/sarvam/connect-dialog";
import { useHydrated } from "@/hooks/use-hydrated";
import { useInterviewStore } from "@/lib/interviews/store";
import { roleLabel, type InterviewSession } from "@/lib/interviews/types";

export function LandingPage() {
  const hydrated = useHydrated();
  const sessions = useInterviewStore((s) => s.sessions);
  const ready = useInterviewStore((s) =>
    Boolean(s.sarvam.apiKey && s.sarvam.orgId && s.sarvam.workspaceId && s.sarvam.appId),
  );
  const shownSessions = hydrated ? sessions : [];
  const shownReady = hydrated ? ready : false;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="hero-wash pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />
      <AppHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col px-4 pt-24 pb-16 md:px-8 md:pt-28">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="rise-1 text-[11px] tracking-[0.22em] text-subtle uppercase">
              Knowcraft · Voice interviews
            </p>
            <h1 className="rise-2 font-display max-w-[14ch] text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
              Sit the viva.
            </h1>
            <p className="rise-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Live voice interviews powered by your Sarvam agent — Analyst and Advanced Analyst
              seats for Knowcraft Analytics.
            </p>
            <div className="rise-4 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/setup">
                  Open a room
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <ConnectSarvam>
                <Button variant="outline" size="lg">
                  {shownReady ? "Edit Sarvam agent" : "Connect Sarvam agent"}
                </Button>
              </ConnectSarvam>
            </div>
            <p className="rise-5 text-xs text-subtle">
              {shownReady
                ? "Your Sarvam agent runs the conversation. Viva is the booth and transcript."
                : "Connect your Sarvam Voice Agent to start interviewing."}
            </p>
          </div>
          <div className="rise-3 relative mx-auto grid aspect-square w-full max-w-md place-items-center">
            <div className="orb-ring absolute inset-[8%] rounded-full border border-border" />
            <div className="orb-ring orb-ring-delay absolute inset-[22%] rounded-full border border-border/80" />
            <div className="size-[34%] rounded-full bg-primary/90 shadow-[var(--shadow-border)]" />
            <span className="absolute bottom-[12%] text-[11px] tracking-[0.2em] text-subtle uppercase">
              Live booth
            </span>
          </div>
        </section>

        <section className="mt-20 grid gap-px overflow-hidden rounded-xl shadow-[var(--shadow-border)] md:grid-cols-3">
          {[
            {
              icon: AudioLines,
              title: "Spoken, not typed",
              copy: "Your Sarvam agent talks first. The candidate answers out loud. Turns land in a live transcript.",
            },
            {
              icon: Languages,
              title: "Eleven languages",
              copy: "English plus major Indian languages, including code-mixed speech with Sarvam.",
            },
            {
              icon: NotebookPen,
              title: "Agent variables",
              copy: "CANDIDATE_NAME, JOB_TITLE, COMPANY_NAME and more — matched to your Knowcraft agent.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="bg-card px-5 py-6">
              <Icon className="mb-4 size-4 text-primary" strokeWidth={1.75} />
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="font-display text-3xl tracking-tight">Recent rooms</h2>
            {shownSessions.length > 0 ? (
              <span className="text-xs text-subtle">{shownSessions.length} saved locally</span>
            ) : null}
          </div>
          {shownSessions.length === 0 ? (
            <p className="rounded-xl px-5 py-8 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
              No rooms yet. Your first interview will land here, on this device.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {shownSessions.slice(0, 6).map((sess) => (
                <SessionCard key={sess.id} session={sess} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function SessionCard({ session }: { session: InterviewSession }) {
  const to =
    session.report || session.status === "ended" || session.status === "error"
      ? `/report/${session.id}`
      : `/room/${session.id}`;
  return (
    <li>
      <Link
        to={to}
        className="flex items-start justify-between gap-3 rounded-xl bg-card px-4 py-4 no-underline shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {session.config.candidateName} · {roleLabel(session.config)}
          </p>
          <p className="mt-1 text-xs text-subtle">
            {session.config.interviewType} · {session.config.language} ·{" "}
            {session.config.durationMin} min
          </p>
        </div>
        <Badge tone={session.report ? "live" : "muted"}>
          {session.report ? "Debrief" : session.status === "error" ? "Failed" : "Open"}
        </Badge>
      </Link>
    </li>
  );
}
