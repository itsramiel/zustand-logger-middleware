## Middleware for zustand to log the name of the function called as well as its arguments

### Installation:

npm:
`npm install zustand-logger-middleware`
yarn:
`yarn add zustand-logger-middleware`

### Usage:

There is one prerequisite to using the middleware and that is to put all functions/actions inside `action` object of the zustand store.

For example if you have the following zustand store:

```
type State = {
  count: number;
  actions: {
    increment: () => void;
    add: (value: number) => void;
  };
};

const store = create<State>()(
  (set) => ({
    count: 0,
    actions: {
      increment: () => set((prev) => ({ count: prev.count + 1 })),
      add: (value) => set((prev) => ({ count: prev.count + value })),
    },
  }),
);
```

You can use the logger middleware by simply passing a function that accepts two parameters which are the name of function called and the arguments passed to it.

Taking the earlier example and building on it would give us:

```
const store = create<State>()(
  logger(
    (set) => ({
      count: 0,
      actions: {
        increment: () => set((prev) => ({ count: prev.count + 1 })),
        add: (value) => set((prev) => ({ count: prev.count + value })),
      },
    }),
    (fnName, fnArgs) => {
      console.log(`${fnName} called with ${fnArgs}`);
    }
  )
);
```
