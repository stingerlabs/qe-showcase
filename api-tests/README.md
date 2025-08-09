# API Tests (JSONPlaceholder – /posts)

This package contains automated API tests for the https://jsonplaceholder.typicode.com/posts endpoint.

Note: JSONPlaceholder is a fake API. Creation isn’t persisted, and returned IDs are synthetic (often 101).
To keep tests stable, we hardcode a safe ID (1) for PUT, PATCH, and DELETE.

## Install

From the repo root or this folder:

```
cd qe-showcase/api-tests
npm install
```

This installs:
newman (runner)
chai (assertions)
newman-reporter-htmlextra (optional HTML reports)

## Run locally

```
npm run test:posts
```

# Generate HTML report (collection-native run)

```
npm run test:posts:reports
```
HTML saved to: ./reports/posts.html

# Configuration

Environment file: environments/posts-env.postman_environment.json
Collection: collections/posts.postman_collection.json
Contains requests only (no Postman tests). All assertions live in tests/posts.test.js.
Test: tests/posts.test.js

