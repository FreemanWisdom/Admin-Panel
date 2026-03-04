"use client";

import { useMemo, useState } from "react";
import { MapCountry, MapLevel } from "@/types";
import { motion } from "framer-motion";

const LEVEL_COLORS: Record<MapLevel, string> = {
    highest: "#0f766e",
    medium: "#0891b2",
    low: "#2563eb",
    lowest: "#64748b",
};

const LEVEL_LABELS: Record<MapLevel, string> = {
    highest: "Highest (800+)",
    medium: "Medium (200–800)",
    low: "Low (50–200)",
    lowest: "Lowest (<50)",
};

type MapPoint = { x: number; y: number };
type TooltipState = {
    country: string;
    orders: number;
    level: MapLevel;
    x: number;
    y: number;
};

type MarkerEntry = MapCountry & MapPoint & { radius: number };

const COUNTRY_POINTS: Record<string, MapPoint> = {
    US: { x: 190, y: 170 },
    CA: { x: 180, y: 120 },
    MX: { x: 175, y: 225 },
    BR: { x: 300, y: 310 },
    AR: { x: 300, y: 390 },
    GB: { x: 485, y: 120 },
    FR: { x: 500, y: 145 },
    DE: { x: 515, y: 135 },
    ES: { x: 485, y: 170 },
    IT: { x: 530, y: 175 },
    NL: { x: 506, y: 124 },
    NO: { x: 520, y: 84 },
    SE: { x: 545, y: 100 },
    PL: { x: 553, y: 135 },
    TR: { x: 595, y: 185 },
    EG: { x: 560, y: 225 },
    RU: { x: 665, y: 95 },
    NG: { x: 520, y: 270 },
    ZA: { x: 570, y: 382 },
    IN: { x: 685, y: 230 },
    CN: { x: 760, y: 185 },
    KR: { x: 810, y: 165 },
    JP: { x: 845, y: 175 },
    AU: { x: 810, y: 355 },
    NZ: { x: 895, y: 390 },
};

interface WorldMapProps {
    data: MapCountry[];
    height?: number;
}

export function WorldMap({ data, height = 340 }: WorldMapProps) {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const markers = useMemo<MarkerEntry[]>(() => {
        if (data.length === 0) return [];

        const minOrders = Math.min(...data.map((entry) => entry.totalOrders));
        const maxOrders = Math.max(...data.map((entry) => entry.totalOrders));
        const spread = maxOrders - minOrders;

        return data.flatMap((entry) => {
            const point = COUNTRY_POINTS[entry.countryCode];
            if (!point) return [];

            const ratio = spread === 0 ? 0.5 : (entry.totalOrders - minOrders) / spread;
            const radius = 6 + ratio * 12;

            return [{ ...entry, ...point, radius }];
        });
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/20"
            style={{ height }}
        >
            <svg
                viewBox="0 0 1000 460"
                className="h-full w-full"
                role="img"
                aria-label="Global orders map"
            >
                {/* Abstract world silhouette to avoid third-party map dependency */}
                <g fill="hsl(var(--muted))" opacity="0.35">
                    <path d="M58 111 141 88 214 94 263 114 300 153 304 201 269 234 235 248 182 251 131 231 92 190 68 153z" />
                    <path d="M264 248 294 264 314 297 325 344 314 399 290 434 266 432 247 395 244 348 250 293z" />
                    <path d="M438 99 533 85 635 94 729 105 812 118 904 141 920 176 905 210 854 227 790 233 725 226 657 207 614 226 564 228 520 212 488 188 459 157z" />
                    <path d="M541 230 580 239 618 261 648 305 661 354 647 399 617 424 581 417 554 386 539 343 531 292z" />
                    <path d="M770 292 823 282 886 304 931 350 924 389 878 412 820 404 780 376 760 332z" />
                </g>

                <g>
                    {markers.map((marker, index) => (
                        <motion.circle
                            key={marker.countryCode}
                            cx={marker.x}
                            cy={marker.y}
                            initial={{ opacity: 0, r: 0 }}
                            animate={{ opacity: 0.95, r: marker.radius }}
                            transition={{ duration: 0.35, delay: index * 0.02 }}
                            fill={LEVEL_COLORS[marker.level]}
                            stroke="#ffffff"
                            strokeWidth={2}
                            className="cursor-pointer"
                            onMouseEnter={(event) =>
                                setTooltip({
                                    country: marker.country,
                                    orders: marker.totalOrders,
                                    level: marker.level,
                                    x: event.clientX,
                                    y: event.clientY,
                                })
                            }
                            onMouseMove={(event) => {
                                setTooltip((current) =>
                                    current && current.country === marker.country
                                        ? { ...current, x: event.clientX, y: event.clientY }
                                        : current,
                                );
                            }}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <title>{`${marker.country}: ${marker.totalOrders.toLocaleString()} orders`}</title>
                        </motion.circle>
                    ))}
                </g>
            </svg>

            {markers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    No mappable countries for the selected range.
                </div>
            )}

            {tooltip && (
                <div
                    className="pointer-events-none fixed z-50 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
                >
                    <p className="font-semibold">{tooltip.country}</p>
                    <p className="text-muted-foreground">{tooltip.orders.toLocaleString()} orders</p>
                </div>
            )}

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
