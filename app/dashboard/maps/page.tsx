"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Upload, Table2 } from "lucide-react";
import { motion } from "framer-motion";

import { getMapData } from "@/lib/api";
import { useTimeRange } from "@/hooks/use-time-range";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { MapLevel } from "@/types";

const WorldMap = dynamic(
    () => import("@/components/charts/WorldMap").then((m) => m.WorldMap),
    { ssr: false, loading: () => <Skeleton className="h-[480px] w-full" /> },
);

const levelVariantMap: Record<MapLevel, "success" | "default" | "warning" | "danger"> = {
    highest: "success",
    medium: "default",
    low: "warning",
    lowest: "danger",
};

export default function MapsPage() {
    const { range, setRange } = useTimeRange("month");
    const { pushToast } = useToast();

    const mapQuery = useQuery({
        queryKey: ["map-data", range],
        queryFn: () => getMapData(range),
    });

    function handleExportCSV() {
        const data = mapQuery.data ?? [];
        const csv = [
            "Country,Code,Total Orders,Level",
            ...data.map((d) => `${d.country},${d.countryCode},${d.totalOrders},${d.level}`),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders-by-country.csv";
        a.click();
        URL.revokeObjectURL(url);
        pushToast({ title: "CSV exported", variant: "success" });
    }

    function handleExportJSON() {
        const data = mapQuery.data ?? [];
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders-map-data.json";
        a.click();
        URL.revokeObjectURL(url);
        pushToast({ title: "JSON exported", variant: "success" });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* Map card */}
            <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Global Orders Map</CardTitle>
                        <CardDescription>Scroll to zoom · Drag to pan · Hover for details</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV}>
                            <Download className="size-3.5" /> Export CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportJSON}>
                            <Download className="size-3.5" /> Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => pushToast({ title: "Import UI coming soon", variant: "default" })}>
                            <Upload className="size-3.5" /> Import
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {mapQuery.isLoading ? (
                        <Skeleton className="h-[480px] w-full" />
                    ) : (
                        <WorldMap data={mapQuery.data ?? []} height={480} />
                    )}
                </CardContent>
            </Card>

            {/* Country table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Table2 className="size-4" />
                        Country Data
                    </CardTitle>
                    <CardDescription>Breakdown of order volume per country</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {mapQuery.isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : (
                        <table className="min-w-full text-left text-sm">
                            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 pr-6">Country</th>
                                    <th className="pb-3 pr-6">Code</th>
                                    <th className="pb-3 pr-6">Total Orders</th>
                                    <th className="pb-3">Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {(mapQuery.data ?? [])
                                    .sort((a, b) => b.totalOrders - a.totalOrders)
                                    .map((row) => (
                                        <tr key={row.countryCode} className="transition-colors hover:bg-muted/40">
                                            <td className="py-2.5 pr-6 font-medium">{row.country}</td>
                                            <td className="py-2.5 pr-6 font-mono text-xs text-muted-foreground">
                                                {row.countryCode}
                                            </td>
                                            <td className="py-2.5 pr-6">{row.totalOrders.toLocaleString()}</td>
                                            <td className="py-2.5">
                                                <Badge variant={levelVariantMap[row.level]}>{row.level}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
