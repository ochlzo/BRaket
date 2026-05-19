"use client";

import type { BookingStatus } from "@prisma/client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BookingListItem } from "@/lib/bookings/types";

type ClientActivityChartProps = {
  bookings: BookingListItem[];
  userId: string;
};

const chartDays = 90;
const completedStatuses = new Set<BookingStatus>(["COMPLETED"]);
const rangeOptions = [
  { days: 90, label: "Last 3 months" },
  { days: 30, label: "Last 30 days" },
  { days: 7, label: "Last 7 days" },
] as const;

type RangeDays = (typeof rangeOptions)[number]["days"];

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function seededNumber(seed: string, index: number) {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i) + index * 17) % 9973;
  }
  return value;
}

function formatLabel(date: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function buildEmptyRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: chartDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (chartDays - index - 1));

    return {
      completed: 0,
      date,
      label: formatLabel(date),
      requests: 0,
    };
  });
}

function buildRealSeries(bookings: BookingListItem[]) {
  const counts = new Map<string, { completed: number; requests: number }>();

  for (const booking of bookings) {
    const key = dayKey(new Date(booking.createdAt));
    const count = counts.get(key) ?? { completed: 0, requests: 0 };
    count.requests += 1;
    if (completedStatuses.has(booking.status)) {
      count.completed += 1;
    }
    counts.set(key, count);
  }

  return buildEmptyRange().map((point) => ({
    ...point,
    completed: counts.get(dayKey(point.date))?.completed ?? 0,
    requests: counts.get(dayKey(point.date))?.requests ?? 0,
  }));
}

function buildMockSeries(userId: string) {
  return buildEmptyRange().map((point, index) => {
    const wave = Math.sin(index / 4) + Math.cos(index / 9);
    const seeded = seededNumber(userId, index);
    const requests = Math.max(
      0,
      Math.round(2 + wave * 2 + (seeded % 7) + (index % 13 === 0 ? 6 : 0)),
    );

    return {
      ...point,
      completed: Math.max(0, Math.round(requests * 0.42 + (seeded % 3) - 1)),
      requests,
    };
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

export function ClientActivityChart({
  bookings,
  userId,
}: ClientActivityChartProps) {
  const [rangeDays, setRangeDays] = useState<RangeDays>(90);
  const isDemo = bookings.length === 0;
  const fullSeries = useMemo(
    () => (isDemo ? buildMockSeries(userId) : buildRealSeries(bookings)),
    [bookings, isDemo, userId],
  );
  const series = fullSeries.slice(-rangeDays);
  const width = 900;
  const height = 260;
  const requestValues = series.map((point) => point.requests);
  const completedValues = series.map((point) => point.completed);
  const totalRequests = requestValues.reduce((total, value) => total + value, 0);
  const maxValue = Math.max(...requestValues, ...completedValues, 1);
  const ticks = tickIndexes(series.length);

  return (
    <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
      <CardHeader className="gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="tracking-normal">Request activity</CardTitle>
            {isDemo ? (
              <Badge className="bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]">
                Demo data
              </Badge>
            ) : null}
          </div>
          <CardDescription>
            {isDemo
              ? "Mock trend generated for this signed-in user."
              : "Real requests and completed bookings from this account."}
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
              {totalRequests}
            </p>
            <p className="text-xs font-medium text-[color:var(--ink-muted)]">
              Requests sent in {rangeOptions.find((option) => option.days === rangeDays)?.label.toLowerCase()}
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-[color:var(--ink-muted)]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--brand-orange)]" />
              Requests Sent
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--brand-blue)]" />
              Completed Jobs
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-alt)]/40">
          <svg
            aria-label="Request activity chart"
            className="h-[260px] w-full"
            preserveAspectRatio="none"
            role="img"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="requests-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="completed-fill" x1="0" x2="0" y1="0" y2="1">
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
              d={makeAreaPath(requestValues, width, height, maxValue)}
              fill="url(#requests-fill)"
            />
            <path
              d={makeAreaPath(completedValues, width, height, maxValue)}
              fill="url(#completed-fill)"
            />
            <path
              d={makeLinePath(requestValues, width, height, maxValue)}
              fill="none"
              stroke="var(--brand-orange)"
              strokeWidth="3"
            />
            <path
              d={makeLinePath(completedValues, width, height, maxValue)}
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="mt-2 grid grid-cols-7 text-[10px] font-semibold text-[color:var(--ink-muted)]">
          {ticks.map((index) => (
            <span key={index}>{series[index]?.label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
