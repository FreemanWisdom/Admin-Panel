"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ProfileHeaderProps {
    name: string;
    role: string;
    onEdit: () => void;
}

export function ProfileHeader({ name, role, onEdit }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-surface p-6 shadow-sm border border-border">
            <div className="flex items-center gap-6">
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl shadow-inner">
                    👨‍💻
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold font-heading">{name}</h1>
                    <p className="text-muted-foreground">{role}</p>
                </div>
            </div>
            <div>
                <Button onClick={onEdit} variant="outline" className="gap-2 focus-ring">
                    <Pencil className="size-4" />
                    Edit Profile
                </Button>
            </div>
        </div>
    );
}
