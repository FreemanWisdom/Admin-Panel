"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Shield, Lock, Smartphone, Eye, EyeOff, Clock } from "lucide-react";
import { motion } from "framer-motion";

import { getSessions, revokeSession } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

function PasswordStrengthBar({ password }: { password: string }) {
    const strength = (() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    })();

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-danger", "bg-warning", "bg-blue-500", "bg-success"];

    return (
        <div className="space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-muted"}`}
                    />
                ))}
            </div>
            {password && (
                <p className={`text-xs font-medium ${colors[strength].replace("bg-", "text-")}`}>
                    {labels[strength]}
                </p>
            )}
        </div>
    );
}

export default function AuthSettingsPage() {
    const { pushToast } = useToast();

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [saving, setSaving] = useState(false);

    const sessionsQuery = useQuery({ queryKey: ["sessions"], queryFn: getSessions });

    const revokeMutation = useMutation({
        mutationFn: revokeSession,
        onSuccess: () => {
            sessionsQuery.refetch();
            pushToast({ title: "Session revoked", variant: "success" });
        },
    });

    async function handleResetPassword() {
        if (!currentPw || !newPw || !confirmPw) {
            pushToast({ title: "All fields required", variant: "warning" });
            return;
        }
        if (newPw !== confirmPw) {
            pushToast({ title: "Passwords do not match", variant: "danger" });
            return;
        }
        if (newPw.length < 8) {
            pushToast({ title: "Password must be at least 8 characters", variant: "warning" });
            return;
        }
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        pushToast({ title: "Password updated successfully", variant: "success" });
    }

    if (isLocked) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-muted p-6">
                    <Lock className="size-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Session Locked</h2>
                <p className="text-muted-foreground">Enter your password to unlock the session.</p>
                <div className="w-full max-w-xs space-y-3">
                    <Input type="password" placeholder="Enter password" />
                    <Button className="w-full" onClick={() => {
                        setIsLocked(false);
                        pushToast({ title: "Session unlocked", variant: "success" });
                    }}>
                        Unlock
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
        >
            {/* Reset Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="size-4" /> Reset Password
                    </CardTitle>
                    <CardDescription>Change your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-md">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Current Password</label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                value={currentPw}
                                onChange={(e) => setCurrentPw(e.target.value)}
                                placeholder="Current password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowCurrent((p) => !p)}
                            >
                                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                                placeholder="New password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowNew((p) => !p)}
                            >
                                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        <div className="mt-2">
                            <PasswordStrengthBar password={newPw} />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm Password</label>
                        <Input
                            type="password"
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <Button loading={saving} onClick={handleResetPassword}>Update Password</Button>
                </CardContent>
            </Card>

            {/* 2FA Toggle */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="size-4" /> Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">
                            {twoFAEnabled ? "2FA is enabled" : "2FA is disabled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {twoFAEnabled ? "Your account is protected by 2FA." : "Enable 2FA to secure your account."}
                        </p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={twoFAEnabled}
                        onClick={() => {
                            setTwoFAEnabled((p) => !p);
                            pushToast({
                                title: twoFAEnabled ? "2FA disabled" : "2FA enabled",
                                variant: twoFAEnabled ? "warning" : "success",
                            });
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${twoFAEnabled ? "bg-primary" : "bg-muted"}`}
                    >
                        <span
                            className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 ${twoFAEnabled ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                </CardContent>
            </Card>

            {/* Lock Screen */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="size-4" /> Lock Screen
                    </CardTitle>
                    <CardDescription>Temporarily lock this session</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">
                        Lock this session to prevent unauthorized access while you are away.
                    </p>
                    <Button variant="outline" onClick={() => setIsLocked(true)}>
                        Lock Session
                    </Button>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="size-4" /> Active Sessions
                    </CardTitle>
                    <CardDescription>Manage devices currently logged into your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sessionsQuery.isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))
                        : (sessionsQuery.data ?? []).map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                                <div>
                                    <p className="text-sm font-medium">{session.device}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {session.location} · {formatDate(session.lastActive)}
                                    </p>
                                </div>
                                {session.current ? (
                                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                        Current
                                    </span>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        loading={revokeMutation.isPending}
                                        onClick={() => revokeMutation.mutate(session.id)}
                                    >
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}
