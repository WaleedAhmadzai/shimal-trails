# Shimal Trails — Northern Pakistan trip planner

**CS4032 Web Programming · Assignment 3 · Fall 2026**
**Group:** G 03 · **Topic:** #17 Northern Pakistan trip planner

| Member | Roll no. |
| --- | --- |
| Waleed Ahmadzai | 23I-2128 |
| Ayesha | 24I-2077 |
| Umar Aziz | 23I-2022 |

- Repository: https://github.com/WaleedAhmadzai/shimal-trails/tree/assignment-3
- Live site (Vercel): _to be added_
- Video demo: _to be added_

## About the app

Shimal Trails helps you plan a realistic trip to northern Pakistan. Browse 18 destinations, filter them by the month you can travel, and build a day-by-day itinerary: the planner finds the route on real roads, splits long drives, checks seasonal pass closures and altitude gain, and prices the trip in PKR. When the plan is ready you can share it as a link or send it to a local operator for a quote (simulated).

This is a frontend-only project: all data is typed mock data in `data/`, and actions such as sending a request update React state and show a confirmation. Nothing is sent or stored on a server.

## How to run

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
npm test           # 30 unit tests for the itinerary engine, search and form rules (Vitest)
```

## Routes

| Route | What it shows | Rendering |
| --- | --- | --- |
| `/` | Hero with quick search, featured destinations, seasons, a live sample plan, ready-made itineraries, regions | Static (Server Component) |
| `/destinations` | All destinations with search, region / month / difficulty / trip-length filters, family toggle and 5 sort orders, kept in the URL | Server Component; results stream in a `<Suspense>` boundary |
| `/destinations/[slug]` | One destination: facts, 12-month season bar, road legs from Islamabad, prices per comfort level, tips, sources, nearby places | Static for all 18 slugs (`generateStaticParams`); unknown slug → `notFound()` |
| `/itinerary` | The itinerary builder: stops, nights, reorder, trip settings, day-by-day timeline, elevation profile, checks, cost, share link, print | Server shell + Client Component |
| `/plan-trip` | Trip request form with validation and a confirmation dialog | Server shell + Client Component |
| `/about` | Mission, safety advice, team, credits | Static |
| any unknown URL | Custom 404 page (`app/not-found.tsx`) | Static |

Also: `loading.tsx` for `/destinations` and `/destinations/[slug]`, `error.tsx`, `sitemap.xml`, `robots.txt`, and a `metadata` title and description on every page.

## Features

- **Itinerary engine** (`lib/itinerary/`): Dijkstra shortest route over a road graph of 36 towns, with Babusar, Khunjerab and Deosai closed outside their months; drive days capped at 9 hours with transit nights; cost estimate by comfort tier, group size and vehicle; warnings for closed destinations, closed passes, altitude jumps above 3,000 m, long road days, rushed plans and short notice.
- **Search that understands spellings**: "saiful muluk", "Saif ul Malook" and "saif-ul-malook" all find the lake.
- **Share link**: the whole plan in a short, readable URL, e.g. `/itinerary?plan=skardu:2,shigar-valley:1&start=2027-07-10&n=4&tier=standard&from=islamabad`.
- **Favourites** and **itinerary** saved in `localStorage`, validated on load.
- **Accessible**: skip link, labelled inputs, error summary with focus, `aria-live` updates, visible focus, keyboard reordering, reduced-motion support.

## Server and Client Components

All pages are Server Components. These are the Client Components and why each one needs `'use client'`:

| Component | Why it runs in the browser |
| --- | --- |
| `components/layout/Navbar.tsx` | Mobile menu open/close (`useState`, click events), scroll state, active link from `usePathname` |
| `components/layout/ItineraryCount.tsx` | Shows the live stop count from the itinerary store |
| `components/destinations/DestinationFilters.tsx` | Controlled search box with debounce (`useState`), change events, writes filters to the URL with `useRouter` |
| `components/destinations/SearchBar.tsx` | Controlled input with an `onChange` handler |
| `components/destinations/FavouriteButton.tsx` | Toggles a favourite on click |
| `components/itinerary/AddToItineraryButton.tsx` | Adds or removes a stop on click |
| `components/itinerary/LoadTemplateButton.tsx` | Loads a template on click and navigates |
| `components/itinerary/ItineraryBuilder.tsx` | The builder: steppers, reorder, settings, share, print; reads shared links with `useSearchParams` |
| `components/itinerary/DestinationPicker.tsx` | Search-as-you-type list (`useState`) |
| `components/forms/TripRequestForm.tsx` | Controlled form inputs, validation on blur and submit, simulated send |
| `components/forms/ConfirmationDialog.tsx` | Opens a native `<dialog>` from state |
| `context/ItineraryProvider.tsx`, `FavouritesProvider.tsx`, `ToastProvider.tsx` | Shared state with `useReducer` / `useSyncExternalStore`, `localStorage`, timers |
| `app/error.tsx` | Required by Next.js to be a Client Component (`reset()`) |

## Folder structure

```text
app/            routes, layout, loading, not-found, error, sitemap, robots
components/     common/, layout/, destinations/, itinerary/, forms/  (all typed props)
context/        ItineraryProvider, FavouritesProvider, ToastProvider
data/           destinations (18), regions, roads, pricing, templates, photos, team
lib/            destinations (queries), itinerary/ (roads, days, cost, warnings, share), validation, utils
types/          shared TypeScript types
assets/photos/  destination photos (Wikimedia Commons)
```

## Contribution

| Member | Pages | Components and logic |
| --- | --- | --- |
| Waleed Ahmadzai | _to be filled in_ | _to be filled in_ |
| Ayesha | Destinations listing (`/destinations`), destination detail (`/destinations/[slug]`), both `loading.tsx` files | DestinationCard, DestinationFilters, SearchBar, DestinationImage, FavouriteButton, SeasonBar, FactGrid, CardGridSkeleton; `data/destinations.ts`, `types/index.ts`, `lib/destinations.ts` (search, filter, sort); "Lowest altitude first" sort and its unit test; mobile menu fix in `Navbar.tsx` |
| Umar Aziz |Home (/), About (/about), not-found.tsx | Root layout.tsx; Navbar (with mobile toggle) and Footer using next/link; Button and SectionHeading; rebrand (name, colour palette, fonts, Tailwind theme tokens in globals.css); metadata export on every page; responsive pass at 375, 768 and 1280 px; README |

**Umar Aziz (member A, foundation and layout):** Owns the foundation of the app: the rebrand (name, colour palette, fonts and Tailwind theme tokens), the root layout.tsx with the shared Navbar (including the mobile toggle) and Footer using next/link, and the shared Button and SectionHeading components. Built the Home page with its hero section and featured destinations (using Ayesha's DestinationCard), the About page and not-found.tsx. Added the metadata export to every page and ran the responsive pass at 375, 768 and 1280 px across the whole app. Wrote the README. Presents the intro and the layout and routing walkthrough in the video.

**Ayesha (member B, discovery):** Owns the destinations side of the app: the listing page with search, filters and sort, the dynamic detail page with `notFound()` for unknown destinations and `generateMetadata` for per-page titles, the two `loading.tsx` files, the `Destination` type and the 18 destination records. Added the "Lowest altitude first" sort option with a unit test that checks the order, and fixed a mobile bug where the navbar's blur effect collapsed the menu's background to zero height, so the links showed over the page text on phones. Presents the discovery demo and code walkthrough in the video.

## AI tools used

- Claude (Anthropic), through Claude Code, was used for planning the architecture, writing and reviewing code, and drafting this README. Every member reviewed and can explain the code they present.

## Credits

Destination photos are from Wikimedia Commons under free licences; each is credited on its destination page with author, licence and link (see `data/photos.ts`). Altitudes, seasons and drive times are approximate and come from the public sources linked on each destination page. Prices are planning estimates from November 2026.

## Known limitations

- Mock data only; bookings are simulated and prices are estimates, not quotes.
- Drive times assume good weather; landslides and snow can close roads at short notice.
