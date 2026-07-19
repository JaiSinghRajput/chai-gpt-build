"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GitBranchIcon, CopyIcon, CheckIcon } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";
import { createBranch } from "@/features/conversation/actions/branch-actions";

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
  conversationId: string;
};

/**
 * Renders the conversation message list with markdown responses and a loading indicator.
 */
export function ChatMessages({ messages, status, conversationId }: ChatMessagesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [branchingId, setBranchingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(messageId: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const isWaiting =
    status === "submitted" && messages.at(-1)?.role === "user";

  function handleBranchFromHere(messageId: string) {
    setBranchingId(messageId);
    startTransition(async () => {
      try {
        const branch = await createBranch(conversationId, messageId);
        router.push(`/c/${conversationId}?branch=${branch.id}`, { scroll: false });
      } finally {
        setBranchingId(null);
      }
    });
  }

  return (
    <Conversation>
      <ConversationContent className="py-8">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              <MessageResponse>{getMessageText(message)}</MessageResponse>
            </MessageContent>

        <MessageActions className="">
              {message.role === "assistant" && (
                <MessageAction
                  tooltip="Branch from here"
                  label="Branch from here"
                  disabled={isPending && branchingId === message.id}
                  onClick={() => handleBranchFromHere(message.id)}
                  className="cursor-pointer"
                >
                  <GitBranchIcon className="size-3.5" />
                </MessageAction>
              )}
              {message.role === "assistant" &&(
                <MessageAction
                tooltip={copiedId === message.id ? "Copied" : "Copy"}
                label="Copy message"
                onClick={() => handleCopy(message.id, getMessageText(message))}
                className="cursor-pointer"
              >
                {copiedId === message.id ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <CopyIcon className="size-3.5" />
                )}
              </MessageAction>
              )}
            </MessageActions>
          </Message>
        ))}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}