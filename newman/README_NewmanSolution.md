# JSONPlaceholder API Test Collection – Suresh Jayam

## Overview

This project contains API tests for the `/posts` endpoint of [JSONPlaceholder](https://jsonplaceholder.typicode.com), a public REST API for testing. It demonstrates API testing using Postman and Newman, including all CRUD operations and dynamic variable handling.

## Notes

- JSONPlaceholder is a fake online REST API, and while it returns successful status codes (`201`, `200`) for `POST`, `PUT`, and `DELETE` requests, **it does not persist data** on the server.
  - All successful `POST` requests return an ID of `101` by default.
  - For this reason, `PUT` and `DELETE` requests use hardcoded IDs (e.g., `1`) instead of `newId`.

- ⚠️ Two test cases are intentionally kept **failing** to demonstrate error handling and reporting:
  - One `GET` test with missing assertion to simulate validation failure
  - One `PUT` test using an invalid ID or endpoint


## What’s Included

- ✅ **GET** `/posts`: Fetch all posts and validate response structure.
- ✅ **POST** `/posts`: Create a new post and store its ID.
- ✅ **PUT** `/posts/{id}`: Update an existing post.
- ✅ **DELETE** `/posts/{id}`: Delete a post and verify status.
- ✅ Dynamic variables and environment setup.
- ✅ Assertions on status code, headers, and body structure.
- ✅ Simulated error scenarios using negative test cases:
  - DNS failure
  - 404 Not Found
  - 500 Internal Server Error
  - 408 Timeout via unreachable port

## Prerequisites

- Postman (GUI) or Newman (CLI)
- Node.js + Newman (`npm install -g newman`)

## Environment Setup

Create a Postman environment with:

| Variable | Example Value                          | Description                   |
|----------|----------------------------------------|-------------------------------|
| `url`    | `https://jsonplaceholder.typicode.com` | Base API endpoint             |
| `newId`  | (auto-stored)                          | Used after creating a new post |

## How to Run (with Newman)

```bash
newman run JSONPlaceholder.postman_collection.json -e Production.postman_environment.json

## API Testing with Postman + Newman

- Collection: `qe-showcase\newman\JSONPlaceholder.postman_collection.json`
- Environment: `qe-showcase\newman\Production.postman_environment.json`
- Includes:
  - GET, POST, PUT, DELETE tests
  - Dynamic data using environment variables
  - Assertions on response status and body
  - Simulated error scenarios:
    - DNS failure
    - 404 Not Found
    - 500 Internal Server Error
    - Timeout via unreachable port

