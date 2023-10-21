# openapi-client

this is a minimal typed request utility to interact with openapi-specified backends.

it uses
[openapi-typescript](https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-typescript)
for generating types, and is mostly copied from
[openapi-fetch](https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-fetch).

## how to install

```bash
npm install @stefanprobst/openapi-client
```

## how to use

first, generate types from an openapi document:

```bash
npx openapi-typescript https://my-backend.org/openapi.json -o ./types/api.ts
```

second, instantiate a typed api client:

```ts
import { createClient } from "@stefanprobst/openapi-client";

import type { paths } from "./types/api";

const client = createClient<paths>({ baseUrl: "http://localhost:3000" });
```
