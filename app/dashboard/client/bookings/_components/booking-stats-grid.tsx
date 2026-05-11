type BookingStatsGridProps = {
  activeBookings: number;
  bookingsCount: number;
  completedBookings: number;
};

export function BookingStatsGrid({
  activeBookings,
  bookingsCount,
  completedBookings,
}: BookingStatsGridProps) {
  const stats = [
    {
      bg: "from-[color:var(--tone-orange-soft)] to-white",
      emoji: "🔥",
      label: "Active Bookings",
      value: activeBookings,
    },
    {
      bg: "from-[color:var(--tone-green-soft)] to-white",
      emoji: "✅",
      label: "Completed",
      value: completedBookings,
    },
    {
      bg: "from-[color:var(--tone-sky-soft)] to-white",
      emoji: "📋",
      label: "Total Bookings",
      value: bookingsCount,
    },
  ];

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-1 items-center justify-between rounded-xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
        >
          <div>
            <p className="text-xl font-extrabold leading-none tracking-[-0.03em] text-foreground">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] font-medium leading-none text-[color:var(--ink-muted)]">
              {stat.label}
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center opacity-80">
            <span className="text-xl leading-none">{stat.emoji}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
