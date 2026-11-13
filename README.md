# Linden Shelf — Product Page

A single product page with an order sheet, built as a take-home assignment.

**Actual time spent:** ~4 hours

---

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- react-hook-form + zod
- Vitest + React Testing Library

**Package manager:** npm

**Node version:** 20.x (`node --version` → `v20.19.6`)

---

## Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Run tests

```bash
npm test
```

Three tests run entirely in-process (no server needed):

1. **Total** — Delivery + Assembly + Hardware kit shows `$275`
2. **Pickup clears Assembly** — switching to Pickup unchecks and disables Assembly; confirmation omits it
3. **Bonus** — submitting with no fulfillment shows "Choose pickup or delivery"

---

## Simulating API modes

Set the environment variable before starting the dev server:

```bash
# Normal (default)
npm run dev

# Slow — 2 s delay
PRODUCT_API_MODE=slow npm run dev

# Error — HTTP 500
PRODUCT_API_MODE=error npm run dev
```

---

## Data fetching approach

**Client-side fetch** in `app/page.tsx`.

The page is a client component that calls `GET /api/product` from `useEffect`. Loading and error states are managed with `useState`. This keeps the route handler simple and makes the loading/error UI straightforward to test without a server.

---

## Layout between 768px–1023px

The **mobile layout** (single column, full-width) is used for this range. At tablet widths the product information is readable at full width, and switching to a two-column layout at 768px would leave each column too narrow. The two-column grid kicks in at the `md:` breakpoint (768px) per Tailwind defaults, so reviewers will see the side-by-side layout from 768px up. The brief specifies the two extremes (375px and 1280px) and leaves the middle to judgement.

---

## AI tools

**Tool used:** Antigravity IDE for assisted coding 

**Used for:**
- Initial scaffold of `OrderDialog` component structure and form wiring
- CSS fixes for the dialog (mobile sheet layout, `max-h`, scroll overflow, selected-option highlight colours)
- Generating the Vitest config and test file stubs

**What was changed or discarded:**
- The AI added a dev toolbar (`API` pill strip at the bottom of the page) that is not part of the spec. It was removed from the submission build.
- The AI used `text-amber-500` and `text-black` on several elements that should inherit the default foreground colour. These were manually corrected.
- The generated tests used `.closest("div")` to scope the confirmation check — this was kept but the selector was verified against the actual DOM structure.
