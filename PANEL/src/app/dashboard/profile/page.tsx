"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSkills } from "@/components/profile/ProfileSkills";
import { ProfileSocials } from "@/components/profile/ProfileSocials";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Mail, BookA, User } from "lucide-react";

const DUMMY_PROFILE = {
    name: "Frontend Developer",
    role: "Senior UI Architect",
    email: "hello@adminpanel.com",
    skills: ["JavaScript", "React", "Next.js", "UI Design", "Tailwind CSS", "Framer Motion"],
    about: "Frontend developer passionate about building modern dashboards and user interfaces. Deeply invested in creating the best possible UX while maintaining robust and scalable frontend architectures.",
    socials: [
        { platform: "github" as const, url: "#" },
        { platform: "linkedin" as const, url: "#" },
        { platform: "twitter" as const, url: "#" },
        { platform: "website" as const, url: "#" },
    ],
};

export default function ProfilePage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <ProfileHeader
                name={DUMMY_PROFILE.name}
                role={DUMMY_PROFILE.role}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                        <h2 className="text-lg font-bold font-heading flex flex-row items-center gap-2 mb-4">
                            <User className="size-5" /> About Me
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {DUMMY_PROFILE.about}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                        <h2 className="text-lg font-bold font-heading flex flex-row items-center gap-2 mb-4">
                            <BookA className="size-5" /> Profile Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <span className="w-24 text-sm font-medium text-muted-foreground">Full Name:</span>
                                <span className="font-medium">{DUMMY_PROFILE.name}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="w-24 text-sm font-medium text-muted-foreground">Email:</span>
                                <span className="font-medium flex items-center gap-2">
                                    {DUMMY_PROFILE.email} <Mail className="size-3 lg:hidden xl:block text-muted-foreground opacity-50" />
                                </span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="w-24 text-sm font-medium text-muted-foreground">Role:</span>
                                <span className="font-medium">{DUMMY_PROFILE.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ProfileSkills skills={DUMMY_PROFILE.skills} />
                    <ProfileSocials socials={DUMMY_PROFILE.socials} />
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}
