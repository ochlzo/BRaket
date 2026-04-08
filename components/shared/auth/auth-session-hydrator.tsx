"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSession, type AuthSessionState } from "@/features/auth/authSlice";

export function AuthSessionHydrator({
  initialSession,
}: {
  initialSession: AuthSessionState;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSession(initialSession));
  }, [dispatch, initialSession]);

  return null;
}

