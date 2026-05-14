"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TalentBuVerificationIntro() {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <div className="space-y-7">
        <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="relative h-36 w-full max-w-56 sm:h-44">
              <Image
                alt="BU student ID verification"
                className="object-contain"
                fill
                priority
                src="/ID_svg.svg"
              />
            </div>
            <div className="rounded-full border border-[color:var(--line-strong)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)]">
              @bicol-u.edu.ph
            </div>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground">
            Verify your BU student status
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-[color:var(--ink-muted)] sm:text-base">
            Clients can only book listed talent after the app confirms a BU
            email and BU ID. Verification keeps services tied to real Bicol
            University students.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button className="h-10" size="lg" type="button">
            Verify now
          </Button>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Maybe Later
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Important Note</DialogTitle>
                <DialogDescription>
                  your sevices won&apos;t be listed if you are not a verified BU
                  student
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => router.push("/onboarding/talent?step=1")}
                  type="button"
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
