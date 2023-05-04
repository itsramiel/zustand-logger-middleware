import { StateCreator, create } from "zustand";

type State = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

type LoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (config) => (set, get, api) => {
  const result = config(set, get, api);
  if (typeof result === "object" && result !== null && result !== undefined) {
    return Object.entries(result).reduce((acc, [key, value]) => {
      if (typeof value === "function") {
        acc[key] = () => {
          value();
          console.log(`${key} called`);
        };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {}) as any;
  } else {
    return result;
  }
};

const store = create<State>()(
  loggerImpl((set) => ({
    count: 0,
    increment: () => set((state: State) => ({ count: state.count + 1 })),
    decrement: () => set((state: State) => ({ count: state.count - 1 })),
  }))
);
store.getState().increment();
console.log(store.getState());
