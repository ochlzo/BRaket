"use client";

import { decrement, increment } from "@/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export function Counter() {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => dispatch(decrement())}
      >
        -
      </button>
      <span className="tabular-nums">{value}</span>
      <button
        type="button"
        className="rounded border px-2 py-1"
        onClick={() => dispatch(increment())}
      >
        +
      </button>
    </div>
  );
}

