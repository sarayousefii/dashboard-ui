# Dashboard UI

Production-style Admin Dashboard built with Next.js App Router, TypeScript, React Query and Feature-Based Architecture.

## Features

* Authentication (Login / Logout)
* Route Protection with Middleware
* Role Based Access Control (RBAC)
* Products Management

  * List
  * Search
  * Sort
  * Pagination
  * Create
  * Edit
  * Delete
* Users Management

  * List
  * Search
  * Sort
  * Pagination
  * Create
  * Edit
  * Delete
  * Status Management
  * Role Management
* Dashboard Statistics
* URL State Synchronization
* Dynamic Metadata
* SSR Hydration with React Query
* Loading / Error / Empty States

## Tech Stack

* Next.js App Router
* TypeScript
* React Query
* Axios
* Zustand
* React Hook Form
* Zod
* TailwindCSS
* shadcn/ui

## Project Architecture

Feature-Based Architecture

features/

* auth
* products
* users
* dashboard

shared/

* components
* hooks
* lib
* types

## Installation

npm install

npm run dev

## Production Build

npm run build

npm start
