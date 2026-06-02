# AGENTS.md

Guidance for the AI agent (Pi, running on DeepSeek `deepseek-v4-pro`) in GitHub Actions.

## What this repo is

A static front-end web app built with **Vite 8 + React 19** (JavaScript/JSX). Source
lives in `src/` (entry point `src/main.jsx`, root component `src/App.jsx`), with static
assets in `public/` and `src/assets/`. `npm run build` produces a fully static bundle in
`dist/` that can be served from any static host.

Features arrive via pull requests you (the AI agent) open, triggered by a GitHub
Issue/comment (`/pi ...`) or the manual dispatch workflow.

## Coding rules

- Match the existing code style, structure, and naming already in the repo.
- Components are function components in `.jsx` files; use React hooks, not classes.
- Keep components small and focused; co-locate component styles where the repo already does.
- Keep changes minimal and scoped to the task; don't introduce new tooling unless asked.

## How to implement a task

1. Make the change by editing files in the working directory (mostly under `src/`).
2. Wire new components into `src/App.jsx` (or the appropriate parent) so they render.
3. If you add a runtime dependency, add it to `package.json` and run `npm install`.
4. Run `npm run build` and make sure it succeeds before finishing.

## Pull request rules

- **Never push to `main`.** The workflow branches, commits, and opens the PR.
- Keep the change scoped to the task; use a clear PR title and short description.
