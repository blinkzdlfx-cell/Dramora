import type { Tables } from "@/lib/supabase/database.types";
import { getSupabaseClient } from "@/lib/supabase/client";

export type Project = Tables<"projects">;
export type Conversation = Tables<"conversations">;
export type StudioKind = "ai_video" | "film";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Dramora's Supabase connection is not configured.");
  }
  return client;
}

export async function listProjects(ownerId: string): Promise<Project[]> {
  const { data, error } = await requireClient()
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProject(input: {
  ownerId: string;
  title: string;
  studio: StudioKind;
}): Promise<Project> {
  const { data, error } = await requireClient()
    .from("projects")
    .insert({
      owner_id: input.ownerId,
      title: input.title.trim(),
      studio: input.studio,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listConversations(input: {
  ownerId: string;
  projectId: string;
}): Promise<Conversation[]> {
  const { data, error } = await requireClient()
    .from("conversations")
    .select("*")
    .eq("owner_id", input.ownerId)
    .eq("project_id", input.projectId)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createConversation(input: {
  ownerId: string;
  projectId: string;
}): Promise<Conversation> {
  const { data, error } = await requireClient()
    .from("conversations")
    .insert({
      owner_id: input.ownerId,
      project_id: input.projectId,
      title: "New conversation",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
