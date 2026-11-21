export type DramoraMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type DramoraSendInput = {
  conversationId: string;
  text: string;
};

export type DramoraSend = (
  input: DramoraSendInput,
) => Promise<DramoraMessage>;
