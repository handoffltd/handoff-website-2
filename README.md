# Handoff Website

Handoff marketing website code.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

```bash
run.bat
```

OR

```bash
pnpm run dev
```

## Production Deploy

Deploys to Vercel using CI when code is pushed to the `main` branch.

## Known Issues

- When `isr: true`, page refresh fails when running locally. It works fine when deployed to Vercel.
