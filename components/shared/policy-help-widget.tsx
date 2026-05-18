"use client";

import { ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const policyItems = [
  {
    title: "Privacy",
    text: "We collect only the account, profile, booking, review, media, and verification data needed to run BRaket.",
  },
  {
    title: "Terms",
    text: "Users are responsible for accurate profiles, lawful services, clear project scopes, and respectful platform use.",
  },
  {
    title: "Community",
    text: "Harassment, scams, impersonation, academic dishonesty, unsafe work, and abusive messages are not allowed.",
  },
  {
    title: "Talent Verification",
    text: "BU talent verification uses a confirmed BU email and submitted ID image for admin review only.",
  },
  {
    title: "Bookings",
    text: "Clients and talent should agree on scope, price, timeline, deliverables, revisions, and cancellation terms before work begins.",
  },
  {
    title: "Reviews",
    text: "Reviews should come from real completed bookings and must not include private information or retaliation.",
  },
  {
    title: "Data And Security",
    text: "Private documents should stay protected, access should be role-based, and users may request account or data help.",
  },
];

export function PolicyHelpWidget() {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--brand-blue)] text-xl font-bold text-white shadow-[var(--shadow-panel-elevated)] transition hover:bg-[color:var(--brand-blue-strong)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--brand-blue-soft)]"
              aria-label="View policies and regulations"
            />
          }
        >
          ?
        </TooltipTrigger>
        <TooltipContent>Policies and regulations</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[min(720px,calc(100vh-2rem))] overflow-y-auto border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-[color:var(--line)] px-5 py-4">
          <div className="flex items-center gap-3 pr-8">
            <span className="flex size-9 items-center justify-center rounded-full bg-[color:var(--brand-blue-soft)] text-[color:var(--brand-blue)]">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle>Policies And Regulations</DialogTitle>
              <DialogDescription>
                Simple BRaket guidelines for safe and fair platform use.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-3 px-5 py-4">
          {policyItems.map((item) => (
            <section
              className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-alt)] p-3"
              key={item.title}
            >
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[color:var(--ink-body)]">
                {item.text}
              </p>
            </section>
          ))}
        </div>
        <p className="border-t border-[color:var(--line)] px-5 py-3 text-xs leading-5 text-[color:var(--ink-muted)]">
          These are platform guidelines and should be reviewed with qualified
          legal guidance before launch.
        </p>
      </DialogContent>
    </Dialog>
  );
}
