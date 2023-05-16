import { StateCreator, StoreMutatorIdentifier } from "zustand";

type TLoggerFn = (actionName: string, args: unknown[]) => void;

type TLogger = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  logger?: TLoggerFn
) => StateCreator<T, Mps, Mcs>;

type TLoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  logger: TLoggerFn
) => StateCreator<T, [], []>;

const logger: TLoggerImpl = (config, logger) => (set, get, api) => {
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

export default logger as unknown as TLogger;
