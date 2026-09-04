# AppSec Cadet Academy

A self-contained, beginner-friendly set of three AI application-security missions for SAINTCON 2026. Attendees secure the application surrounding a simulated AI assistant; no model API, internet connection, database, account, or API key is required.

## Missions

1. **The Overhelpful Helpdesk** — tenant-filtered retrieval / BOLA
2. **The Haunted Transmission** — stored XSS from unsafe model-output rendering
3. **The Rogue Quartermaster** — missing authorization in an AI tool call, with explorable customer orders, confirmation flow, and duplicate-refund tracking

Each mission follows the same loop: observe the failure, choose a repair, and rerun the original test. The helpdesk uses a simulated streaming chat response so it feels like a normal AI assistant while remaining completely deterministic. Completing all three awards the **AppSec Cadet** qualification.

## Run it

With Docker:

```sh
docker compose up --build
```

Open <http://localhost:8086>.

With Node.js 20 or later:

```sh
npm start
```

Open <http://localhost:8080>. There are no npm dependencies to install.

For quick local development, any static file server can serve the directory. ES modules mean opening `index.html` directly with a `file:` URL is not supported.

## Test it

```sh
npm test
```

The tests cover both the intentionally vulnerable and repaired behavior for each mission. The unsafe XSS preview executes only inside a sandboxed, opaque-origin iframe. All people, companies, credentials, orders, and records are fictional.

## Re-skinning

Event copy, the completion code, rank labels, color palette, and interaction timing live in [`js/config.js`](js/config.js). The `timing` values control the thinking pause, per-word streaming speed, and delay before evidence appears, making booth pacing easy to tune. Global typography, spacing, and component appearance use CSS custom properties at the top of [`assets/styles.css`](assets/styles.css). Replace [`assets/academy-hero.png`](assets/academy-hero.png) with another wide image while retaining the filename, or update the `.hero` rule to point elsewhere.

The challenge logic is isolated in [`js/challenges.js`](js/challenges.js), so visual changes do not need to touch vulnerability behavior.

## Deployment notes

- The included nginx configuration supports SPA routes and adds conservative response headers.
- Attendee progress is stored only in that browser's `localStorage`.
- Reset progress from the header between attendees on a shared station.
- If the parent lab stack will expose this project, add the directory as a build context and proxy it from the portal, or use port `8086` directly.
- This directory is intentionally independent and can be moved into its own GitHub repository without changes.

## Content map

```text
appsec-cadet-academy/
├── assets/             Visual theme and generated hero artwork
├── js/config.js        Event/rank/theme configuration
├── js/challenges.js    Deterministic vulnerable and fixed behavior
├── js/app.js           UI, routing, progression, and mission flow
├── test/               Node built-in tests
├── Dockerfile          Production nginx image
├── docker-compose.yml  One-command local deployment
├── FACILITATOR.md      Booth operation and teaching notes
└── index.html          Application shell
```

## Artwork

`assets/academy-hero.png` is original AI-generated artwork created for this project. Generation prompt:

> An original retro-futurist space academy command deck above a ringed planet, with three mission beacons; screen-printed 1970s science-fiction poster and restrained CRT aesthetics; midnight navy, cyan, teal, amber, coral; visual detail on the right and dark negative space on the left; no logos, lettering, copyrighted characters, or watermark.

Generated with OpenAI's built-in image-generation tool.
