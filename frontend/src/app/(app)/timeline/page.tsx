"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/src/components/dashboard/topbar";
import { NotificationTimeline } from "@/src/components/dashboard/notification-timeline";
import { deliveries, type DeliveryStatus } from "@/src/lib/mock-data";

const STATUS_FILTERS: { label: string; value: "all" | DeliveryStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Queued", value: "queued" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
];

export default function TimelinePage() {
  const [filter, setFilter] = useState<"all" | DeliveryStatus>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return deliveries;
    return deliveries.filter((d) => {
      const reachedCount = d.stages.filter((s) => s.timestamp !== null).length;
      const lastStatus = d.stages[reachedCount - 1]?.status;
      return lastStatus === filter;
    });
  }, [filter]);

  return (
    <div className="flex flex-1 flex-col">
      <Topbar
        title="Delivery Timeline"
        description="Track every notification from creation to delivery"
      />

      <main className="flex-1 p-4 md:p-6">
        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={
                filter === f.value
                  ? "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  : "rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <NotificationTimeline deliveries={filtered} />
      </main>
    </div>
  );
}
