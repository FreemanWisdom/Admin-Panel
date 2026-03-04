"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MapCountry, MapLevel } from "@/types";
import { motion } from "framer-motion";

// Only loaded client-side
const ComposableMap = dynamic(
    () => import("react-simple-maps").then((m) => m.ComposableMap),
    { ssr: false },
);
const Geographies = dynamic(
    () => import("react-simple-maps").then((m) => m.Geographies),
    { ssr: false },
);
const Geography = dynamic(
    () => import("react-simple-maps").then((m) => m.Geography),
    { ssr: false },
);
const ZoomableGroup = dynamic(
    () => import("react-simple-maps").then((m) => m.ZoomableGroup),
    { ssr: false },
);

const GEO_URL =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LEVEL_COLORS: Record<MapLevel, string> = {
    highest: "#4338ca", // Indigo 700
    medium: "#6366f1",  // Indigo 500
    low: "#818cf8",     // Indigo 400
    lowest: "#c7d2fe",    // Indigo 200
};

const LEVEL_LABELS: Record<MapLevel, string> = {
    highest: "Highest (800+)",
    medium: "Medium (200–800)",
    low: "Low (50–200)",
    lowest: "Lowest (<50)",
};

// ISO numeric to ISO alpha-2 map subset for common countries
const NUMERIC_TO_A2: Record<string, string> = {
    "840": "US",
    "826": "GB",
    "276": "DE",
    "250": "FR",
    "124": "CA",
    "036": "AU",
    "356": "IN",
    "156": "CN",
    "076": "BR",
    "392": "JP",
    "643": "RU",
    "484": "MX",
    "410": "KR",
    "380": "IT",
    "724": "ES",
    "528": "NL",
    "752": "SE",
    "578": "NO",
    "554": "NZ",
    "032": "AR",
    "710": "ZA",
    "566": "NG",
    "818": "EG",
    "792": "TR",
    "616": "PL",
};

interface WorldMapProps {
    data: MapCountry[];
    height?: number;
}

export function WorldMap({ data, height = 340 }: WorldMapProps) {
    const [tooltip, setTooltip] = useState<{
        country: string;
        orders: number;
        level: MapLevel;
        x: number;
        y: number;
    } | null>(null);

    const countryMap = new Map(data.map((d) => [d.countryCode, d]));

    function getFill(numericId: string) {
        const code = NUMERIC_TO_A2[numericId];
        if (!code) return "hsl(var(--muted))";
        const entry = countryMap.get(code);
        if (!entry) return "hsl(var(--muted))";
        return LEVEL_COLORS[entry.level];
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-lg bg-muted/20"
            style={{ height }}
        >
            <ComposableMap
                projectionConfig={{ scale: 147 }}
                style={{ width: "100%", height: "100%" }}
            >
                <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={8}>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties: { name: string } }> }) =>
                            geographies.map((geo) => {
                                const numericId = (geo.id || "").padStart(3, "0");
                                const fill = getFill(numericId);
                                const code = NUMERIC_TO_A2[numericId];
                                const entry = code ? countryMap.get(code) : undefined;

                                return (
                                    // @ts-ignore
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={fill}
                                        stroke="hsl(var(--background))"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none", transition: "fill 0.2s" },
                                            hover: { outline: "none", fill: entry ? fill : "hsl(var(--muted-foreground))", opacity: 0.85 },
                                            pressed: { outline: "none" },
                                        }}
                                        onMouseEnter={(e: React.MouseEvent) => {
                                            if (entry) {
                                                setTooltip({
                                                    country: entry.country,
                                                    orders: entry.totalOrders,
                                                    level: entry.level,
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="pointer-events-none fixed z-50 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
                >
                    <p className="font-semibold">{tooltip.country}</p>
                    <p className="text-muted-foreground">{tooltip.orders.toLocaleString()} orders</p>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex flex-col gap-1 rounded-md border border-border bg-surface/90 p-2 text-xs backdrop-blur-sm">
                {(Object.entries(LEVEL_LABELS) as [MapLevel, string][]).map(([level, label]) => (
                    <div key={level} className="flex items-center gap-1.5">
                        <span
                            className="inline-block size-2.5 rounded-full"
                            style={{ backgroundColor: LEVEL_COLORS[level] }}
                        />
                        <span className="text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
