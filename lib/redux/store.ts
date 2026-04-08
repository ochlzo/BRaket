import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "@/features/counter/counterSlice";

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

