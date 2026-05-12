export function accountFieldClassName(error?: string) {
  return error
    ? "h-11 rounded-xl border-[color:var(--tone-red-base)] bg-white text-sm"
    : "h-11 rounded-xl border-[color:var(--line-strong)] bg-white text-sm";
}

export function accountTextareaClassName(error?: string) {
  return error
    ? "rounded-xl border-[color:var(--tone-red-base)] bg-white text-sm"
    : "rounded-xl border-[color:var(--line-strong)] bg-white text-sm";
}
