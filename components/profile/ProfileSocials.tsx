"use client";

import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import Link from "next/link";

interface SocialLink {
    platform: "github" | "linkedin" | "twitter" | "website";
    url: string;
}

interface ProfileSocialsProps {
    socials: SocialLink[];
}

const icons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
};

export function ProfileSocials({ socials }: ProfileSocialsProps) {
    return (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold font-heading mb-4">Social Links</h2>
            <div className="flex gap-4">
                {socials.map(({ platform, url }) => {
                    const Icon = icons[platform];
                    return (
                        <Link
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground focus-ring rounded p-1"
                            aria-label={`Visit my ${platform}`}
                        >
                            <Icon className="size-6" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
