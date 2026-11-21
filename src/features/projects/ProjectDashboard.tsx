import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  createConversation,
  createProject,
  listConversations,
  listProjects,
  type Conversation,
  type Project,
  type StudioKind,
} from "./projectService";

type ProjectDashboardProps = {
  userId: string;
};

const studioDetails: Record<
  StudioKind,
  { label: string; description: string; accent: string }
> = {
  ai_video: {
    label: "AI Video Studio",
    description: "Video concepts, scripts, scenes, shots and visual production planning.",
    accent: "border-violet-400/20 bg-violet-400/[0.06] text-violet-200",
  },
  film: {
    label: "Film Studio",
    description: "Story development, character work, screenplays and film production planning.",
    accent: "border-amber-300/20 bg-amber-300/[0.06] text-amber-100",
  },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function ErrorNotice({ children }: { children: string }) {
  return (
    <div
      className="rounded-lg border border-red-400/20 bg-red-400/[0.07] p-3 text-sm leading-5 text-red-200"
      role="alert"
    >
      {children}
    </div>
  );
}

export function ProjectDashboard({ userId }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [studio, setStudio] = useState<StudioKind>("ai_video");
  const [creatingProject, setCreatingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      setProjects(await listProjects(userId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your projects could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    if (!selectedProject) {
      setConversations([]);
      setSelectedConversation(null);
      return;
    }

    let active = true;
    setConversationsLoading(true);
    setErrorMessage("");
    setSelectedConversation(null);

    void listConversations({
      ownerId: userId,
      projectId: selectedProject.id,
    })
      .then((items) => {
        if (active) setConversations(items);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Conversations could not be loaded.",
        );
      })
      .finally(() => {
        if (active) setConversationsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProject, userId]);

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = projectTitle.trim();
    if (!title) {
      setErrorMessage("Enter a project title.");
      return;
    }

    setCreatingProject(true);
    setErrorMessage("");

    try {
      const project = await createProject({
        ownerId: userId,
        title,
        studio,
      });
      setProjects((current) => [project, ...current]);
      setProjectTitle("");
      setShowCreateProject(false);
      setSelectedProject(project);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "The project could not be created.",
      );
    } finally {
      setCreatingProject(false);
    }
  }

  async function handleCreateConversation() {
    if (!selectedProject) return;

    setCreatingConversation(true);
    setErrorMessage("");

    try {
      const conversation = await createConversation({
        ownerId: userId,
        projectId: selectedProject.id,
      });
      setConversations((current) => [conversation, ...current]);
      setSelectedConversation(conversation);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The conversation could not be created.",
      );
    } finally {
      setCreatingConversation(false);
    }
  }

  function returnToProjects() {
    setSelectedProject(null);
    setSelectedConversation(null);
    setErrorMessage("");
  }

  if (selectedProject) {
    const details = studioDetails[selectedProject.studio as StudioKind];

    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <button
          className="mb-8 text-sm text-zinc-500 transition hover:text-white"
          onClick={returnToProjects}
          type="button"
        >
          ← All projects
        </button>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${details.accent}`}>
              {details.label}
            </span>
            <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {selectedProject.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Project created {formatDate(selectedProject.created_at)}
            </p>
          </div>
          <Button
            disabled={creatingConversation}
            onClick={() => void handleCreateConversation()}
            size="lg"
          >
            {creatingConversation ? "Creating..." : "New conversation"}
          </Button>
        </div>

        {errorMessage && <div className="mt-7"><ErrorNotice>{errorMessage}</ErrorNotice></div>}

        {selectedConversation ? (
          <Card className="mt-10 border-white/10 bg-white/[0.025]">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
                Conversation created
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {selectedConversation.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                This conversation is now saved to this project. The chat
                composer, assistant execution and message streaming are the
                next implementation step.
              </p>
            </CardHeader>
            <CardFooter className="justify-between">
              <span className="text-xs text-zinc-600">
                Conversation ID: {selectedConversation.id}
              </span>
              <Button
                onClick={() => setSelectedConversation(null)}
                variant="outline"
              >
                Back to conversations
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <section aria-labelledby="conversations-heading" className="mt-12">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Project workspace
              </p>
              <h2
                id="conversations-heading"
                className="mt-2 text-xl font-semibold text-white"
              >
                Conversations
              </h2>
            </div>

            {conversationsLoading ? (
              <p className="py-10 text-sm text-zinc-500">
                Loading conversations...
              </p>
            ) : conversations.length === 0 ? (
              <Card className="border-dashed border-white/15 bg-transparent">
                <CardContent className="py-12 text-center">
                  <p className="text-base font-medium text-white">
                    No conversations yet
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Start a conversation to develop an idea, work through a
                    screenplay or prepare production materials.
                  </p>
                  <Button
                    className="mt-6"
                    disabled={creatingConversation}
                    onClick={() => void handleCreateConversation()}
                  >
                    Create first conversation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {conversations.map((conversation) => (
                  <button
                    className="text-left"
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    type="button"
                  >
                    <Card className="transition hover:border-white/20 hover:bg-white/[0.045]">
                      <CardContent className="flex items-center justify-between gap-4 py-5">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {conversation.title}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Created {formatDate(conversation.created_at)}
                          </p>
                        </div>
                        <span aria-hidden="true" className="text-zinc-500">
                          →
                        </span>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Your creative workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your projects
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Keep each production organised, with its own conversations,
            creative documents and project context.
          </p>
        </div>
        <Button
          onClick={() => {
            setErrorMessage("");
            setShowCreateProject((visible) => !visible);
          }}
          size="lg"
        >
          {showCreateProject ? "Close" : "Create project"}
        </Button>
      </div>

      {errorMessage && <div className="mt-7"><ErrorNotice>{errorMessage}</ErrorNotice></div>}

      {showCreateProject && (
        <Card className="mt-8 border-violet-400/20 bg-violet-400/[0.035]">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">
              Create a project
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Choose the studio that matches the work you want to develop.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleCreateProject}>
              <label className="block text-sm text-zinc-300">
                Project title
                <input
                  autoFocus
                  className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15"
                  maxLength={160}
                  onChange={(event) => setProjectTitle(event.target.value)}
                  placeholder="Give your project a title"
                  required
                  value={projectTitle}
                />
              </label>

              <fieldset>
                <legend className="mb-3 text-sm text-zinc-300">
                  Select a studio
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(studioDetails) as StudioKind[]).map((kind) => {
                    const detail = studioDetails[kind];
                    const selected = studio === kind;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`rounded-xl border p-4 text-left transition ${selected ? "border-violet-300/50 bg-violet-300/[0.08]" : "border-white/10 bg-black/20 hover:border-white/20"}`}
                        key={kind}
                        onClick={() => setStudio(kind)}
                        type="button"
                      >
                        <span className="block font-medium text-white">
                          {detail.label}
                        </span>
                        <span className="mt-2 block text-xs leading-5 text-zinc-500">
                          {detail.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  onClick={() => setShowCreateProject(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={creatingProject} type="submit">
                  {creatingProject ? "Creating project..." : "Create project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="projects-heading" className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="projects-heading" className="text-lg font-semibold text-white">
            All active projects
          </h2>
          <span className="text-xs text-zinc-600">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {loading ? (
          <p className="py-12 text-sm text-zinc-500">Loading your projects...</p>
        ) : projects.length === 0 ? (
          <Card className="border-dashed border-white/15 bg-transparent">
            <CardContent className="py-14 text-center">
              <p className="text-base font-medium text-white">
                Your project space is empty
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Create your first AI Video or Film project. Each project will
                keep its conversations and production work organised.
              </p>
              <Button
                className="mt-6"
                onClick={() => setShowCreateProject(true)}
              >
                Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const details = studioDetails[project.studio as StudioKind];
              return (
                <button
                  className="text-left"
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  type="button"
                >
                  <Card className="group h-full transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]">
                    <CardHeader>
                      <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${details.accent}`}>
                        {details.label}
                      </span>
                      <h3 className="mt-4 break-words text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-500">
                        Updated {formatDate(project.updated_at)}
                      </p>
                    </CardHeader>
                    <CardFooter className="mt-5 justify-between">
                      <span className="text-xs text-zinc-500">
                        Open project
                      </span>
                      <span className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>
                    </CardFooter>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
