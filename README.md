[![CI](https://github.com/ktilelis/photo-library/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ktilelis/photo-library/actions/workflows/ci.yml)

# Photo Library

A modern Angular 21 photo browsing app with infinite scrolling, favourites management, and single-photo detail views.

## Features

- Infinite photo stream with lazy loading
- Favourite photos persisted in browser local storage
- Dedicated favourites page
- Photo detail page for favourite photos
- Standalone Angular components and route-level lazy loading
- Unit-tested components, directives, and services

## Tech Stack

- Angular 21 (standalone APIs, signals, lazy routes)
- Angular Material
- RxJS
- SCSS
- ESLint + Prettier
- Vitest (test assertions/mocks)
- Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js `24.13.1` (matches CI)
- npm `10.9.0` or compatible

### Install

```bash
npm ci
```

### Run the app

```bash
npm start
```

Open `http://localhost:4200/`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start development server (`ng serve`). |
| `npm run build` | Create production build output. |
| `npm run watch` | Development build in watch mode. |
| `npm run test` | Run unit tests. |
| `npm run lint` | Run ESLint for `src/**/*.ts` and `src/**/*.html`. |
| `npm run lint:staged` | Lint/format staged files (used by git hooks). |

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Main photo stream with infinite scroll loading. |
| `/favorites` | Saved favourite photos. |
| `/photos/:id` | Single photo detail page (for a favourite photo). |

## Project Structure

```text
src/app/
  core/
    layout/      # App-level layout components (navigation)
    model/       # Shared domain models
    services/    # API + local persistence services
    tokens/      # Dependency injection tokens
  features/
    photostream/ # Infinite stream page
    favourites/  # Favourites page
    photo-detail/# Single photo page
  shared/
    photo-card/  # Photo tile UI
    photo-grid/  # Reusable photo grid
    infinite-scroll-trigger/ # IntersectionObserver-based trigger
```

## Data & Persistence

- Photo data is generated from `https://picsum.photos/seed/...` URLs via `PhotosApiService`.
- Favourites are stored in local storage under the key `photo-gallery-favourites`.
- On startup, favourites are restored from local storage (with safe JSON parsing and validation).

## Testing

- Specs are colocated with implementation files as `*.spec.ts`.
- Test setup uses Angular `TestBed` and Vitest APIs (`describe`, `it`, `expect`, `vi`).

Run all tests:

```bash
npm run test
```

## CI

GitHub Actions runs on pushes and pull requests to `main` and executes:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run test -- --watch=false`

## Development Notes

- TypeScript path aliases are defined in `tsconfig.json`:
  - `@core/*` -> `src/app/core/*`
  - `@shared/*` -> `src/app/shared/*`
  - `@testing/*` -> `src/testing/*`
- Pre-commit checks are managed through Husky and lint-staged.
