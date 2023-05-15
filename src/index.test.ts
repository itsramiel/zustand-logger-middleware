import { create } from "zustand";
import loggerImpl from ".";

const mockLoggerFn = jest.fn();
mockLoggerFn.mockName("mockLoggerFn ");

type State = {
  count: number;
  actions: {
    increment: () => void;
    add: (value: number) => void;
  };
};

const store = create<State>()(
  loggerImpl(
    (set) => ({
      count: 0,
      actions: {
        increment: () => set((prev) => ({ count: prev.count + 1 })),
        add: (value) => set((prev) => ({ count: prev.count + value })),
      },
    }),
    mockLoggerFn
  )
);

describe("loggerImpl", () => {
  beforeEach(() => {
    mockLoggerFn.mockClear();
  });

  test("callback function is called when the action is called", () => {
    store.getState().actions.increment();

    expect(mockLoggerFn.mock.calls).toHaveLength(1);
  });

  test("callback function is called with name and args when the action is called", () => {
    store.getState().actions.add(5);

    expect(mockLoggerFn).toHaveBeenCalledWith("add", [5]);
  });
});
