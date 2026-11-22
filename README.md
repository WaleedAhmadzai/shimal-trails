# Shimal Trails — small-group trips from Islamabad

**CS4032 Web Programming · Assignment 02 · Fall 2026**
**Student:** Waleed Ahmadzai · **Roll no.:** 23I-2128 · **Section:** _[SECTION]_

- GitHub: _[paste your repository URL]_
- Live site: _[paste your deployment URL]_

## Description

Shimal Trails is a fictional tour operator based in Islamabad. It runs fixed-date, small-group day hikes, weekends, road trips and treks to northern Pakistan for university students and young professionals in Islamabad and Rawalpindi. The website lets a customer browse 12 trips, search and filter them, open a trip, choose a departure date, travellers and extras, keep a plan, fill in traveller and pickup details, review a calculated total and get a booking reference.

All bookings are **simulated**. There is no server, no payment and no message is sent. Personal details typed at checkout are not stored.

## Commands

Requires Node.js 20 or later.

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm test           # run the business-rule tests (node --test)
npm run lint       # oxlint
```

The test command runs `node --test`, which finds `src/rules/travellerLimit.test.js`. Expected result: `# tests 7 · # pass 7 · # fail 0`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: how booking works, trips leaving soon |
| `/experiences` | All trips with search, filters and sort (kept in the query string, e.g. `?q=hunza&difficulty=Easy`) |
| `/experiences/:experienceId` | Trip details, departure dates, travellers, extras, live price; invalid IDs show a helpful message |
| `/plan` | Selected trips: change date, travellers, extras; conflict checks; calculated summary |
| `/checkout` | Controlled form (name, mobile, email, youngest age, pickup, notes, policy) with validation |
| `/confirmation` | Booking reference and final summary |
| `/demo` | Demonstration controls for edge cases |
| `*` | Page not found |

## Features

- 12 trips loaded through an asynchronous mock loader with loading, failure and retry states
- Search, three filters, an open-dates toggle and five sort orders that work together
- Cards show duration, difficulty, highest point, age limit, next open date and seats
- Trip plan saved in localStorage and re-checked against current data on every visit
- Live price breakdown on the details page; the same functions calculate plan, checkout and confirmation totals
- Three operating rules (below) enforced in the interface and before completion
- Responsive at 390 px and 1280 px, keyboard accessible, visible focus, labelled inputs, text with every status colour

## Operating rules

| # | Category | Exact condition | Where the user is told | What happens | Boundary case |
| --- | --- | --- | --- | --- | --- |
| 1 | Capacity | 1 to 8 travellers per booking, and no more than the seats left on the chosen date | Under the traveller stepper ("1 to 8 travellers per booking · 5 seats left on this date"), footer | Specific message; Add/Update and checkout are blocked; plan offers "Change to N travellers" | 8 travellers with 20 seats → allowed; 9 → "One booking can include up to 8 travellers"; 5 of 5 seats → allowed, 6 → blocked |
| 2 | Eligibility | Youngest traveller's age ≥ the trip's minimum age (0, 8, 10, 12 or 16) | "Age limit" on every card and details page, info box in the booking panel, age filter on the list, hint under the checkout age field | Checkout shows which trips the age blocks and will not confirm | Fairy Meadows (16+): age 16 → allowed; age 15 → blocked |
| 3 | Fulfilment | Online booking closes 3 days before departure; doorstep pickup (PKR 1,500 per trip) only in listed Islamabad/Rawalpindi areas, meeting points free | Departure list status "Booking closed (online booking ends 3 days before departure)", price note, checkout pickup options | Closed dates cannot be selected; saved lines on a closed date block checkout until another date is chosen | Departure exactly 3 days away → bookable; 2 days away → closed |

Rule code: `src/rules/travellerLimit.js`, `src/rules/ageEligibility.js`, `src/rules/bookingCutoff.js`, `src/rules/pricing.js`.

## Reproducing edge cases

Open **`/demo`** (also linked in the footer). Settings are saved in localStorage and a yellow banner shows while any are active. *Reset all demo settings* returns to normal.

| Case | Steps |
| --- | --- |
| Loading failure + retry | `/demo` → *Fail once* → open `/experiences` → error shown → *Retry loading* works. *Always fail* keeps failing until turned off. |
| Loading state | `/demo` → *Slow network* |
| Empty dataset | `/demo` → *Empty dataset* → `/experiences` shows "No trips are published right now" |
| No search matches | `/experiences?q=hunza&difficulty=Challenging` → suggestions such as "Show every difficulty (1 trip)" |
| Invalid trip URL | `/experiences/hunza-trip` → "We couldn't find that trip" with suggestions |
| Unknown page | `/anything` |
| Seats sold since saved | Add a trip → `/demo` → *Leave 1 seat* or *Sell out dates in my plan* → `/plan` |
| Date closed since saved | Add Fairy Meadows on the date 5 days away → `/demo` → set *Pretend today is 3 days later* → `/plan` |
| Corrupted saved data | `/demo` → *Corrupt saved plan and reload* → plan resets with a notice |
| Invalid form input | `/checkout` → submit empty or with phone `12345`, age `15` with a 16+ trip; other fields keep their values |
| Missing image | Search `rawalpindi`: the food walk has no image and shows a labelled placeholder |

## Simulated operations and known limitations

- Bookings, payments, seat counts and pickups are simulated with local data. Seats do not decrease after a booking.
- Departure dates are stored as "days from today", so they always appear upcoming; the date shift in `/demo` simulates time passing.
- Personal details are validated but never stored or sent. The confirmation keeps only trip choices and totals.
- One line per trip in a plan (a trip cannot be booked on two dates in the same plan).
- No accounts, no real availability API, no email.

## Concept map

| Concept | File | Component / function |
| --- | --- | --- |
| Components, modules, imports/exports | `src/components/*`, `src/pages/*` | `ExperienceCard`, `BookingPanel`, `PlanItem`, … |
| Props | `src/components/ExperienceCard.jsx` | `experience`, `inPlan`, `listSearch` props |
| Callback props | `src/components/PlanItem.jsx`, `src/components/FilterBar.jsx` | `onUpdate`, `onRemove`, `onToggleAddOn`, `onChange` |
| Events, preventDefault | `src/pages/CheckoutPage.jsx`, `src/components/BookingPanel.jsx` | `handleSubmit`, `handleChange`, `handleBlur` |
| useState, controlled inputs | `src/pages/CheckoutPage.jsx`, `src/components/BookingPanel.jsx` | `form`, `travellersInput`, `departureId` |
| Functional updates | `src/context/PlanContext.jsx` | `setLines((prev) => …)` in `saveLine`, `updateLine`, `toggleAddOn` |
| Immutable object updates | `src/pages/CheckoutPage.jsx` | `setForm((prev) => ({ ...prev, [name]: value }))` |
| Immutable array updates | `src/context/PlanContext.jsx` | `saveLine`, `removeLine`, `restoreLine` (map / filter / spread) |
| Lists and keys | `src/pages/ExperiencesPage.jsx`, `src/components/DepartureOptions.jsx` | `key={experience.id}`, `key={departure.id}` |
| Conditional rendering | `src/components/DataGate.jsx`, `src/components/DepartureOptions.jsx` | loading / error / empty / unavailable states |
| Shared state (Context) | `src/context/DataContext.jsx`, `src/context/PlanContext.jsx` | `DataProvider`, `PlanProvider`, `useData`, `usePlan` |
| Derived values | `src/hooks/usePlanDetails.js`, `src/rules/pricing.js` | `usePlanDetails`, `calculatePlanSummary` |
| useEffect + cleanup | `src/context/DataContext.jsx` | fetch effect with `AbortController`, `controller.abort()` |
| useEffect for storage sync | `src/context/PlanContext.jsx` | `writeJSON(STORAGE_KEYS.plan, lines)` |
| Async code, failure handling | `src/services/mockApi.js` | `fetchExperiences` (async/await, throws), `.then/.catch` in `DataProvider` |
| Local storage | `src/services/storage.js` | `readJSON`, `writeJSON` |
| Routing, URL params, links | `src/App.jsx`, `src/pages/ExperienceDetailsPage.jsx`, `src/pages/ExperiencesPage.jsx` | `Routes`, `useParams`, `useSearchParams`, `Link`, `useNavigate` |
| Array methods, destructuring | `src/utils/experienceQueries.js` | `filterExperiences`, `sortExperiences`, `suggestRelaxations` |
| Business rules + test | `src/rules/travellerLimit.js`, `src/rules/travellerLimit.test.js` | `checkTravellerCount` |

## Deployment

The site is a single-page app. `vercel.json` (Vercel) and `public/_redirects` (Netlify) send every path to `index.html`, so refreshing `/experiences/fairy-meadows` or `/plan` works.

## Credits

All trip illustrations are original SVGs made for this project. No templates or UI kits are used; only `react-router-dom` is added to React.
