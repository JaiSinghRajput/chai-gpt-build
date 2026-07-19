import { listBranches } from '@/features/conversation/actions/branch-actions';
import { loadChatMessages, getDefaultBranchId } from '@/features/ai/actions/chat-store';
import { getConversation } from '@/features/conversation/actions/conversation-actions';
import { ConversationView } from '@/features/conversation/components/conversation-view';
import { notFound } from 'next/navigation';
import React from 'react';

type ConversationPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ branch?: string }>;
};

const page = async ({ params, searchParams }: ConversationPageProps) => {
  const { id } = await params;
  const { branch } = await searchParams;

  try {
    await getConversation(id);
  } catch (error) {
    notFound();
  }

  const branchId = branch ?? (await getDefaultBranchId(id));
  const [initialMessages, branches] = await Promise.all([
    loadChatMessages(id, branchId),
    listBranches(id),
  ]);

  return (
    <ConversationView
      key={`${id}-${branchId}`}
      conversationId={id}
      branchId={branchId}
      branches={branches}
      initialMessages={initialMessages}
    />
  );
};

export default page;