"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBranch, renameBranch } from "@/features/conversation/actions/branch-actions";

type Branch = { id: string; name: string; isDefault: boolean };

type BranchSwitcherProps = {
    conversationId: string;
    branches: Branch[];
    activeBranchId: string;
    onSwitch: (branchId: string) => void;
};

export function BranchSwitcher({ conversationId, branches, activeBranchId, onSwitch }: BranchSwitcherProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const active = branches.find((b) => b.id === activeBranchId);

    function handleRename(branchId: string, name: string) {
        startTransition(async () => {
            await renameBranch(branchId, name);
            router.refresh();
        });
    }

    function handleDelete(branchId: string) {
        startTransition(async () => {
            await deleteBranch(branchId);
            if (branchId === activeBranchId) {
                const fallback = branches.find((b) => b.isDefault);
                if (fallback) onSwitch(fallback.id);
            } else {
                router.refresh();
            }
        });
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
            >
                {active?.name ?? "main"}
            </button>

            {open && (
                <div className="absolute right-0 z-10 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
                    {branches.map((b) => (
                        <div key={b.id} className="flex items-center gap-1 rounded px-2 py-1 hover:bg-accent">
                            {editingId === b.id ? (
                                <input
                                    autoFocus
                                    defaultValue={b.name}
                                    className="flex-1 bg-transparent text-xs outline-none"
                                    onBlur={(e) => {
                                        handleRename(b.id, e.target.value);
                                        setEditingId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            ) : (
                                <button
                                    className={`flex-1 truncate text-left text-xs ${b.id === activeBranchId ? "font-medium" : ""}`}
                                    onClick={() => {
                                        onSwitch(b.id);
                                        setOpen(false);
                                    }}
                                >
                                    {b.name}
                                </button>
                            )}

                            {!b.isDefault && (
                                <>
                                    <button
                                        aria-label="Rename branch"
                                        className="text-xs opacity-60 hover:opacity-100"
                                        onClick={() => setEditingId(b.id)}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        aria-label="Delete branch"
                                        className="text-xs opacity-60 hover:opacity-100"
                                        disabled={isPending}
                                        onClick={() => handleDelete(b.id)}
                                    >
                                        🗑
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}