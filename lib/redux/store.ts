import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "@/features/counter/counterSlice";
import { authSlice } from "@/features/auth/authSlice";

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  auth: authSlice.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
