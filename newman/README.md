# JSONPlaceholder `/posts` API tests

Postman Collection (v2.1) + environment covering the `/posts` resource on
[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com), runnable
headlessly via Newman or interactively in the Postman UI.

## Files

| File | Purpose |
|------|---------|
| `jsonplaceholder-posts.postman_collection.json` | Collection: requests + `pm.test` assertions |
| `jsonplaceholder.postman_environment.json` | Environment: `baseUrl`, `existingPostId` |
| `results/` | Target for generated reports — git-ignored, only `.gitkeep` is committed |

## Run headless (Newman)

```bash
npm run test:api
```

which is equivalent to:

```bash
npx newman run newman/jsonplaceholder-posts.postman_collection.json \
  -e newman/jsonplaceholder.postman_environment.json
```

Optional JSON report (what CI does):

```bash
npm run test:api -- --reporters cli,json --reporter-json-export newman/results/newman-report.json
```

## Run in the Postman UI

Import both JSON files (File → Import), select the **JSONPlaceholder (public)**
environment, and run the collection with the Collection Runner.

## Coverage

| Request | What it proves |
|---------|----------------|
| `GET /posts` | Full seeded collection: 100 posts, unique ids 1..100, complete schema, authors within the 10 seeded users |
| `GET /posts/{{existingPostId}}` | Single read round-trips the requested id with a complete schema |
| `POST /posts` | Fake create: 201, echoes a per-run unique payload, assigns an id beyond the seeded range |
| `PUT /posts/{{existingPostId}}` | Fake full replace: 200, id stays stable, replacement document echoed with valid types |
| `DELETE /posts/{{existingPostId}}` | Fake delete: 200 with an empty object body |
| `GET /posts/999999` | Deterministic 404 with `{}` body for unknown ids |
| `GET /posts?userId=1` | Server-side filter returns exactly the author's 10 seeded posts and nobody else's |

## Design notes

- **Fake persistence, by design.** JSONPlaceholder simulates writes: POST/PUT/DELETE
  respond realistically but store nothing. All write-path assertions target the
  *response contract* (status, content type, echoed payload, id rules). No test
  re-reads the API expecting a write to have stuck, and no test depends on a
  previous request's side effects — each request stands alone.
- **Dynamic data where it pays off.** The POST payload is generated per run
  (timestamped title/body) so the echo assertions cannot pass against stale or
  hardcoded data. The PUT payload is static-but-distinctive on purpose: one
  dynamic example demonstrates the technique, a second would just cost readability.
- **Shared helpers.** A collection-level script defines `expectJsonContentType`
  and `expectPostShape`, used by every request — one place to update if the
  contract grows.
- **Variables.** `baseUrl` and `existingPostId` live in the environment, so the
  collection itself never hardcodes a host and can be pointed elsewhere.
