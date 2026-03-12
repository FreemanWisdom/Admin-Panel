"use client";

import { useState, useCallback } from "react";
import { TimeRange } from "@/types";

export function useTimeRange(initial: TimeRange = "month") {
    const [range, setRange] = useState<TimeRange>(initial);

    const handleChange = useCallback((next: TimeRange) => {
        setRange(next);
    }, []);

    return { range, setRange: handleChange };
}
