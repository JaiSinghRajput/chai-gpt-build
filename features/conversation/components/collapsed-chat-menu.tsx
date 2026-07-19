"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ChevronRightIcon,
    MessageSquareIcon,
    SearchIcon,
    PinIcon,
} from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useBranches, useConversations } from "../hooks/use-conversation";

type Conversation = NonNullable<
    ReturnType<typeof useConversations>["data"]
>[number];

function PopupChatItem({
    conversation,
    activeId,
}: {
    conversation: Conversation;
    activeId?: string;
}) {
    const [expanded, setExpanded] = useState(false);

    const hasBranches = conversation.branchCount > 1;

    const { data: branches } =
        useBranches(conversation.id, expanded && hasBranches);
    return (
        <div className="group">
            <div className="flex items-center rounded-xl hover:bg-accent">

                {hasBranches && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="ml-2 flex size-6 items-center justify-center rounded-md hover:bg-muted"
                    >
                        <ChevronRightIcon
                            className={cn(
                                "size-4 transition-transform",
                                expanded && "rotate-90"
                            )}
                        />
                    </button>
                )}

                {!hasBranches && (
                    <div className="ml-2 w-6" />
                )}

                <Link
                    href={`/c/${conversation.id}`}
                    className={cn(
                        "flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5",
                        activeId === conversation.id && "bg-accent"
                    )}
                >
                    <MessageSquareIcon className="size-4 text-muted-foreground" />

                    <span className="flex-1 truncate text-sm">
                        {conversation.title}
                    </span>

                    {conversation.isPinned && (
                        <PinIcon className="size-3 text-muted-foreground" />
                    )}
                </Link>

            </div>

            {expanded && hasBranches && (
                <div className="ml-10 mt-1 border-l pl-3">
                    {branches
                        ?.filter((b) => !b.isDefault)
                        .map((branch) => (
                            <Link
                                key={branch.id}
                                href={`/c/${conversation.id}?branch=${branch.id}`}
                                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                            >
                                🌿

                                <span className="truncate">
                                    {branch.name}
                                </span>
                            </Link>
                        ))}
                </div>
            )}

        </div>
    );
}

export function CollapsedChatMenu({
    conversations,
    isLoading,
    activeId,
}: {
    conversations: Conversation[] | undefined;
    isLoading: boolean;
    activeId: string | undefined;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!conversations) return [];

        return conversations.filter((c) =>
            c.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [conversations, search]);

    const pinned = filtered.filter((c) => c.isPinned);
    const recent = filtered.filter((c) => !c.isPinned);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Popover>

                    <PopoverTrigger
                        render={<SidebarMenuButton tooltip="Chats" />}
                    >
                        <MessageSquareIcon />
                    </PopoverTrigger>

                    <PopoverContent
                        side="right"
                        align="start"
                        className="w-105 overflow-hidden rounded-xl p-0"
                    >
                        <div className="border-b">
                            <div className="flex items-center gap-2 px-4 py-3">
                                <MessageSquareIcon className="size-4" />

                                <h2 className="font-semibold">
                                    Chats
                                </h2>
                            </div>

                            <div className="px-3 pb-3">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search chats..."
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto p-2">

                            {isLoading && (
                                <div className="space-y-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-12 rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && filtered.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <MessageSquareIcon className="mb-3 size-10 text-muted-foreground/40" />

                                    <p className="font-medium">
                                        No chats found
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Start a new conversation.
                                    </p>
                                </div>
                            )}

                            {!isLoading && pinned.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Pinned
                                    </div>

                                    <div className="space-y-1">
                                        {pinned.map((conversation) => (
                                            <PopupChatItem
                                                key={conversation.id}
                                                conversation={conversation}
                                                activeId={activeId}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {!isLoading && recent.length > 0 && (
                                <>
                                    <div className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Recent
                                    </div>

                                    <div className="space-y-1">
                                        {recent.map((conversation) => (
                                            <PopupChatItem
                                                key={conversation.id}
                                                conversation={conversation}
                                                activeId={activeId}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                        </div>

                    </PopoverContent>

                </Popover>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}