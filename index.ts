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
  if (typeof result === "object" && result !== null) {
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => {
        let enhancedValue = value;
        if (typeof value === "function") {
          enhancedValue = (...args: Parameters<typeof value>) => {
            const ret = value(...args);
            console.log(`${key} called`);
            return ret;
          };
        }
        return [key, enhancedValue];
      })
    ) as typeof result;
  }
  return result;
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
