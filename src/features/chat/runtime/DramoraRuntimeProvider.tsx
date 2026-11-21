import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import {
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type { DramoraMessage, DramoraSend } from "./types";

type DramoraRuntimeProviderProps = {
  conversationId: string;
  initialMessages?: DramoraMessage[];
  sendMessage: DramoraSend;
  children: ReactNode;
};

function toAssistantMessage(message: DramoraMessage): ThreadMessageLike {
  return {
    id: message.id,
    role: message.role,
    content: [{ type: "text", text: message.content }],
  };
}

/**
 * Bridges assistant-ui to Dramora-owned conversation state.
 *
 * The parent must key this provider by conversationId so switching
 * conversations creates a fresh, correctly scoped message store.
 * Persistence, task state, streaming and recovery remain application-owned.
 */
export function DramoraRuntimeProvider({
  conversationId,
  initialMessages = [],
  sendMessage,
  children,
}: DramoraRuntimeProviderProps) {
  const [messages, setMessages] = useState<DramoraMessage[]>(initialMessages);
  const [isRunning, setIsRunning] = useState(false);

  const onNew = useCallback(
    async (message: AppendMessage) => {
      const text = message.content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("\n")
        .trim();

      if (!text) return;

      const userMessage: DramoraMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, userMessage]);
      setIsRunning(true);

      try {
        const assistantMessage = await sendMessage({
          conversationId,
          text,
        });
        if (assistantMessage.role !== "assistant") {
          throw new Error("Dramora send handler must return an assistant message.");
        }
        setMessages((current) => [...current, assistantMessage]);
      } finally {
        setIsRunning(false);
      }
    },
    [conversationId, sendMessage],
  );

  const runtime = useExternalStoreRuntime({
    messages,
    convertMessage: toAssistantMessage,
    onNew,
    isRunning,
    setMessages: (nextMessages) => setMessages([...nextMessages]),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
