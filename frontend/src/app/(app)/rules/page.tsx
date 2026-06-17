"use client";

import { useState } from "react";
import { Plus, Zap, X, ChevronRight } from "lucide-react";
import { Topbar } from "@/src/components/dashboard/topbar";
import { StatusBadge } from "@/src/components/dashboard/status-badge";
import {
  ChannelIcon,
  channelIcons,
} from "@/src/components/dashboard/channel-icon";
import { Button } from "@/src/components/ui/button";
import { useData } from "@/src/store";
import {
  channelLabels,
  timeAgo,
  type ChannelType,
} from "@/src/lib/mock-data";

export default function RulesPage() {
  const rules = useData((state) => state.rules);
  const toggleRule = useData((state) => state.toggleRule);
  const [showForm, setShowForm] = useState(false);

  const activeCount = rules.filter((r) => r.status === "active").length;

  return (
    <>
      <Topbar
        title="Notification rules"
        description="Match decoded events against conditions and route them to channels"
      />

      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">{activeCount}</span> active ·{" "}
            {rules.length} total
          </p>
          <Button onClick={() => setShowForm((s) => !s)}>
            <Plus className="size-4" />
            New rule
          </Button>
        </div>

        {showForm ? (
          <NewRuleForm onClose={() => setShowForm(false)} />
        ) : null}

        <div className="grid gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    <StatusBadge
                      tone={rule.status === "active" ? "success" : "muted"}
                      label={rule.status}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rule.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="rounded-md border border-border bg-background px-2 py-1 text-muted-foreground">
                      {rule.chain}
                    </span>
                    <ChevronRight className="size-3 text-muted-foreground" />
                    <span className="rounded-md border border-border bg-background px-2 py-1 text-foreground">
                      {rule.eventSignature}
                    </span>
                    <ChevronRight className="size-3 text-muted-foreground" />
                    <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-primary">
                      {rule.condition}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      Channels:
                      <span className="flex items-center gap-1.5">
                        {rule.channels.map((c) => (
                          <span
                            key={c}
                            className="flex items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-foreground"
                          >
                            <ChannelIcon type={c} className="size-3" />
                            {channelLabels[c]}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span>
                      <span className="text-foreground">
                        {rule.triggered24h}
                      </span>{" "}
                      triggered (24h)
                    </span>
                    <span>Last: {timeAgo(rule.lastTriggered)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <span>{rule.status === "active" ? "On" : "Off"}</span>
                    <button
                      role="switch"
                      aria-checked={rule.status === "active"}
                      onClick={() => toggleRule(rule.id)}
                      className={
                        "relative h-5 w-9 rounded-full transition-colors " +
                        (rule.status === "active"
                          ? "bg-primary"
                          : "bg-secondary")
                      }
                    >
                      <span
                        className={
                          "absolute top-0.5 size-4 rounded-full bg-background transition-transform " +
                          (rule.status === "active"
                            ? "translate-x-4"
                            : "translate-x-0.5")
                        }
                      />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function NewRuleForm({ onClose }: { onClose: () => void }) {
  const channelOptions = Object.keys(channelIcons) as ChannelType[];
  const [selected, setSelected] = useState<ChannelType[]>(["webhook"]);

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Zap className="size-4" />
          </span>
          <h3 className="font-medium">New rule</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Rule name">
          <input
            placeholder="e.g. Large USDC transfers"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Contract / address">
          <input
            placeholder="0xA0b8…eB48"
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Event signature">
          <input
            placeholder="Transfer(address,address,uint256)"
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary/50"
          />
        </Field>
        <Field label="Condition">
          <input
            placeholder="value > 1,000,000"
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary/50"
          />
        </Field>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Deliver to
        </p>
        <div className="flex flex-wrap gap-2">
          {channelOptions.map((c) => {
            const active = selected.includes(c);
            return (
              <button
                key={c}
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(c)
                      ? prev.filter((x) => x !== c)
                      : [...prev, c]
                  )
                }
                className={
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs capitalize transition-colors " +
                  (active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground")
                }
              >
                <ChannelIcon type={c} className="size-3.5" />
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>Create rule</Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
