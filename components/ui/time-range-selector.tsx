"use client";

import { TimeRange } from "@/types";
import { cn } from "@/lib/utils";

const ranges: { value: TimeRange; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
];

interface TimeRangeSelectorProps {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
    className?: string;
}

export function TimeRangeSelector({
    value,
    onChange,
    className,
}: TimeRangeSelectorProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5",
                className,
            )}
        >
            {ranges.map((r) => (
                <button
                    key={r.value}
                    type="button"
                    onClick={() => onChange(r.value)}
                    className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium transition-all duration-200",
                        value === r.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={value === r.value}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
}
