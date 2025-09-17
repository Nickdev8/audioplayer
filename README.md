# Audioplayer: A Svelte-Powered Audio Experience

## Abstract

This repository contains the source code for a high-fidelity audio streaming web application. Engineered with a reactive frontend paradigm utilizing SvelteKit, the project demonstrates a sophisticated, modern web architecture. The application leverages server-side rendering (SSR) for optimal initial load performance, seamlessly transitioning into a dynamic, client-hydrated Single-Page Application (SPA) for a fluid user experience.

---

## Core Architecture

The application is built upon a meticulously chosen stack of technologies, ensuring robustness, scalability, and a superior developer experience.

*   **Framework**: **SvelteKit** forms the backbone of the application. Its file-system-based router, pre-rendering capabilities, and component-centric model allow for the rapid development of highly performant web interfaces.
*   **Database & ORM**: Persistence is handled by a relational SQLite database, orchestrated by **Drizzle ORM**. This combination provides the power of a type-safe, SQL-like query builder with the simplicity and speed of a file-based database via the `better-sqlite3` driver.
*   **Styling**: The user interface is crafted using **TailwindCSS**, a utility-first CSS framework that enables the implementation of complex and consistent design systems directly within the component markup.
*   **Language**: The entire codebase is written in **TypeScript**, enforcing strict type safety to minimize runtime errors and enhance code maintainability and scalability.

---

## Project Anatomy

The monolithic repository is structured with a clear separation of concerns, delineating the frontend, backend, and static asset domains.

*   `src/`: The nucleus of the application.
    *   `lib/server/`: Contains all backend-specific logic, including the Drizzle ORM database initialization (`index.ts`) and schema definitions (`schema.ts`). This is the heart of the data layer.
    *   `routes/`: Implements SvelteKit's file-system-based routing. Each directory and file within this folder corresponds to a specific URL endpoint, whether it's a renderable page or a JSON API.
*   `drizzle/`: Stores the auto-generated SQL migration files from `drizzle-kit`, providing a version-controlled history of the database schema.
*   `static/`: Serves all static assets, such as audio files (`/static/audio`) and cover art (`/static/images`), which are publicly accessible.

---

## Dependency Ecosystem

The project leverages the following NPM packages to facilitate its functionality.

### Production Dependencies
*   `better-sqlite3`

### Development Dependencies
*   `@sveltejs/adapter-auto`
*   `@sveltejs/adapter-static`
*   `@sveltejs/kit`
*   `@sveltejs/vite-plugin-svelte`
*   `@tailwindcss/typography`
*   `@tailwindcss/vite`
*   `@types/better-sqlite3`
*   `@types/node`
*   `dotenv`
*   `drizzle-kit`
*   `drizzle-orm`
*   `prettier`
*   `prettier-plugin-svelte`
*   `prettier-plugin-tailwindcss`
*   `svelte`
*   `svelte-check`
*   `tailwindcss`
*   `tsx`
*   `typescript`
*   `vite`

---

## Live Deployment

The application is currently deployed and accessible for live demonstration at the following URL:
[http://audio.nickesselman.nl/](http://audio.nickesselman.nl/)

<br>

> # ik heb iets meer gedaan dan alleen albums in een grid.
>
> hiervoor heb ik svelte gebruikt
