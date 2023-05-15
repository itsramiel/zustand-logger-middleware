import { StateCreator } from "zustand";

type LoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  logger: (actionName: string, args: unknown[]) => void
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

export default loggerImpl;
