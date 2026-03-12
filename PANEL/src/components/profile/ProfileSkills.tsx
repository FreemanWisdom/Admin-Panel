"use client";

import { Badge } from "@/components/ui/badge";

interface ProfileSkillsProps {
    skills: string[];
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
    return (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold font-heading mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <Badge key={skill} variant="default" className="px-3 py-1">
                        {skill}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
