import { StateCreator, create } from "zustand";

type State = {
  count: number;
  actions: {
    increment: () => void;
    decrement: () => void;
  };
};

type LoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  logger: (actionName: string, args: unknown) => void
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (config, logger) => (set, get, api) => {
  const result = config(set, get, api);
  if (typeof result === "object" && result !== null) {
    let actions = result["actions"];
    if (actions && typeof actions === "object" && actions !== null) {
      actions = Object.fromEntries(
        Object.entries(actions).map(([actionName, actionFn]) => {
          let enhancedFn = actionFn;
          if (typeof actionFn === "function") {
            enhancedFn = (...args: unknown[]) => {
              const ret = actionFn(...args);
              logger(actionName, args);
              return ret;
            };
          }
          return [actionName, enhancedFn];
        })
      );
      result["actions"] = actions;
    }
  }
  return result;
};

const store = create<State>()(
  loggerImpl(
    (set) => ({
      count: 0,
      actions: {
        increment: () => set((state: State) => ({ count: state.count + 1 })),
        decrement: () => set((state: State) => ({ count: state.count - 1 })),
      },
    }),
    (actionName, args) => {
      console.log(`${actionName} called with: ${args}`);
    }
  )
);
store.getState().actions.increment();
console.log(store.getState());
