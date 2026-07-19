"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  GitBranchIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBranches,
  useConversations,
  useDeleteBranch,
  useDeleteConversation,
  useRenameBranch,
  useUpdateConversation,
} from "@/features/conversation/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { CollapsedChatMenu } from "./collapsed-chat-menu";

type Conversation = NonNullable<
  ReturnType<typeof useConversations>["data"]
>[number];

/**
 * Main application sidebar — logo, new chat, conversation list, theme toggle, and account.
 */
export function AppSidebar() {
  const pathname = usePathname();

  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";

  const { data: conversations, isLoading } = useConversations();


  // Get the active conversation id from the pathname (e.g. /c/123)
  // pathname.split("/")[2] is the third part of the pathname (the conversation id)
  //  firstparam = / , secondparam = c , thirdparam = 123
  const activeId = pathname.startsWith("/c/")
    ? pathname.split("/")[2]
    : undefined;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="font-semibold tracking-tight group-data-[collapsible=icon]:justify-center"
              render={<Link href="/" />}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                C
              </span>
              <span className="truncate group-data-[collapsible=icon]:hidden">
                ChaiGPT
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New chat"
              className="group-data-[collapsible=icon]:justify-center"
              render={<Link href="/" />}
            >
              <PlusIcon className="shrink-0" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                New chat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isCollapsed ? (
          <CollapsedChatMenu
            conversations={conversations}
            isLoading={isLoading}
            activeId={activeId}
          />
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <ChatList
                  conversations={conversations}
                  isLoading={isLoading}
                  activeId={activeId}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/** Renders the conversation list with loading skeletons or an empty-state message. */
function ChatList({
  conversations,
  isLoading,
  activeId,
}: {
  conversations: Conversation[] | undefined;
  isLoading: boolean;
  activeId: string | undefined;
}) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <Skeleton className="h-8 w-full" />
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  if (!conversations?.length) {
    return (
      <p className="px-2 py-1.5 text-xs text-muted-foreground">No chats yet</p>
    );
  }

  return (
    <>
      {conversations.map((conversation) => (
        <ChatItem
          key={conversation.id}
          conversation={conversation}
          isActive={activeId === conversation.id}
        />
      ))}
    </>
  );
}

/** Single sidebar row for a conversation with rename, pin, and delete actions. */
/** Single sidebar row for a conversation with rename, pin, delete, and nested branches. */
function ChatItem({
  conversation,
  isActive,
}: {
  conversation: Conversation;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const searchParams = useSearchParams();
  const activeBranchId = searchParams.get("branch");

  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation(
    isActive ? conversation.id : undefined
  );

  const hasBranches = conversation.branchCount > 1;
  const { data: branches } = useBranches(conversation.id, expanded && hasBranches);
  const renameBranchMutation = useRenameBranch(conversation.id);
  const deleteBranchMutation = useDeleteBranch(conversation.id);

  /** Prompts the user to rename the conversation and persists the new title. */
  function handleRename() {
    const next = window.prompt("Rename chat", conversation.title);
    if (!next || next.trim() === conversation.title) return;
    updateConversation.mutate({ id: conversation.id, title: next });
  }

  function handleRenameBranch(branchId: string, currentName: string) {
    const next = window.prompt("Rename branch", currentName);
    if (!next || next.trim() === currentName) return;
    renameBranchMutation.mutate({ branchId, name: next.trim() });
  }

  return (
    <SidebarMenuItem>
      <div className="relative flex items-center">
        {hasBranches && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex size-6 shrink-0 items-center justify-center text-muted-foreground group-data-[collapsible=icon]:hidden"
            aria-label={expanded ? "Collapse branches" : "Expand branches"}
          >
            <ChevronRightIcon
              className={cn("size-3.5 transition-transform", expanded && "rotate-90")}
            />
          </button>
        )}
        <SidebarMenuButton
          isActive={isActive && !activeBranchId}
          tooltip={conversation.title}
          render={<Link href={`/c/${conversation.id}`} />}
          className={cn(isActive && !activeBranchId && "font-medium", !hasBranches && "ml-6")}
        >
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {conversation.title}
          </span>
        </SidebarMenuButton>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuAction
                className="opacity-0 group-hover/menu-item:opacity-100 data-popup-open:opacity-100 data-popup-open:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
              />
            }
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Chat actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={handleRename}>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateConversation.mutate({
                  id: conversation.id,
                  isPinned: !conversation.isPinned,
                })
              }
            >
              {conversation.isPinned ? <PinOffIcon /> : <PinIcon />}
              {conversation.isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteConversation.mutate(conversation.id)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {expanded && hasBranches && (
        <div className="ml-6 flex flex-col gap-0.5 border-l pl-2 group-data-[collapsible=icon]:hidden">
          {branches
            ?.filter((b) => !b.isDefault)
            .map((branch) => (
              <div key={branch.id} className="group/branch relative flex items-center">
                <SidebarMenuButton
                  size="sm"
                  isActive={isActive && activeBranchId === branch.id}
                  tooltip={branch.name}
                  render={<Link href={`/c/${conversation.id}?branch=${branch.id}`} />}
                  className={cn(
                    "gap-1.5 text-xs",
                    isActive && activeBranchId === branch.id && "font-medium"
                  )}
                >
                  <GitBranchIcon className="size-3" />
                  <span className="truncate">{branch.name}</span>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent group-hover/branch:opacity-100 data-popup-open:bg-sidebar-accent data-popup-open:opacity-100"
                      />
                    }
                  >
                    <MoreHorizontalIcon className="size-3" />
                    <span className="sr-only">Branch actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem
                      onClick={() => handleRenameBranch(branch.id, branch.name)}
                    >
                      <PencilIcon />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => deleteBranchMutation.mutate(branch.id)}
                    >
                      <Trash2Icon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

/** Footer menu with theme toggle and Clerk user account button. */
/** Footer menu with theme toggle and Clerk user account button. */
function SidebarFooterMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Toggle theme"
          onClick={() =>
            mounted &&
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
        >
          {!mounted ? (
            <div className="size-4 shrink-0" />
          ) : resolvedTheme === "dark" ? (
            <SunIcon className="shrink-0" />
          ) : (
            <MoonIcon className="shrink-0" />
          )}

          <span className="truncate group-data-[collapsible=icon]:hidden">
            Toggle theme
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5">
          {mounted ? (
            <ClerkLoaded>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8",
                  },
                }}
              />
            </ClerkLoaded>
          ) : (
            <div className="size-8 rounded-full bg-muted" />
          )}
          <span className="truncate text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
            Account
          </span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
