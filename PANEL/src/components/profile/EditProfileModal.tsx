"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface dark:bg-gray-900 dark:text-gray-100 p-6 shadow-2xl z-50"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-heading">Edit Profile</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full p-2 hover:bg-muted transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="size-5 text-muted-foreground" />
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" htmlFor="name">Name</label>
                                <Input id="name" defaultValue="Frontend Developer" />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" htmlFor="skills">Skills (comma separated)</label>
                                <Input id="skills" defaultValue="JavaScript, React, Next.js, UI Design" />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" htmlFor="about">About</label>
                                <textarea
                                    id="about"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue="Frontend developer passionate about building modern dashboards and user interfaces."
                                    rows={4}
                                />
                            </div>

                            <div className="pt-2">
                                <h3 className="text-sm font-medium mb-3">Social Links</h3>
                                <div className="space-y-3">
                                    <Input placeholder="GitHub URL" defaultValue="https://github.com/example" />
                                    <Input placeholder="LinkedIn URL" defaultValue="https://linkedin.com/in/example" />
                                    <Input placeholder="Twitter URL" defaultValue="https://twitter.com/example" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
