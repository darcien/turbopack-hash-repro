# Turbopack loader gets truncated `resourcePath` when file path contains `#`

## Steps

```bash
npm install
npm run build           # fails
npm run build:control   # passes
```

For `next dev`, use `npm run dev` (page returns HTTP 500) and `npm run dev:control` (page returns HTTP 200).

The two modes use the same code. `next.config.ts` adds the loader rule only when the npm script name does not end with `:control`.

## Setup

- `app/page.tsx` imports `event-emitter`. `event-emitter` requires `d`. `d` requires `es5-ext/string/#/contains` (CommonJS). The app code has no `#`.
- `next.config.ts` adds one `turbopack.rules` entry: a no-op loader on the `es5-ext` files.
- `noop-loader.js` returns the source without change. It logs `resourcePath` and `resourceFragment` when `this.resource` contains `#`.

## Result (`npm run build`)

```
[noop-loader] {
  resourcePath: '<project>/node_modules/es5-ext/string/',
  resourceFragment: '#/contains/index.js'
}
Error: Turbopack build failed with ... errors:
...
An unexpected error happened while trying to read the source code to parse: reading file "<project>/node_modules/es5-ext/string"
Caused by:
- Is a directory (os error 21)
```

## Expected result

- `resourcePath` is `<project>/node_modules/es5-ext/string/#/contains/index.js`.
- `resourceFragment` is `''`.
- The build passes.

## Tested

`next@16.5.0-canary.9`, macOS arm64, Node.js 24.18.1, npm 11.16.0:

| Command | Loader rule | Result |
|---|---|---|
| `npm run build` | on | fails with the error above |
| `npm run build:control` | off | passes |
| `npm run dev`, then open `/` | on | HTTP 500 with the same error |
| `npm run dev:control`, then open `/` | off | HTTP 200 |

The CodeSandbox `dev` task first runs `npm install next@canary`. With `next@16.5.0-canary.12`, `npm run dev` also gives HTTP 500 with the same error.
