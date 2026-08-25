# Folder Structure

FAIR POS is a Next.js (App Router) project organised with a **feature-based structure** — sometimes called *feature-to-feature* — instead of grouping files by technical type.

This document only describes the **major folders**. Files inside a feature are the feature owner's business; the rules below are about where a folder goes, not how many files it has.

---

## 1. What "feature-to-feature" means

In a type-based structure you split code by *what a file is*:

```
components/   ← every component in the app
services/     ← every API call in the app
hooks/        ← every hook in the app
```

That works until the app grows. To change one thing (e.g. login) you end up editing four unrelated folders, and nobody can tell which files belong together.

In a **feature-based** structure you split code by *what a file is for*:

```
features/
├── auth/     ← everything login/register needs
└── menu/     ← everything the menu needs
```

Each feature is a self-contained slice: its own components, its own services, its own logic. A feature is deletable — remove the folder and only that capability disappears.

Two rules keep it honest:

1. **A feature never imports from another feature.** If `menu` needs something from `auth`, that something is not feature code — promote it to `src/lib`, `src/types`, `src/hooks`, or `src/components`.
2. **The route (**`src/app`**) is not the feature.** Routes are thin; they compose features.

Direction of imports (never the reverse):

```
src/app  →  src/features  →  src/components, src/hooks, src/lib, src/types
```

---



## 2. Major folders

```
fair_pos/
├── docs/            Project documentation (this file lives here)
├── public/          Static assets served as-is (images, icons, fonts)
└── src/
    ├── app/         Routes — URLs, layouts, and page shells only
    ├── components/  Shared UI used by more than one feature
    ├── features/    The actual product capabilities
    ├── hooks/       Shared React hooks (not tied to a feature)
    ├── lib/         Shared setup + helpers (Firebase, utils)
    ├── styles/      Global CSS and Tailwind entry
    └── types/       Shared TypeScript models/domain types
```

---



## 3. `src/app` — routing only

Everything in `src/app` maps to a **URL**. Nothing else belongs here: no business logic, no data fetching helpers, no reusable components.

```
src/app/
├── layout.tsx        Root layout — html/body, fonts, global providers
├── page.tsx          "/" landing page
├── (auth)/           Login, register, profile, password reset
├── (dashboard)/      Admin / owner overview
├── (financial)/      Sales reports, revenue, expenses
├── (kitchen)/        Kitchen order queue and ticket screens
└── (seller)/         Cashier / order-taking screens
```



### Folders in parentheses — route groups

`(auth)` is a **route group**. The parentheses mean the folder name is *not* part of the URL — it exists to group related routes and let them share a layout.

```
src/app/(auth)/login/page.tsx   →   /login        (not /(auth)/login)
src/app/(seller)/orders/page.tsx →  /orders
```

We use one group per user role, so each role can get its own layout (a seller sees the POS shell, the kitchen sees a full-screen queue) without polluting the URLs.

### File conventions inside a route folder


| File            | Purpose                                                      |
| --------------- | ------------------------------------------------------------ |
| `page.tsx`      | The page rendered at that URL. Keep it thin.                 |
| `layout.tsx`    | Shared shell (nav, sidebar) wrapping all pages below it.     |
| `loading.tsx`   | Skeleton shown while the page's data resolves.               |
| `error.tsx`     | Error boundary for that segment. Must be a client component. |
| `not-found.tsx` | 404 UI for that segment.                                     |




### What a page should look like

A page wires things together and stops there:

```tsx
// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return <LoginForm />;
}
```

If a page grows past composition — validation, Firebase calls, state machines — that logic belongs in `src/features`.

---



## 4. `src/features` — where the work happens

One folder per capability. Inside it, the same small set of sub-folders repeats, so any developer can guess the layout of a feature they have never opened.

```
src/features/
├── auth/
│   ├── components/   UI that only makes sense for auth (LoginForm, RegisterForm)
│   └── services/     Talking to the outside world (signIn, signOut, createUser)
└── menu/
    ├── components/   MenuList, MenuItemCard, MenuItemForm
    └── services/     fetchMenu, createMenuItem, updateMenuItem
```

Optional sub-folders, added only when a feature actually needs them:


| Sub-folder    | Holds                                              |
| ------------- | -------------------------------------------------- |
| `components/` | Feature-specific UI                                |
| `services/`   | Data access — Firebase/API reads and writes        |
| `hooks/`      | Feature state logic (`useLogin`, `useMenuFilters`) |
| `types/`      | Types used only inside the feature                 |
| `utils/`      | Pure helpers used only inside the feature          |




### Adding a new feature — the checklist

Say we add order handling:

1. Create `src/features/orders/`.
2. Add `services/` first — how does this feature read and write data?
3. Add `components/` — the UI that renders that data.
4. Add `hooks/` if the components need shared state.
5. Create the route: `src/app/(seller)/orders/page.tsx`, which imports from `@/features/orders` and does nothing else.
6. Anything the orders feature shares with another feature moves out to `src/components`, `src/hooks`, `src/lib`, or `src/types`.

---



## 5. `src/components` — shared UI

Only components used by **two or more features**, or by the app shell. If a component is used in one place, it belongs in that feature.

```
src/components/
├── ui/       Generic, unbranded building blocks — Button, Card, Input, Modal
└── shared/   App-specific composites — Navbar, Sidebar, PageHeader
```

The difference:

- `ui/` knows nothing about POS. `Card` renders children in a box. It takes props, has no data fetching, and could be copied into any other project.
- `shared/` knows about *this* app. `Navbar` knows our routes and the signed-in user, but is not owned by a single feature.

If you are unsure, start the component inside the feature. Promote it to `shared/` the second time someone needs it.

---



## 6. Supporting folders



### `src/lib`

Third-party setup and cross-cutting helpers.

```
src/lib/
├── firebase.ts   Firebase app, auth, and Firestore initialisation
└── utils.ts      Small generic helpers (class merging, formatters)
```

Features import the configured client from here — a feature never initialises Firebase itself.

### `src/types`

Domain models shared across features and routes.

```
src/types/
├── menu.ts    MenuItem, MenuCategory
└── order.ts   Order, OrderItem, OrderStatus
```

These describe the business, not the UI. Component prop types stay next to the component.

### `src/hooks`

Reusable hooks with no feature ownership — `useMediaQuery`, `useDebounce`, `useLocalStorage`. Feature-specific hooks stay in the feature.

### `src/styles`

`globals.css` — the Tailwind entry point, CSS variables, and base element styles. Everything else is Tailwind utilities in the components.

### `public`

Served at the site root, unprocessed. `public/logo.svg` is reachable at `/logo.svg`.

---



## 7. Quick decision guide


| You are writing…                             | It goes in…                          |
| -------------------------------------------- | ------------------------------------ |
| A new URL                                    | `src/app/(group)/route/page.tsx`     |
| A form, list, or screen for one capability   | `src/features/<feature>/components/` |
| A Firebase read/write                        | `src/features/<feature>/services/`   |
| A Button/Card/Input with no domain knowledge | `src/components/ui/`                 |
| A navbar or layout piece used app-wide       | `src/components/shared/`             |
| A type describing business data              | `src/types/`                         |
| Firebase config or a generic helper          | `src/lib/`                           |


Rule of thumb: **if two features want it, it moves up; if only one feature wants it, it stays down.**