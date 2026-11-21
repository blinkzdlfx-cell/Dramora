import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AuthScreen } from "@/features/auth/AuthScreen";
import { useAuth } from "@/features/auth/AuthProvider";
import { ProjectDashboard } from "@/features/projects/ProjectDashboard";

type StudioCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  accent: "violet" | "amber";
};

type AuthEntryMode = "sign-in" | "sign-up" | null;

function StudioCard({
  eyebrow,
  title,
  description,
  detail,
  accent,
}: StudioCardProps) {
  const accentClass =
    accent === "violet"
      ? "border-violet-400/20 bg-violet-400/[0.06] text-violet-200"
      : "border-amber-300/20 bg-amber-300/[0.06] text-amber-100";

  return (
    <Card className="group flex min-h-72 flex-col justify-between transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
      <CardHeader>
        <div className={`mb-7 inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${accentClass}`}>
          {eyebrow}
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </CardHeader>
      <CardFooter className="mt-8 justify-between">
        <span className="text-xs text-zinc-500">{detail}</span>
        <span
          aria-hidden="true"
          className="text-lg text-zinc-400 transition group-hover:translate-x-1 group-hover:text-white"
        >
          →
        </span>
      </CardFooter>
    </Card>
  );
}

function AppHeader({
  email,
  loading,
  onSignIn,
  onSignUp,
  onSignOut,
}: {
  email?: string;
  loading: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-3 sm:px-8">
      <a
        href="/"
        className="flex shrink-0 items-center gap-3"
        aria-label="Dramora home"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-zinc-950">
          D
        </span>
        <span className="text-sm font-semibold tracking-[0.18em] text-white">
          DRAMORA
        </span>
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        {loading ? (
          <span className="text-xs text-zinc-500">Checking session...</span>
        ) : email ? (
          <>
            <span className="hidden max-w-48 truncate text-xs text-zinc-400 sm:inline">
              {email}
            </span>
            <Button onClick={onSignOut} size="sm" variant="outline">
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onSignIn} size="sm" variant="ghost">
              Sign in
            </Button>
            <Button onClick={onSignUp} size="sm">
              Create account
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

function App() {
  const { configured, loading, user, signOut } = useAuth();
  const [authMode, setAuthMode] = useState<AuthEntryMode>(null);
  const [accountError, setAccountError] = useState("");

  if (authMode) {
    return <AuthScreen onBack={() => setAuthMode(null)} />;
  }

  function handleSignOut() {
    setAccountError("");
    void signOut().catch((error: unknown) => {
      setAccountError(
        error instanceof Error
          ? error.message
          : "Sign out could not be completed.",
      );
    });
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <AppHeader
        email={user?.email}
        loading={loading}
        onSignIn={() => setAuthMode("sign-in")}
        onSignUp={() => setAuthMode("sign-up")}
        onSignOut={handleSignOut}
      />

      {user ? (
        <>
          {accountError && (
            <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
              <div
                className="rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-sm text-red-200"
                role="alert"
              >
                {accountError}
              </div>
            </div>
          )}
          <ProjectDashboard userId={user.id} />
        </>
      ) : (
        <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              Your creative workspace
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              From the first idea
              <span className="block text-zinc-500">
                to a production-ready plan.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Develop stories, shape screenplays and prepare visual production
              workflows in one organised creative space.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setAuthMode("sign-up")} size="lg">
                Create your account
              </Button>
              <Button
                onClick={() => setAuthMode("sign-in")}
                size="lg"
                variant="outline"
              >
                Sign in
              </Button>
            </div>
          </div>

          <section aria-labelledby="studios-heading" className="mt-16">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Choose your workspace
                </p>
                <h2
                  id="studios-heading"
                  className="mt-2 text-xl font-semibold text-white"
                >
                  Two studios. One creative process.
                </h2>
              </div>
              <span className="hidden text-xs text-zinc-600 sm:inline">
                Release 1 foundation
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <StudioCard
                eyebrow="AI Video Studio"
                title="Plan the video. Prepare the production."
                description="Develop concepts, scripts, scenes, shots, visual references and platform-ready prompts for external video-generation tools."
                detail="Video concepts · Scenes · Shots · Prompts"
                accent="violet"
              />
              <StudioCard
                eyebrow="Film Studio"
                title="Build the story. Develop the screenplay."
                description="Develop characters and worlds, write and revise screenplays, organise story documents and prepare production materials."
                detail="Story development · Screenplays · Production"
                accent="amber"
              />
            </div>
          </section>

          {!configured && (
            <p className="mt-8 text-xs leading-5 text-amber-200/80">
              Account services are being connected. Authentication will be
              available after the deployment environment is configured.
            </p>
          )}

          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Dramora is a planning and creative-production workspace.</span>
            <span>
              Media generation and editing take place on external platforms.
            </span>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
