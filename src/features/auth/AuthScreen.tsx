import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

type AuthMode = "sign-in" | "sign-up" | "reset" | "update-password";

type AuthScreenProps = {
  onBack: () => void;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15";

export function AuthScreen({ onBack }: AuthScreenProps) {
  const { configured, isPasswordRecovery } = useAuth();
  const [mode, setMode] = useState<AuthMode>(
    isPasswordRecovery ? "update-password" : "sign-in",
  );
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isPasswordRecovery) setMode("update-password");
  }, [isPasswordRecovery]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMessage(
        "Authentication is not configured yet. Add the Dramora Supabase URL and publishable key to the local environment.",
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (mode === "update-password" && password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    if (
      (mode === "sign-in" || mode === "sign-up" || mode === "update-password") &&
      password.length < 8
    ) {
      setErrorMessage("Use a password with at least 8 characters.");
      return;
    }

    setBusy(true);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
      } else if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: displayName.trim()
              ? { display_name: displayName.trim() }
              : {},
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        if (!data.session) {
          setSuccessMessage(
            "Your account request was received. Check your email for the confirmation link before signing in.",
          );
        }
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo: `${window.location.origin}/?auth=recovery`,
          },
        );
        if (error) throw error;
        setSuccessMessage(
          "If an account exists for that address, a password-reset email will be sent.",
        );
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        window.history.replaceState({}, document.title, window.location.pathname);
        setSuccessMessage("Your password has been updated.");
        setMode("sign-in");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The authentication request could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }

  const isPasswordMode =
    mode === "sign-in" || mode === "sign-up" || mode === "update-password";

  const title =
    mode === "sign-in"
      ? "Welcome back"
      : mode === "sign-up"
        ? "Create your account"
        : mode === "reset"
          ? "Reset your password"
          : "Choose a new password";

  const description =
    mode === "sign-in"
      ? "Sign in to continue to your Dramora workspace."
      : mode === "sign-up"
        ? "Create an account to start organising your creative projects."
        : mode === "reset"
          ? "Enter your account email and we will send a reset link if it exists."
          : "Set a new password for your Dramora account.";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center px-5 py-12">
      <Card className="w-full border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/30">
        <CardHeader>
          <button
            className="mb-7 w-fit text-xs text-zinc-500 transition hover:text-white"
            onClick={onBack}
            type="button"
          >
            ← Back to Dramora
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Dramora account
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </CardHeader>

        <CardContent>
          {!configured && (
            <div className="mb-5 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-100">
              Supabase environment variables are not configured. The form is
              available for UI review, but authentication requests are disabled.
            </div>
          )}

          {errorMessage && (
            <div
              className="mb-5 rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-sm leading-5 text-red-200"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="mb-5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] p-3 text-sm leading-5 text-emerald-200"
              role="status"
            >
              {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" && (
              <label className="block text-sm text-zinc-300">
                Display name <span className="text-zinc-600">(optional)</span>
                <input
                  autoComplete="name"
                  className={inputClassName}
                  maxLength={80}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  value={displayName}
                />
              </label>
            )}

            {mode !== "update-password" && (
              <label className="block text-sm text-zinc-300">
                Email address
                <input
                  autoComplete="email"
                  className={inputClassName}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </label>
            )}

            {isPasswordMode && (
              <label className="block text-sm text-zinc-300">
                {mode === "update-password" ? "New password" : "Password"}
                <input
                  autoComplete={
                    mode === "sign-in"
                      ? "current-password"
                      : "new-password"
                  }
                  className={inputClassName}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
            )}

            {mode === "update-password" && (
              <label className="block text-sm text-zinc-300">
                Confirm new password
                <input
                  autoComplete="new-password"
                  className={inputClassName}
                  minLength={8}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  type="password"
                  value={confirmPassword}
                />
              </label>
            )}

            <Button
              className="w-full"
              disabled={busy || !configured}
              size="lg"
              type="submit"
            >
              {busy
                ? "Please wait..."
                : mode === "sign-in"
                  ? "Sign in"
                  : mode === "sign-up"
                    ? "Create account"
                    : mode === "reset"
                      ? "Send reset link"
                      : "Update password"}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            {mode === "sign-in" && (
              <>
                <button
                  className="text-zinc-400 hover:text-white"
                  onClick={() => changeMode("sign-up")}
                  type="button"
                >
                  Create an account
                </button>
                <button
                  className="text-zinc-500 hover:text-white"
                  onClick={() => changeMode("reset")}
                  type="button"
                >
                  Forgot password?
                </button>
              </>
            )}
            {mode === "sign-up" && (
              <button
                className="text-zinc-400 hover:text-white"
                onClick={() => changeMode("sign-in")}
                type="button"
              >
                Already have an account? Sign in
              </button>
            )}
            {mode === "reset" && (
              <button
                className="text-zinc-400 hover:text-white"
                onClick={() => changeMode("sign-in")}
                type="button"
              >
                Return to sign in
              </button>
            )}
            {mode === "update-password" && (
              <button
                className="text-zinc-400 hover:text-white"
                onClick={() => changeMode("sign-in")}
                type="button"
              >
                Return to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
