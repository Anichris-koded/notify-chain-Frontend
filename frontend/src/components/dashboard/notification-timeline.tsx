"use client";

import { cn } from "@/src/lib/utils";
import { timeAgo } from "@/src/lib/mock-data";
import type { NotificationDelivery, DeliveryStage, DeliveryStatus } from "@/src/lib/mock-data";
import { CheckCircle2, Clock, Loader, XCircle, Circle } from "lucide-react";

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusLabel: Record<DeliveryStatus, string> = {
  pending: "Pending",
  queued: "Queued",
  processing: "Processing",
  delivered: "Delivered",
  failed: "Failed",
};

function stageIcon(stage: DeliveryStage, isCurrent: boolean) {
  if (!stage.timestamp) {
    return <Circle className="size-4 text-muted-foreground/40" />;
  }
  switch (stage.status) {
    case "delivered":
      return <CheckCircle2 className="size-4 text-primary" />;
    case "failed":
      return <XCircle className="size-4 text-destructive" />;
    default:
      return isCurrent ? (
        <Loader className="size-4 animate-spin text-warning" />
      ) : (
        <CheckCircle2 className="size-4 text-primary" />
      );
  }
}

const stageDotColor: Record<DeliveryStatus, string> = {
  pending: "bg-muted-foreground/30",
  queued: "bg-primary",
  processing: "bg-warning",
  delivered: "bg-primary",
  failed: "bg-destructive",
};

const stageLabelColor: Record<DeliveryStatus, string> = {
  pending: "text-muted-foreground",
  queued: "text-foreground",
  processing: "text-warning",
  delivered: "text-primary",
  failed: "text-destructive",
};

// ─── Single delivery card ────────────────────────────────────────────────────

interface TimelineCardProps {
  delivery: NotificationDelivery;
}

export function TimelineCard({ delivery }: TimelineCardProps) {
  const reachedCount = delivery.stages.filter((s) => s.timestamp !== null).length;
  const lastReached = delivery.stages[reachedCount - 1];
  const isTerminal =
    lastReached?.status === "delivered" || lastReached?.status === "failed";

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {delivery.eventName}
          </p>
          <p className="text-xs text-muted-foreground">
            {delivery.contract} · {delivery.chain}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
            lastReached?.status === "delivered" &&
              "border-primary/20 bg-primary/10 text-primary",
            lastReached?.status === "failed" &&
              "border-destructive/20 bg-destructive/10 text-destructive",
            lastReached?.status === "processing" &&
              "border-warning/20 bg-warning/10 text-warning",
            (lastReached?.status === "pending" ||
              lastReached?.status === "queued") &&
              "border-border bg-secondary text-muted-foreground"
          )}
        >
          {statusLabel[lastReached?.status ?? "pending"]}
        </span>
      </div>

      {/* Vertical timeline */}
      <ol className="relative ml-1.5 border-l border-border">
        {delivery.stages.map((stage, i) => {
          const reached = stage.timestamp !== null;
          const isCurrent = i === reachedCount - 1 && !isTerminal;

          return (
            <li key={i} className="mb-0 ml-4 last:mb-0">
              {/* Connector dot */}
              <span
                className={cn(
                  "absolute -left-[9px] flex size-[18px] items-center justify-center rounded-full border-2 border-background",
                  reached ? stageDotColor[stage.status] : "bg-muted-foreground/20"
                )}
              />

              <div className="pb-5 last:pb-0">
                <div className="flex items-center gap-2">
                  {stageIcon(stage, isCurrent)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      reached
                        ? stageLabelColor[stage.status]
                        : "text-muted-foreground/40"
                    )}
                  >
                    {statusLabel[stage.status]}
                  </span>
                  {reached && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {timeAgo(stage.timestamp)}
                    </span>
                  )}
                  {!reached && (
                    <span className="ml-auto text-xs text-muted-foreground/40">
                      —
                    </span>
                  )}
                </div>

                {stage.note && (
                  <p className="mt-0.5 pl-6 text-xs text-destructive/80">
                    {stage.note}
                  </p>
                )}

                {reached && !stage.note && (
                  <p className="mt-0.5 pl-6 text-xs text-muted-foreground">
                    {new Date(stage.timestamp!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                )}

                {!reached && i === reachedCount && (
                  <p className="mt-0.5 pl-6 text-xs text-muted-foreground/40">
                    Not yet reached
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Footer — channel */}
      <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
        <Clock className="size-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          via <span className="font-medium text-foreground">{delivery.channelName}</span>
        </span>
      </div>
    </div>
  );
}

// ─── Full timeline list ───────────────────────────────────────────────────────

interface NotificationTimelineProps {
  deliveries: NotificationDelivery[];
}

export function NotificationTimeline({ deliveries }: NotificationTimelineProps) {
  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Clock className="mb-3 size-8 opacity-40" />
        <p className="text-sm">No delivery events to display.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {deliveries.map((d) => (
        <TimelineCard key={d.id} delivery={d} />
      ))}
    </div>
  );
}
