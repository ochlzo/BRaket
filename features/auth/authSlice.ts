import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthSessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
};

export type PendingSignupState = {
  email: string;
  firstName: string;
  lastName: string;
  userType: "client" | "talent";
} | null;

type AuthState = {
  session: AuthSessionState;
  pendingSignup: PendingSignupState;
};

const initialState: AuthState = {
  session: {
    accessToken: null,
    refreshToken: null,
    userId: null,
    email: null,
  },
  pendingSignup: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSessionState>) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = initialState.session;
    },
    setPendingSignup(state, action: PayloadAction<PendingSignupState>) {
      state.pendingSignup = action.payload;
    },
    clearPendingSignup(state) {
      state.pendingSignup = null;
    },
  },
});

export const { setSession, clearSession, setPendingSignup, clearPendingSignup } =
  authSlice.actions;

