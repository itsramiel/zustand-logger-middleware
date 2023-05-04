import { StateCreator, create } from "zustand";

type State = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

type LoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  logger: (actionName: string, args: unknown) => void
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (config, logger) => (set, get, api) => {
  const result = config(set, get, api);
  if (typeof result === "object" && result !== null) {
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => {
        let enhancedValue = value;
        if (typeof value === "function") {
          enhancedValue = (...args: Parameters<typeof value>) => {
            const ret = value(...args);
            logger(key, args);
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
  loggerImpl(
    (set) => ({
      count: 0,
      increment: () => set((state: State) => ({ count: state.count + 1 })),
      decrement: () => set((state: State) => ({ count: state.count - 1 })),
    }),
    (actionName, args) => {
      console.log(`${actionName} called with: ${args}`);
    }
  )
);
store.getState().increment();
console.log(store.getState());
