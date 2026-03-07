"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import {
    type MouseEvent,
    type PointerEvent,
    type WheelEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { GeometryCollection, Topology } from "topojson-specification";
import { feature } from "topojson-client";
import { MapCountry, MapLevel } from "@/types";
import { motion } from "framer-motion";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 460;
const MAP_CENTER_X = MAP_WIDTH / 2;
const MAP_CENTER_Y = MAP_HEIGHT / 2;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

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

type TooltipState = {
    country: string;
    orders: number;
    level: MapLevel;
    x: number;
    y: number;
};

type CountryFeature = GeoJSON.Feature<
    GeoJSON.Geometry,
    { name?: string } & Record<string, unknown>
> & { id?: string | number };

type WorldAtlasTopology = Topology;

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

type Pan = { x: number; y: number };
type DragState = {
    pointerId: number;
    startX: number;
    startY: number;
    startPan: Pan;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function WorldMap({ data, height = 340 }: WorldMapProps) {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [loadFailed, setLoadFailed] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const dragRef = useRef<DragState | null>(null);

    const countryMap = useMemo(() => {
        return new Map(data.map((entry) => [entry.countryCode.toUpperCase(), entry]));
    }, [data]);

    useEffect(() => {
        let active = true;

        async function loadGeography() {
            try {
                const response = await fetch(GEO_URL);
                if (!response.ok) {
                    throw new Error("Failed to fetch world geography");
                }

                const topology = (await response.json()) as WorldAtlasTopology;
                const countriesObject = (topology.objects as Record<string, GeometryCollection>)["countries"];
                if (!countriesObject) {
                    throw new Error("Countries object missing from topology");
                }

                const geo = feature(topology, countriesObject);
                if (geo.type !== "FeatureCollection") {
                    throw new Error("Unexpected world atlas geometry");
                }

                if (active) {
                    setCountries(geo.features as CountryFeature[]);
                    setLoadFailed(false);
                }
            } catch {
                if (active) {
                    setCountries([]);
                    setLoadFailed(true);
                }
            }
        }

        void loadGeography();

        return () => {
            active = false;
        };
    }, []);

    const projection = useMemo(() => {
        if (countries.length === 0) return null;
        const collection: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: "FeatureCollection",
            features: countries,
        };
        return geoNaturalEarth1().fitExtent(
            [
                [10, 10],
                [MAP_WIDTH - 10, MAP_HEIGHT - 10],
            ],
            collection,
        );
    }, [countries]);

    const pathGenerator = useMemo(
        () => (projection ? geoPath(projection) : null),
        [projection],
    );

    function getCountryEntry(featureId: string | number | undefined) {
        const numericId = String(featureId ?? "").padStart(3, "0");
        const code = NUMERIC_TO_A2[numericId];
        if (!code) return null;
        return countryMap.get(code) ?? null;
    }

    function handleMouseEnter(
        event: MouseEvent<SVGPathElement>,
        geo: CountryFeature,
        entry: MapCountry | null,
    ) {
        if (!entry || isDragging) return;
        setTooltip({
            country: entry.country || geo.properties?.name || "Unknown country",
            orders: entry.totalOrders,
            level: entry.level,
            x: event.clientX,
            y: event.clientY,
        });
    }

    function clampPan(nextPan: Pan, nextZoom: number) {
        const maxX = ((nextZoom - 1) * MAP_WIDTH) / 2;
        const maxY = ((nextZoom - 1) * MAP_HEIGHT) / 2;

        return {
            x: clamp(nextPan.x, -maxX, maxX),
            y: clamp(nextPan.y, -maxY, maxY),
        };
    }

    function handleWheel(event: WheelEvent<SVGSVGElement>) {
        event.preventDefault();
        setZoom((currentZoom) => {
            const factor = event.deltaY < 0 ? 1.12 : 0.88;
            const nextZoom = clamp(currentZoom * factor, MIN_ZOOM, MAX_ZOOM);

            if (nextZoom === currentZoom) return currentZoom;

            setPan((currentPan) => clampPan(currentPan, nextZoom));
            return nextZoom;
        });
    }

    function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startPan: pan,
        };
        setIsDragging(true);
        setTooltip(null);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
        const dragState = dragRef.current;
        const svg = svgRef.current;
        if (!dragState || !svg || dragState.pointerId !== event.pointerId) return;

        const rect = svg.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dx = ((event.clientX - dragState.startX) / rect.width) * MAP_WIDTH;
        const dy = ((event.clientY - dragState.startY) / rect.height) * MAP_HEIGHT;

        setPan(clampPan({ x: dragState.startPan.x + dx, y: dragState.startPan.y + dy }, zoom));
    }

    function handlePointerUp(event: PointerEvent<SVGSVGElement>) {
        const dragState = dragRef.current;
        if (!dragState || dragState.pointerId !== event.pointerId) return;

        dragRef.current = null;
        setIsDragging(false);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function zoomIn() {
        setZoom((currentZoom) => {
            const nextZoom = clamp(currentZoom * 1.2, MIN_ZOOM, MAX_ZOOM);
            setPan((currentPan) => clampPan(currentPan, nextZoom));
            return nextZoom;
        });
    }

    function zoomOut() {
        setZoom((currentZoom) => {
            const nextZoom = clamp(currentZoom * 0.8, MIN_ZOOM, MAX_ZOOM);
            setPan((currentPan) => clampPan(currentPan, nextZoom));
            return nextZoom;
        });
    }

    function resetView() {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }

    const transform = `translate(${pan.x} ${pan.y}) translate(${MAP_CENTER_X} ${MAP_CENTER_Y}) scale(${zoom}) translate(${-MAP_CENTER_X} ${-MAP_CENTER_Y})`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/20"
            style={{ height }}
        >
            <svg
                ref={svgRef}
                viewBox="0 0 1000 460"
                className={`h-full w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                role="img"
                aria-label="Global orders map"
                style={{ touchAction: "none" }}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <rect
                    x="0"
                    y="0"
                    width="1000"
                    height="460"
                    fill="hsl(var(--surface))"
                    opacity="0.3"
                />
                <g transform={transform}>
                    {countries.map((geo, index) => {
                        const path = pathGenerator?.(geo) ?? "";
                        if (!path) return null;

                        const entry = getCountryEntry(geo.id);
                        const fill = entry ? LEVEL_COLORS[entry.level] : "hsl(var(--muted))";

                        return (
                            <motion.path
                                key={String(geo.id ?? index)}
                                d={path}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.35, delay: index * 0.002 }}
                                fill={fill}
                                stroke="hsl(var(--background))"
                                strokeWidth={0.6}
                                className={entry ? "cursor-pointer" : undefined}
                                onMouseEnter={(event) =>
                                    handleMouseEnter(event, geo, entry)
                                }
                                onMouseMove={(event) => {
                                    setTooltip((current) =>
                                        current
                                            ? {
                                                ...current,
                                                x: event.clientX,
                                                y: event.clientY,
                                            }
                                            : current,
                                    );
                                }}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        );
                    })}
                </g>
            </svg>

            {loadFailed && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Unable to load map geometry.
                </div>
            )}

            {!loadFailed && countries.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Loading map...
                </div>
            )}

            {tooltip && (
                <div
                    className="pointer-events-none fixed z-50 rounded-lg border border-border bg-surface dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 px-3 py-2 text-xs shadow-lg"
                    style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
                >
                    <p className="font-semibold">{tooltip.country}</p>
                    <p className="text-muted-foreground">{tooltip.orders.toLocaleString()} orders</p>
                </div>
            )}

            <div className="absolute bottom-2 left-2 flex flex-col gap-1 rounded-md border border-border bg-surface/90 dark:bg-gray-900/90 dark:border-gray-700 p-2 text-xs backdrop-blur-sm">
                {(Object.entries(LEVEL_LABELS) as [MapLevel, string][]).map(([level, label]) => (
                    <div key={level} className="flex items-center gap-1.5">
                        <span
                            className="inline-block size-2.5 rounded-full"
                            style={{ backgroundColor: LEVEL_COLORS[level] }}
                        />
                        <span className="text-muted-foreground dark:text-gray-300">{label}</span>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md border border-border bg-surface/90 dark:bg-gray-900/90 dark:border-gray-700 p-1.5 text-xs backdrop-blur-sm">
                <button
                    type="button"
                    className="rounded border border-border dark:border-gray-700 px-2 py-1 text-foreground dark:text-gray-100 hover:bg-muted dark:hover:bg-gray-800"
                    onClick={zoomOut}
                    aria-label="Zoom out"
                >
                    -
                </button>
                <span className="min-w-12 text-center font-medium text-muted-foreground dark:text-gray-300">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    type="button"
                    className="rounded border border-border dark:border-gray-700 px-2 py-1 text-foreground dark:text-gray-100 hover:bg-muted dark:hover:bg-gray-800"
                    onClick={zoomIn}
                    aria-label="Zoom in"
                >
                    +
                </button>
                <button
                    type="button"
                    className="rounded border border-border dark:border-gray-700 px-2 py-1 text-foreground dark:text-gray-100 hover:bg-muted dark:hover:bg-gray-800"
                    onClick={resetView}
                >
                    Reset
                </button>
            </div>
        </motion.div>
    );
}
