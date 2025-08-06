# Westwoods Community Church Website

A modern, responsive website for Westwoods Community Church built with SvelteKit.

## Features

- Modern Svelte 5 syntax with runes
- Responsive design with CSS Grid
- Dark/light theme support
- Google Analytics integration
- Optimized images with Cloudinary
- Accessibility-focused components

## Google Analytics Setup

To enable Google Analytics tracking:

1. Create a Google Analytics 4 property in [Google Analytics](https://analytics.google.com/)
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Create a `.env` file in the project root and add:
   ```
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
4. Replace `G-XXXXXXXXXX` with your actual Measurement ID

The Google Analytics component will automatically track page views and can be extended for custom events.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
