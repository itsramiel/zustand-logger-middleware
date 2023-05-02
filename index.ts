import { create } from "zustand";

type State = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

// type LoggerImpl = <T>(
//   storeInitializer: StateCreator<T, [], []>
// ) => StateCreator<T, [], []>;
//
// const loggerImpl: LoggerImpl = (config) => (set, get, api) => {
//   return config(set, get, api);
// };

const store = create<State>()((set) => ({
  count: 0,
  increment: () => set((state: State) => ({ count: state.count + 1 })),
  decrement: () => set((state: State) => ({ count: state.count - 1 })),
}));
store.getState().increment();
console.log(store.getState());
