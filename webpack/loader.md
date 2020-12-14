# Loaders

Loaders are transformations that are applied to the source code of a module. They pre-process files as you import or “load” them.

## Loader Features

- Loaders can be chained. Executed in reverse order. The first loader passes its result to the next one, and so forth. Finally, webpack expects JavaScript to be returned by the last loader in the chain.

- Loaders can be synchronous or asynchronous.

- Loaders run in Node.js and can do everything that’s possible there.

- Loaders can be configured with an options object.

- Normal modules can export a `loader` in addition to the normal main via `package.json` with the `loader` field.

- Plugins can give loaders more features.

- Loaders can emit additional arbitrary files.

## Resolving Loaders

Loaders follow the standard module resolution. In most cases it will be loaded from the module path (think npm install, node_modules).

