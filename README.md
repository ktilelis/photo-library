# Photo Library [![CI](https://github.com/ktilelis/photo-library/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ktilelis/photo-library/actions/workflows/ci.yml)

An Angular 21 application that implements an infinite random photo stream with the ability to save photos to a persistent Favorites library.

This project was developed as a take-home assignment.

---

## Table of Contents

- [1. Getting Started](#1-getting-started)
- [2. Available Scripts](#2-available-scripts)
- [3. CI](#3-ci)
- [4. Docker](#4-docker)
- [5. Architecture Overview](#5-architecture-overview)
  - [5.1 Tech Stack](#51-tech-stack)
  - [5.2 Codebase Structure](#52-codebase-structure)
- [6. Implementation Details and Suggested Improvements](#6-implementation-details-and-suggested-improvements)
  - [6.1 Routing](#61-routing)
  - [6.2 HTTP API Emulation](#62-http-api-emulation)
  - [6.3 Persistence of Favorites](#63-persistence-of-favorites)
  - [6.4 Infinite Scrolling](#64-infinite-scrolling)
  - [6.5 Testing](#65-testing)

---

# 1. Getting Started

**Prerequisites**

- Angular CLI       : 21.x.x
- Node.js           : 24.x.x
- Package Manager   : npm 10.9.0

**Install Dependencies and start development server**

```bash
npm ci
npm start
```

Open:

```
http://localhost:4200/
```

---

# 2. Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build |
| `npm run watch` | Development build in watch mode |
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run lint:staged` | Lint staged files (git hooks) |

---

# 3. CI

CI is powered by GitHub Actions (`.github/workflows/ci.yml`).

Pipeline steps:

1. npm ci
2. npm run lint
3. npm run build
4. npm run test -- --watch=false

Triggered on:

- Push to `main`
- Pull request targeting `main`

---

# 4. Docker

The repository includes a multi-stage Docker build.
A production build of the application is built using Node 24 and deployed on NGINX.

**Base Images**

- Build stage: Node 24.13.1-alpine
- Runtime stage: nginxinc/nginx-unprivileged:alpine3.22
- Exposed port: 8080

**Build and run**

```bash
docker build -t photo-library:latest .
docker run --rm -p 8080:8080 photo-library:latest
```

Open:

```
http://localhost:8080/
```

---

# 5. Architecture Overview

## 5.1 Tech Stack

- Angular 21
- Typescript
- Angular Material
- RxJS
- SCSS
- Vitest
- ESLint + Prettier
- Husky + lint-staged
- Docker (multi-stage build with Node + unprivileged Nginx)
- GitHub Actions (CI)

---

## 5.2 Codebase Structure

The application follows a feature-based modular structure:

```
src/app/
  core/
    layout/          # App-level layout and navigation
    model/           # Domain models and error types
    notifications/   # UI notification services
    services/        # API + persistence services
    tokens/          # Dependency injection tokens
  features/
    photostream/     # Infinite scroll page
    favourites/      # Favorites page
    photo-detail/    # Single photo page
  shared/
    infinite-scroll-trigger/ # IntersectionObserver directive
    loader/          # Shared loading indicator
    message-area/    # Feedback UI
    photo-card/      # Reusable photo tile
    photo-grid/      # Grid layout component
```

**Structure Principles**

- **Core** contains singleton services and cross-cutting concerns.
- **Features** encapsulate route-level functionality.
- **Shared** contains reusable, presentation-focused components.

---

# 6. Implementation Details and Suggested Improvements

**Requirement Checklist**

| Requirement | Status | Notes |
|-------------|--------|-------|
| Header with Photos/Favorites buttons | Implemented | Header is always rendered in `App` shell. |
| Active view highlighted | Implemented [See Routing improvements Section](#61-routing) | Works for `/` and `/favorites`; detail route `/photos/:id` maps to the `Favorites` button. |
| Photos screen at `/` | Implemented | Uses route-level standalone component. |
| Click photo adds to favorites | Implemented | Photo tile click emits id and stores photo in favorites record. |
| Infinite scroll with loading indicator | Implemented | `IntersectionObserver` trigger and shared loader component are used. |
| Random photo source | Implemented | Uses seeded Picsum URLs (`https://picsum.photos/seed/.../200/300`). |
| API delay emulation (200-300ms) | Implemented | Delay is randomized in service (`Math.floor(Math.random() * 101) + 200`). |
| Favorites screen at `/favorites` | Implemented | Renders all favorite photos without infinite scrolling. |
| Clicking favorite opens single photo | Implemented | Navigates to `/photos/:id`. |
| Favorites persist after refresh | Implemented | Stored in `localStorage` (`photo-gallery-favourites`). |
| Single photo page at `/photos/:id` | Implemented | Displays one large image view. |
| Remove from favorites action | Implemented | Removes from storage and navigates back to `/favorites`. |
| Header remains on single photo page | Implemented | Header is outside route outlet in root layout. |

## 6.1 Routing

| Route | Description |
|-------|-------------|
| `/` | Infinite random photo stream |
| `/favorites` | Saved favorites list |
| `/photos/:id` | Single photo detail view |
| `**` | Redirects to `/` |

After removing a favorite photo the user is redirected to `/favorites`.

### Suggested Improvement

The Single Photo detail view is currently exposed under `/photos/:id`, but it can only be accessed from the **Favorites** screen.
The specification requires that the active view be highlighted in the header.

The detail route (/photos/:id) does not map directly to one of the two top-level navigation tabs (Photos / Favorites).
Since the detail page is accessed from the Favorites view in this application, the `Favorites` button is highlighted when navigating to `/photos/:id`.

## 6.2 HTTP API Emulation

`PhotosApiService` acts as a lightweight facade over the Picsum image service API.

Rather than calling a real backend, it generates deterministic, seeded image URLs (`picsum.photos/seed/...`) and emulates network behavior using RxJS.
Responses are intentionally delayed (200-300ms) to simulate real API latency and return typed domain models (`Photo`) or structured errors (`PhotoGalleryError`).

This abstraction isolates the application from the external image provider and keeps API-related logic centralized, testable, and replaceable.

### Suggested Improvement

- Introduce robust error handling. The current implementation is rudimentary and serves demonstration purposes.
- Handle future cross-cutting concerns like authorization tokens and generic HTTP errors in interceptors. In-service error handling should address business error states.
- Use Picsum's ```https://picsum.photos/v2/list``` pagination api.

---

## 6.3 Persistence of Favorites

- Favorites are stored in `localStorage` under the key:

```
photo-gallery-favourites
```

- The `FavoritesStorageService` acts as an injectable facade for localStorage.
- On application startup, persisted favorites are restored safely with JSON parsing guards.

---

## 6.4 Infinite Scrolling

- Infinite scroll is implemented using **IntersectionObserver**.
- A new batch of photos is fetched when the Photo Stream screen is first loaded and when the user scrolls to the end of the page.

### Suggested Improvement

- Introduce debouncing/throttling to better handle infinite scroll reactivity. This can be achieved using `concatMap`/`exhaustMap` RxJS operators.
- Investigate the use of [Angular Material virtual scrolling](https://material.angular.dev/cdk/scrolling/overview#creating-items-in-the-viewport) for better performance when loading a large number of photos.

---

## 6.5 Testing

- Currently only unit and integration tests have been implemented due to time constraints.

### Suggested Improvement

- Add E2E tests using Playwright or Cypress for increased coverage.
