import { BadgeCheck, Pencil, Plus, Trash2, UserRound } from "lucide-react";

import {
  createManagedUserAction,
  deleteManagedUserAction,
  updateManagedUserAction,
} from "@/app/admin/_actions/manage-users-action";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { AdminManagedUser } from "@/server/admin/users-data";

type AdminUserManagementConsoleProps = {
  role: "client" | "talent";
  users: AdminManagedUser[];
};

export function AdminUserManagementConsole({
  role,
  users,
}: AdminUserManagementConsoleProps) {
  const isTalent = role === "talent";

  return (
    <div className="grid gap-5">
      <details className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]">
        <summary className="flex cursor-pointer items-center gap-3 text-sm font-black text-foreground">
          <Plus className="size-4 text-[color:var(--brand-orange)]" />
          Add {isTalent ? "talent" : "client"}
        </summary>
        <form action={createManagedUserAction} className="mt-5 grid gap-4">
          <input name="role" type="hidden" value={role} />
          <UserFields role={role} />
          <button className={primaryButtonClass} type="submit">
            <Plus className="size-4" />
            Create {isTalent ? "talent" : "client"}
          </button>
        </form>
      </details>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-6 py-12 text-center">
          <UserRound className="mx-auto size-8 text-[color:var(--ink-muted)]" />
          <p className="mt-3 text-lg font-bold">
            No {isTalent ? "talents" : "clients"} yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--ink-muted)]">
            Registered {isTalent ? "talent" : "client"} accounts will appear
            here once they exist in Braket.
          </p>
        </div>
      ) : null}

      {users.map((user) => (
        <article
          className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]"
          key={user.userId}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <UserAvatar
                alt={`${user.firstName} ${user.lastName}`}
                className="size-12 shrink-0"
                fallbackClassName="bg-[color:var(--surface-alt)] text-sm font-black text-[color:var(--ink-muted)]"
                imageClassName="object-cover"
                initials={user.initials}
                src={user.avatarUrl}
              />
              <div className="min-w-0">
                <h2 className="break-words text-lg font-black tracking-normal">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-1 break-words text-sm text-[color:var(--ink-muted)]">
                  {user.email}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{isTalent ? "Talent" : "Client"}</Badge>
                  {isTalent ? (
                    <Badge tone={user.isVerified ? "green" : "amber"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  ) : null}
                  <Badge>
                    {user.completedCommissionsCount}{" "}
                    {isTalent ? "commissions" : "services availed"}
                  </Badge>
                </div>
              </div>
            </div>

            <form action={deleteManagedUserAction}>
              <input name="userId" type="hidden" value={user.userId} />
              <button className={dangerButtonClass} type="submit">
                <Trash2 className="size-4" />
                Delete
              </button>
            </form>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Info label="Username" value={user.username || "Not set"} />
            <Info
              label={isTalent ? "Headline" : "Organization"}
              value={
                isTalent
                  ? user.headline || "Not provided"
                  : user.clientOrganizationName || "Not provided"
              }
            />
            <Info label="Contact" value={user.contactNum || "Not provided"} />
            <Info
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </dl>

          <details className="mt-5 rounded-xl bg-[color:var(--surface-alt)] p-4">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-black text-foreground">
              <Pencil className="size-4 text-[color:var(--brand-blue)]" />
              Edit account
            </summary>
            <form action={updateManagedUserAction} className="mt-4 grid gap-4">
              <input name="role" type="hidden" value={role} />
              <input name="userId" type="hidden" value={user.userId} />
              <UserFields role={role} user={user} />
              <button className={primaryButtonClass} type="submit">
                <BadgeCheck className="size-4" />
                Save changes
              </button>
            </form>
          </details>
        </article>
      ))}
    </div>
  );
}

function UserFields({
  role,
  user,
}: {
  role: "client" | "talent";
  user?: AdminManagedUser;
}) {
  const isTalent = role === "talent";

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="First name" name="firstName" required value={user?.firstName} />
        <Field label="Last name" name="lastName" required value={user?.lastName} />
        <Field label="Email" name="email" required type="email" value={user?.email} />
        <Field label="Contact number" name="contactNum" value={user?.contactNum} />
        <Field label="Username" name="username" value={user?.username} />
        <Field label="Website" name="website" type="url" value={user?.website} />
        <Field label="Address" name="address" value={user?.address} />
        {isTalent ? (
          <label className={labelClass}>
            <span className={labelTextClass}>Verified talent</span>
            <input
              className="size-5 rounded border-[color:var(--line-strong)]"
              defaultChecked={user?.isVerified}
              name="isVerified"
              type="checkbox"
            />
          </label>
        ) : null}
      </div>

      {isTalent ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Headline" name="headline" required value={user?.headline} />
          <Field label="College" name="college" required value={user?.college} />
          <Field label="Course" name="course" required value={user?.course} />
          <Field
            label="Year level"
            max={6}
            min={1}
            name="yearLevel"
            required
            type="number"
            value={user?.yearLevel?.toString()}
          />
          <Field label="BU email" name="buEmail" type="email" value={user?.buEmail} />
          <label className={`${labelClass} md:col-span-2 xl:col-span-4`}>
            <span className={labelTextClass}>Bio</span>
            <textarea
              className={`${inputClass} min-h-24 py-2`}
              defaultValue={user?.bio}
              maxLength={1200}
              name="bio"
              required
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Organization name"
            name="clientOrganizationName"
            required
            value={user?.clientOrganizationName}
          />
        </div>
      )}
    </>
  );
}

function Field({
  label,
  name,
  value,
  ...props
}: {
  label: string;
  name: string;
  value?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue">) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>{label}</span>
      <input
        className={inputClass}
        defaultValue={value}
        maxLength={160}
        name={name}
        {...props}
      />
    </label>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "amber" | "green";
}) {
  const toneClass =
    tone === "green"
      ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
      : tone === "amber"
        ? "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]"
        : "bg-[color:var(--surface-alt)] text-[color:var(--ink-muted)]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>
      {children}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-[color:var(--ink-body)]">
        {value}
      </dd>
    </div>
  );
}

const dangerButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-4 text-sm font-bold text-[color:var(--tone-red-deep)] transition hover:bg-[color:var(--tone-red-base)]/20";
const inputClass =
  "h-11 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 text-sm outline-none focus:border-[color:var(--brand-orange)]";
const labelClass = "grid gap-1.5 text-sm font-semibold text-foreground";
const labelTextClass =
  "text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]";
const primaryButtonClass =
  "inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-blue)] px-5 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]";
