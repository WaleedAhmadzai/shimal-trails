# UI refresh: changes from `assignment-3`

Branch: `ui-refresh` (1 commit on top of `assignment-3`: `style: brighter palette, pine green tertiary, cleaner UI`)

This branch changes **how the app looks, not how it works**. Routes, folder structure, props, Server/Client Component boundaries, `metadata`, `loading.tsx`, `not-found.tsx`, data, `lib/` logic and context providers are unchanged. Every requirement in the assignment PDF is met exactly as before.

## Goals

- Slightly more vibrant, using the same palette (paper, ink, glacier teal, Hunza apricot).
- Add **pine green** as the tertiary colour.
- Slightly cleaner UI: softer shadows, one card radius, less texture noise, clearer focus states.

## Design tokens (`app/globals.css`)

All colours still live in the single `@theme` block, so components only reference token names.

| Token | Before | After | Note |
| --- | --- | --- | --- |
| `paper` | `#f6f2eb` | `#f8f5ee` | lighter page background |
| `paper-2` | `#ede7dc` | `#efe9dc` | |
| `snow` | `#fffdf9` | `#fffefb` | |
| `ink` | `#0e1a17` | `#0c1d19` | slightly richer |
| `ink-2` | `#23302c` | `#22332e` | |
| `muted` | `#5b6460` | `#5a6561` | |
| `line` / `line-strong` | `#ddd4c5` / `#c9bfae` | `#e6dfd1` / `#cfc5b3` | lighter borders |
| `apricot` | `#c94f1b` | `#d4501a` | more vibrant |
| `apricot-bright` | `#e0612a` | `#f06a2c` | |
| `apricot-soft` | `#f9e2d3` | `#fde6d6` | |
| `apricot-deep` | (hard-coded `#b4461a`) | `#b8430f` | new token, button hover |
| `glacier` | `#2b6d67` | `#1f7f78` | more vibrant |
| `glacier-soft` | `#dcebe8` | `#d8f0ec` | |
| `glacier-bright` | none | `#2a9d93` | new, used in the footer accent bar |
| **`pine`** | none | `#1e6b45` | **new tertiary** |
| **`pine-bright`** | none | `#34a06a` | new, for use on dark backgrounds |
| **`pine-deep`** | none | `#123f2a` | new, footer, hover and dark sections |
| **`pine-soft`** | none | `#dcf1e4` | new, light tints and badges |
| `success` | `#1f7a4d` | `#1e6b45` | now matches `pine` |

Also in this file:

- Shadows (`shadow-soft`, `shadow-lift`) are softer and carry a faint green tint.
- Text selection colour is now pine.

## Where pine green appears

- **Brand:** logo mountain peaks, eyebrow rules above section headings, footer background and a three-colour top bar.
- **Actions:** "Build my itinerary" and the template buttons use the new `pine` button variant. Primary buttons now go pine-deep on hover, and outline buttons get a pine hover.
- **Forms and filters:** input, search and select focus rings are pine. Active filter chips, the family-friendly toggle and the budget-tier radio chips are pine.
- **Data:** season bar "best time" and "possible" months, and "easy" difficulty badges. The confirmation dialog tick and the "all checks passed" notice use `pine-soft`.
- **Layout moments:** region tiles, team avatars, the trip summary card, the "Itinerary" count pill, the About credits box, and the 404 page background.
- **Accent:** apricot stays the main accent for calls to action, the hero, and the favourite heart. Glacier stays the colour for info and charts.

## Cleaner UI

- Card radius unified: `rounded-[1.4rem]` and `rounded-[1.6rem]` are now `rounded-3xl` everywhere.
- Hard-coded hex colours in components (`#e1f0e6`, `#b4461a`) replaced with tokens.
- The topography texture was removed from the template cards (replaced with a thin gradient top bar) and toned down on the destinations header.
- Cards (templates, team) lift slightly on hover.
- Inputs: the search bar's heavy shadow is lighter, and focus shows a soft ring instead of just a darker border.
- The navbar has a lighter translucent background, and the active link underline is thicker.
- Destination cards use a pine-tinted image gradient, and the hover arrow is apricot.
- Home page: hero fades into pine-deep, the "planned" word is apricot, the planner section has a pine-deep gradient, and the closing CTA band has a soft pine tint.

## Component API changes

Both additions are optional, so existing usages are unaffected.

- `Button`: new `variant="pine"`.
- `Badge`: new `tone="pine"`. The `easy` tone now renders in pine.
- `LoadTemplateButton`: default variant is now `pine` (it was `primary`).

## Files changed (34)

- **Global:** `app/globals.css`, `app/layout.tsx` (theme colour only).
- **Pages:** `app/page.tsx`, `app/about/page.tsx`, `app/destinations/page.tsx`, `app/destinations/[slug]/page.tsx`, `app/itinerary/page.tsx`, `app/plan-trip/page.tsx`, `app/not-found.tsx`.
- **`components/common/`:** `Badge`, `Button`, `EmptyState`, `Logo`, `RegionTile`, `SectionHeading`, `SelectField`, `TeamCard`.
- **`components/layout/`:** `Footer`, `ItineraryCount`, `Navbar`.
- **`components/destinations/`:** `CardGridSkeleton`, `DestinationCard`, `DestinationFilters`, `FactGrid`, `SearchBar`, `SeasonBar`.
- **`components/forms/`:** `ConfirmationDialog`, `FormField`, `TripRequestForm`.
- **`components/itinerary/`:** `DayTimeline`, `ItineraryBuilder`, `LoadTemplateButton`, `TripSummary`, `WarningList`.

## Checks

On the same code, run locally:

- `npx tsc --noEmit`: no errors.
- `npx eslint .`: no errors.
- `npm test`: 29 tests pass.

Run `npm run build` once before submitting. It needs internet the first time because the fonts come from Google Fonts.

## Issue found while testing

Some elements (the "Build my itinerary" button, the region tiles and the footer) were invisible after the restyle: they use the new pine colours with white text, and the browser was still serving the old cached CSS, so the white text sat on a pale background. Stopping the dev server, deleting the `.next` folder, restarting with `npm run dev` and hard-refreshing (Ctrl+Shift+R) fixed it.

## Notes

- **Test count:** the main README says "28 unit tests", but there are 29. Update it when merging.
