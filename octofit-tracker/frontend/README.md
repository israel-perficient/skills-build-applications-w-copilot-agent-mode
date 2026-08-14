# Octofit Tracker Frontend

This React frontend connects to the Octofit Tracker backend API and uses the GitHub Codespaces preview host when available.

## Required environment variable

Set `VITE_CODESPACE_NAME` before running the frontend. For example, create a `.env.local` file in this folder with:

```bash
VITE_CODESPACE_NAME=my-codespace-name
```

If `VITE_CODESPACE_NAME` is not defined, the app falls back to `http://localhost:8000/api/...` instead of generating `https://undefined-8000...` URLs.

## API URL pattern

The frontend uses the following URL convention:

```text
https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

## Scripts

```bash
npm install
npm run dev
```
