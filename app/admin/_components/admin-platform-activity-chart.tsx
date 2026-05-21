"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardData } from "@/server/admin/dashboard-data";

type AdminPlatformActivityChartProps = {
  series: AdminDashboardData["platformActivity"];
};

const rangeOptions = [
  { days: 90, label: "Last 3 months" },
  { days: 30, label: "Last 30 days" },
  { days: 7, label: "Last 7 days" },
] as const;

type RangeDays = (typeof rangeOptions)[number]["days"];

function smoothValues(points: number[]) {
  return points.map((value, index) => {
    const prevTwo = points[index - 2] ?? value;
    const previous = points[index - 1] ?? value;
    const next = points[index + 1] ?? value;
    const nextTwo = points[index + 2] ?? value;

    return (
      prevTwo * 0.1 + previous * 0.2 + value * 0.4 + next * 0.2 + nextTwo * 0.1
    );
  });
}

function makeLinePath(
  points: number[],
  width: number,
  height: number,
  max: number,
) {
  if (points.length === 0) return "";
  const coords = points.map((value, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * width,
    y: height - (value / max) * (height - 16) - 8,
  }));

  if (coords.length === 1) {
    return `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
  }

  return coords
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      }

      const previous = coords[index - 1];
      const controlX = previous.x + (point.x - previous.x) / 2;
      return `C ${controlX.toFixed(2)} ${previous.y.toFixed(2)} ${controlX.toFixed(2)} ${point.y.toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function makeAreaPath(points: number[], width: number, height: number, max: number) {
  const line = makeLinePath(points, width, height, max);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

function tickIndexes(length: number) {
  if (length <= 1) return [0];
  return Array.from({ length: Math.min(7, length) }, (_, index) =>
    Math.round((index / (Math.min(7, length) - 1)) * (length - 1)),
  );
}

export function AdminPlatformActivityChart({
  series,
}: AdminPlatformActivityChartProps) {
  const [rangeDays, setRangeDays] = useState<RangeDays>(90);
  const visibleSeries = series.slice(-rangeDays);
  const width = 900;
  const height = 260;
  const platformValues = visibleSeries.map(
    (point) => point.users + point.bookings + point.reports + point.verifications,
  );
  const reviewValues = visibleSeries.map(
    (point) => point.reports + point.verifications,
  );
  const totalPlatformEvents = platformValues.reduce(
    (total, value) => total + value,
    0,
  );
  const totalReviewItems = reviewValues.reduce((total, value) => total + value, 0);
  const platformTrend = smoothValues(platformValues);
  const reviewTrend = smoothValues(reviewValues);
  const maxValue = Math.max(
    ...platformTrend,
    ...reviewTrend,
    ...platformValues,
    ...reviewValues,
    1,
  );
  const ticks = tickIndexes(visibleSeries.length);
  const selectedLabel = rangeOptions
    .find((option) => option.days === rangeDays)
    ?.label.toLowerCase();

  return (
    <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
      <CardHeader className="gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="tracking-normal">Platform activity</CardTitle>
            <Badge className="bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]">
              Live data
            </Badge>
          </div>
          <CardDescription>
            Platform events and admin review items from live records.
          </CardDescription>
        </div>
        <div className="flex overflow-hidden rounded-lg border border-[color:var(--line-strong)] text-xs font-semibold">
          {rangeOptions.map((option, index) => (
            <button
              className={`px-3 py-2 transition ${index > 0 ? "border-l border-[color:var(--line-strong)]" : ""} ${
                rangeDays === option.days
                  ? "bg-[color:var(--surface-alt)] text-foreground"
                  : "bg-[color:var(--surface)] text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)]"
              }`}
              key={option.days}
              onClick={() => setRangeDays(option.days)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold tracking-normal text-foreground">
              {totalPlatformEvents}
            </p>
            <p className="text-xs font-medium text-[color:var(--ink-muted)]">
              Platform events in {selectedLabel}
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-[color:var(--ink-muted)]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--brand-orange)]" />
              Platform Events
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--brand-blue)]" />
              Admin Review Items: {totalReviewItems}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-alt)]/40">
          <svg
            aria-label="Admin platform activity chart"
            className="h-[260px] w-full"
            preserveAspectRatio="none"
            role="img"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="admin-platform-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="admin-review-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[52, 104, 156, 208].map((y) => (
              <line
                key={y}
                stroke="var(--line)"
                strokeWidth="1"
                x1="0"
                x2={width}
                y1={y}
                y2={y}
              />
            ))}
            <path
              d={makeAreaPath(platformTrend, width, height, maxValue)}
              fill="url(#admin-platform-fill)"
            />
            <path
              d={makeAreaPath(reviewTrend, width, height, maxValue)}
              fill="url(#admin-review-fill)"
            />
            <path
              d={makeLinePath(platformTrend, width, height, maxValue)}
              fill="none"
              stroke="var(--brand-orange)"
              strokeWidth="3"
            />
            <path
              d={makeLinePath(reviewTrend, width, height, maxValue)}
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="mt-2 grid grid-cols-7 text-[10px] font-semibold text-[color:var(--ink-muted)]">
          {ticks.map((index) => (
            <span key={index}>{visibleSeries[index]?.label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
