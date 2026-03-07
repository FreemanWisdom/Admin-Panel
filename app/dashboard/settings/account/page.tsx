"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTheme } from "next-themes";
import { Lock, Bell, Moon, Sun, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function AccountSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [successMsg, setSuccessMsg] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = (data: PasswordForm) => {
        // mock submit
        console.log("Password changed", data);
        setSuccessMsg("Password successfully updated.");
        reset();
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    return (
        <div className="space-y-6 max-w-4xl pb-10">
            <div>
                <h2 className="text-2xl font-bold font-heading">Account Settings</h2>
                <p className="text-muted-foreground mt-1 text-sm">Manage your security and preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Security / Password */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="size-5" /> Change Password
                        </CardTitle>
                        <CardDescription>
                            Ensure your account is using a long, random password to stay secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="currentPassword">Current Password</label>
                                <Input type="password" id="currentPassword" {...register("currentPassword")} />
                                {errors.currentPassword && <p className="text-xs text-danger">{errors.currentPassword.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="newPassword">New Password</label>
                                <Input type="password" id="newPassword" {...register("newPassword")} />
                                {errors.newPassword && <p className="text-xs text-danger">{errors.newPassword.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                                <Input type="password" id="confirmPassword" {...register("confirmPassword")} />
                                {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="pt-2 flex items-center gap-4">
                                <Button type="submit">Update Password</Button>
                                {successMsg && (
                                    <span className="text-sm text-success flex items-center gap-1.5 transition-all">
                                        <CheckCircle2 className="size-4" /> {successMsg}
                                    </span>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="size-5" /> Notification Preferences
                        </CardTitle>
                        <CardDescription>Manage how you receive alerts and updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-w-md">
                            <label className="flex items-center justify-between gap-4 p-3 border border-border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
                                <div>
                                    <div className="font-medium text-sm">Email Notifications</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Receive daily summaries and activity alerts via email.</div>
                                </div>
                                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                            </label>

                            <label className="flex items-center justify-between gap-4 p-3 border border-border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
                                <div>
                                    <div className="font-medium text-sm">Browser Push Notifications</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Get real-time updates directly in your browser.</div>
                                </div>
                                <input type="checkbox" className="size-4 accent-primary" />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />} Theme Preference
                        </CardTitle>
                        <CardDescription>Customize the appearance of your admin interface.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground"}`}
                            >
                                <Sun className="size-4" /> Light
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground"}`}
                            >
                                <Moon className="size-4" /> Dark
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("system")}
                                className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === "system" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground"}`}
                            >
                                System
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
