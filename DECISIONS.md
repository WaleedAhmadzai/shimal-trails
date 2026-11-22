# Frontend decisions — Shimal Trails

Reference site: **FindMyAdventure** — <https://findmyadventure.pk/tours> and a tour page, <https://findmyadventure.pk/tours/fairy-meadows> (checked 22 Nov 2026).

---

## Decision 1 — Put comparison facts on every card, and make the list searchable and sortable

| Field | Entry |
| --- | --- |
| **Problem** | On the reference tours page, 25 cards show only location, duration, a "from" price and a short blurb. There is no search box and no sort, only five category chips. Difficulty, highest altitude, age suitability and dates are missing from the cards. For Fairy Meadows, the fitness requirement (a 7–9 hour hike at up to about 3,900 m) appears only in the FAQ section below the itinerary, far down the tour page. |
| **Decision** | Each card shows a 2×2 fact grid (duration, difficulty with text and a 3-dot scale, highest point, age limit), the next bookable date with seats left, and the per-person price. The list has a text search, type, difficulty and youngest-age filters, an "open dates only" option and five sort orders. All of them live in the URL so Back, refresh and shared links keep them. On a 390 px screen the cards stack in one column and the fact grid stays 2×2 so it is readable without zooming. |
| **Alternative** | Keep cards minimal (image, title, price) like the reference and show the facts only on the details page. |
| **Reason** | Our audience (students and young professionals planning a weekend) usually compares several trips and needs to rule out unsuitable ones quickly, for example a trek that a 12-year-old sibling cannot join. Showing the facts early reduces wasted clicks and wrong bookings, which supports the business goal of completed, suitable bookings. |
| **Tradeoff** | Cards are taller, so fewer fit on screen and mobile users scroll more. The data must always contain difficulty, altitude and age values for every trip. |
| **Code location** | `src/components/TripFacts.jsx` (`TripFacts`), `src/components/ExperienceCard.jsx` (`ExperienceCard`), `src/components/FilterBar.jsx`, `src/pages/ExperiencesPage.jsx` (`readCriteria`, `toSearchParams`), `src/utils/experienceQueries.js` (`filterExperiences`, `sortExperiences`, `suggestRelaxations`) |
| **Evidence** | 1) Open `/experiences`. 2) Set Difficulty to *Challenging* and type `16` in the age box: only the trips a 16-year-old can join remain. 3) Open a trip, press Back: the filters are still applied. Screenshot: report §6, "Trip list". |

**Type:** information hierarchy and mobile layout.

---

## Decision 2 — Show every departure with live seats and status before booking, and re-check saved choices

| Field | Entry |
| --- | --- |
| **Problem** | The reference site shows no departure dates or seat availability anywhere. The tour page says the starting price depends on dates and group size, and asks customers to enquire on WhatsApp or by form; the team "replies with availability" later. The season (June–September) is mentioned only inside the fourth paragraph of the description. |
| **Decision** | The details page lists every departure as a radio option with its date, how many days away it is, and its status in text: seats left, "Only 2 seats left", "Sold out" or "Booking closed". Closed and sold-out dates stay visible but disabled, rather than hidden. The traveller stepper shows the limit ("1 to 8 travellers per booking · 5 seats left on this date") and blocks invalid counts with a specific message. Saved plans are re-checked against current seats and dates every time they are shown, with one-click fixes. |
| **Alternative** | Hide unavailable departures, and only check seats once, when the customer submits the checkout form. |
| **Reason** | Customers learn whether a trip is possible before spending time on it, and the business does not lose them while they wait for a WhatsApp reply. Keeping closed dates visible explains *why* a date cannot be chosen (the 3-day cutoff) instead of making it disappear. |
| **Tradeoff** | More items on screen, and the app must keep listing, details and plan consistent with one source of data. Re-validating saved plans adds code (`getLineIssues`) and can surprise a returning customer with a conflict, so the message must be clear. |
| **Code location** | `src/components/DepartureOptions.jsx`, `src/components/BookingPanel.jsx` (`BookingPanel`), `src/rules/travellerLimit.js` (`checkTravellerCount`), `src/rules/bookingCutoff.js` (`getDepartureStatus`), `src/rules/planValidation.js` (`getLineIssues`), `src/hooks/usePlanDetails.js` |
| **Evidence** | 1) Open `/experiences/fairy-meadows`: three dates, one marked *Sold out*. 2) Type `6` travellers: "Only 5 seats are left on this date…". 3) Add 2 travellers, open `/demo`, click *Leave 1 seat on dates in my plan*, open `/plan`: the conflict appears with a *Change to 1 traveller* button. Screenshots: report §6 and §7. |

**Type:** interaction and state behaviour.

---

## Decision 3 — Calculate the full price, with priced extras, before anything is added

| Field | Entry |
| --- | --- |
| **Problem** | The reference price is "From Rs 45,000 per person" with a note that dates, group size and room sharing can change it. Items a trekker is likely to need (pony for the walk up, lunches, sleeping bag, extra nights from road closures) are listed under "Not included" about 2,700 px down the page, after the full itinerary, with no prices. The page has no way to see a total for a group. |
| **Decision** | Prices are fixed per person. Optional extras that the reference lists as "not included" are offered as priced add-ons. The booking panel shows a live breakdown (price × travellers, each extra × travellers, trip total) next to the controls, and states the only other charge (doorstep pickup, PKR 1,500) up front. The same `calculateLineCost` / `calculatePlanSummary` functions produce the numbers on the details page, plan page, checkout and confirmation. On mobile, a sticky bar keeps the total and the main button visible. |
| **Alternative** | Show a "from" price only and calculate the real total at checkout. |
| **Reason** | Students on a budget need the full cost before committing. Seeing a reliable total early reduces drop-off at checkout and enquiries that only ask "how much in total?". |
| **Tradeoff** | The business has to commit to fixed prices for extras, which is less flexible than quoting per group. The panel is longer, so the summary needs a sticky bar on mobile, which covers a little of the screen. |
| **Code location** | `src/rules/pricing.js` (`calculateLineCost`, `calculatePlanSummary`, `DOORSTEP_PICKUP_FEE`), `src/components/PriceBreakdown.jsx`, `src/components/PlanSummary.jsx`, `src/components/BookingPanel.jsx` (mobile bar) |
| **Evidence** | 1) Open `/experiences/fairy-meadows`, set 2 travellers, tick *Pony from Tato*. 2) The breakdown shows PKR 94,000 + PKR 8,000 = PKR 102,000. 3) Add to plan, go to checkout, choose doorstep pickup: total becomes 102,000 + 1,500 per trip. Screenshot: report §6. |

**Type:** information hierarchy (price visibility) and mobile layout.
