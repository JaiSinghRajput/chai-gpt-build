"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    createConversation,
    deleteConversation,
    listConversations,
    updateConversation,
} from "@/features/conversation/actions/conversation-actions";
import { queryKeys } from "../utils/query-keys";
import { createBranch, deleteBranch, listBranches, renameBranch } from "@/features/conversation/actions/branch-actions";
import type { BranchListItem } from "@/features/conversation/actions/branch-actions";


/**
 * Fetches all conversations for the sidebar via React Query.
 */
export function useConversations() {
    return useQuery({
        queryKey: queryKeys.conversations.all,
        queryFn: () => listConversations(),
        staleTime: 30_000,
    });
}

/**
 * Mutation hook to create a new conversation and navigate to it.
 */
export function useCreateConversation() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (title?: string) => createConversation(title),
        onSuccess: (conversation) => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.conversations.all,
            });
            router.push(`/c/${conversation.id}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not create chat");
        },
    });
}

/** Rename / pin / archive a conversation. */
export function useUpdateConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            ...data
        }: {
            id: string;
            title?: string;
            isPinned?: boolean;
            isArchived?: boolean;
        }) => updateConversation(id, data),
        onSuccess: (conversation) => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.conversations.all,
            });
            void queryClient.invalidateQueries({
                queryKey: queryKeys.conversations.detail(conversation.id),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not update chat");
        },
    });
}

/** Delete a conversation and leave the page if you were viewing it. */
export function useDeleteConversation(activeId?: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (id: string) => deleteConversation(id),
        onSuccess: ({ id }) => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.conversations.all,
            });
            queryClient.removeQueries({
                queryKey: queryKeys.messages.byConversation(id),
            });

            if (activeId === id) {
                router.push("/");
            }

            toast.success("Chat deleted");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not delete chat");
        },
    });
}

/** Fetches branches for a conversation. Only enabled once the caller wants them. */
export function useBranches(conversationId: string, enabled: boolean) {
    return useQuery<BranchListItem[]>({
        queryKey: queryKeys.branches.byConversation(conversationId),
        queryFn: () => listBranches(conversationId),
        enabled,
        staleTime: 30_000,
    });
}

/** Forks a new branch from a message and navigates to it. */
export function useCreateBranch(conversationId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (fromMessageId: string) => createBranch(conversationId, fromMessageId),
        onSuccess: (branch) => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.branches.byConversation(conversationId),
            });
            void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
            router.push(`/c/${conversationId}?branch=${branch.id}`, { scroll: false });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not create branch");
        },
    });
}

/** Renames a branch. */
export function useRenameBranch(conversationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ branchId, name }: { branchId: string; name: string }) =>
            renameBranch(branchId, name),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.branches.byConversation(conversationId),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not rename branch");
        },
    });
}

/** Deletes a branch (soft delete). */
export function useDeleteBranch(conversationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (branchId: string) => deleteBranch(branchId),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.branches.byConversation(conversationId),
            });
            void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
            toast.success("Branch deleted");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Could not delete branch");
        },
    });
}