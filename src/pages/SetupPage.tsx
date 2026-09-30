import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/input";
import { ConnectSarvam } from "@/components/sarvam/connect-dialog";
import { useInterviewStore } from "@/lib/interviews/store";
import {
  DURATIONS,
  INTERVIEW_TYPES,
  LANGUAGES,
  TRACKS,
  type InterviewType,
  type JobTitle,
} from "@/lib/interviews/types";
import { cn } from "@/lib/utils";

export function SetupPage() {
  const navigate = useNavigate();
  const draft = useInterviewStore((s) => s.draft);
  const setDraft = useInterviewStore((s) => s.setDraft);
  const createSession = useInterviewStore((s) => s.createSession);
  const ready = useInterviewStore((s) =>
    Boolean(s.sarvam.apiKey && s.sarvam.orgId && s.sarvam.workspaceId && s.sarvam.appId),
  );
  const [busy, setBusy] = useState(false);

  const enter = () => {
    if (!ready) {
      toast.error("Connect your Sarvam agent first.");
      return;
    }
    if (!draft.candidateName.trim()) {
      toast.error("Candidate name is required.");
      return;
    }
    setBusy(true);
    const session = createSession();
    navigate(`/room/${session.id}`);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader solid />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_18rem]">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-subtle uppercase">Briefing</p>
          <h1 className="font-display mt-2 text-4xl tracking-tight md:text-5xl">Who is sitting.</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            These fields are sent to your Sarvam agent as variables (
            <code className="text-xs">CANDIDATE_NAME</code>,{" "}
            <code className="text-xs">JOB_TITLE</code>, etc.).
          </p>

          <form
            className="mt-8 flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              enter();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Candidate name → CANDIDATE_NAME">
                <Input
                  value={draft.candidateName ?? ""}
                  placeholder="Zeelsh"
                  onChange={(e) => setDraft({ candidateName: e.target.value })}
                />
              </Field>
              <Field label="Company → COMPANY_NAME">
                <Input
                  value={draft.companyName ?? ""}
                  placeholder="Knowcraft Analytics"
                  onChange={(e) => setDraft({ companyName: e.target.value })}
                />
              </Field>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Job title → JOB_TITLE
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TRACKS.map((track) => {
                  const on = draft.jobTitle === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setDraft({ jobTitle: track.id as JobTitle })}
                      className={cn(
                        "rounded-lg px-3 py-3 text-left text-sm transition-[background-color,box-shadow] duration-150",
                        on
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
                      )}
                    >
                      {track.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Interview type → INTERVIEW_TYPE">
                <NativeSelect
                  value={draft.interviewType}
                  onChange={(e) =>
                    setDraft({ interviewType: e.target.value as InterviewType })
                  }
                >
                  {INTERVIEW_TYPES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Language">
                <NativeSelect
                  value={draft.language}
                  onChange={(e) =>
                    setDraft({ language: e.target.value as typeof draft.language })
                  }
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Interviewer name → user_name">
                <Input
                  value={draft.userName ?? ""}
                  placeholder="Manan"
                  onChange={(e) => setDraft({ userName: e.target.value })}
                />
              </Field>
              <Field label="Support contact → SUPPORT_CONTACT">
                <Input
                  value={draft.supportContact ?? ""}
                  placeholder="talent@knowcraft.in"
                  onChange={(e) => setDraft({ supportContact: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Length">
                <NativeSelect
                  value={String(draft.durationMin)}
                  onChange={(e) => setDraft({ durationMin: Number(e.target.value) })}
                >
                  {DURATIONS.map((item) => (
                    <option key={item.minutes} value={item.minutes}>
                      {item.label} · {item.hint}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <div />
            </div>

            <Field label="Focus notes (optional, local only)">
              <Textarea
                rows={3}
                placeholder="Anything the panel should emphasise…"
                value={draft.focus ?? ""}
                onChange={(e) => setDraft({ focus: e.target.value })}
              />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button" size="lg" disabled={busy || !ready} onClick={enter}>
                Start interview
              </Button>
              {!ready ? (
                <ConnectSarvam>
                  <Button type="button" variant="outline" size="lg">
                    Connect Sarvam agent
                  </Button>
                </ConnectSarvam>
              ) : null}
            </div>
          </form>
        </div>

        <aside className="flex flex-col gap-4 lg:pt-16">
          <Card className="p-5">
            <p className="text-[11px] tracking-[0.18em] text-subtle uppercase">Agent variables</p>
            <ul className="mt-3 space-y-2 font-mono text-[11px] text-muted-foreground">
              <li>CANDIDATE_NAME</li>
              <li>COMPANY_NAME</li>
              <li>INTERVIEW_TYPE</li>
              <li>JOB_TITLE</li>
              <li>SUPPORT_CONTACT</li>
              <li>user_name</li>
              <li className="text-subtle">call_summary (extracted)</li>
            </ul>
            <div className="mt-4">
              <ConnectSarvam>
                <Button variant="outline" size="sm">
                  {ready ? "Change agent" : "Connect Sarvam"}
                </Button>
              </ConnectSarvam>
            </div>
          </Card>
          <p className="text-xs leading-relaxed text-subtle">
            Allow the microphone when asked. Prefer headphones.
          </p>
        </aside>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
