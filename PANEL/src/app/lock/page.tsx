"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LockScreen() {
    const [password, setPassword] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const router = useRouter();

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setIsUnlocking(true);
        // Simulate API delay
        setTimeout(() => {
            router.push("/dashboard/dashboard1");
        }, 600);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl text-center"
            >
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 shadow-inner mb-6 relative">
                    <Avatar alt="Admin User" fallback="AD" className="size-full text-2xl" />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1.5 shadow-sm border border-border">
                        <Lock className="size-4 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="mb-2 text-2xl font-bold font-heading">Lillie Smith</h1>
                <p className="mb-8 text-sm text-muted-foreground">Enter your password to unlock the session.</p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative text-left">
                        <Input
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isUnlocking}
                            className="text-center tracking-widest pl-4 pr-10"
                            autoFocus
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full gap-2 transition-all font-semibold"
                        disabled={!password || isUnlocking}
                    >
                        {isUnlocking ? (
                            <>
                                <Unlock className="size-4 animate-pulse" /> Unlocking...
                            </>
                        ) : (
                            <>
                                <Lock className="size-4" /> Unlock Dashboard
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-sm text-muted-foreground">
                    Not you? <button type="button" onClick={() => router.push("/login")} className="hover:text-primary underline underline-offset-4 decoration-muted-foreground transition-colors">Sign out</button>
                </div>
            </motion.div>
        </div>
    );
}
