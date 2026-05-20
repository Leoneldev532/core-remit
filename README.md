# Core-Remit: International Remittance Service

# author : LEONEL YIMGA

A technical demonstration of a cross-border remittance flow built with Next.js 13 App Router. The project enforces strict SOLID principles with a highly modular architecture geared towards maintainability and scaling.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Installation
```bash
npm install --legacy-peer-deps
```

### Running the Application
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### Running the Tests
```bash
npm test
```

## 🏗️ Architecture & Strict Methodology

### 1. Hook as ViewModel (Kebab-Case Naming)
Every UI component in `components/` is purely declarative and handles only JSX rendering and translation labels.
All business logic, state orchestration, and side effects are encapsulated within custom hooks acting as ViewModels in `hooks/`.
- Example: `components/remittance-wizard.tsx` consumes `hooks/use-remittance-wizard-view-model.ts`.

### 2. Business Logic Layer (`logic/`)
Utility calculations (time formatting, receive amount computation) are extracted from components into a dedicated domain-specific `logic/` directory. All functions are documented with JSDoc.
- `logic/remittance-logic.ts`

### 3. API & Data Abstraction (`services/`, `query/`, `config/`)
Components **never** make direct API calls or define static data arrays inline.
- **`services/`**: Bridges API communications via the shared Axios instance. Each service method validates input using Zod schemas before transmission.
- **`query/`**: Manages React Query server-state queries and mutations with typed generics.
- **`config/`**: Contains externalized configuration arrays (`currencies.ts`), business policies (`policy.ts`), and constants (`constant.ts`).

### 4. Hybrid Routing Strategy
This project utilizes a hybrid routing strategy to navigate the limitations of Next.js 13.1.1:
- **App Router (`app/`)**: Used for the UI and layout, leveraging the experimental `appDir` feature.
- **Pages Router (`pages/api/`)**: Used for all API endpoints. Next.js 13.1.1 does not fully support Route Handlers (`route.ts`) in the `app/` directory as they were introduced in 13.2.

### 5. No Inline JSX Styles
Inline `style={{}}` or `<style jsx>` blocks are strictly forbidden. All styling relies on semantic classNames pointing to `styles/remittance.scss` or `styles/globals.scss`.

### 6. Internationalization (i18n)
Managed with the required `i18next` chain:
- **`i18next-chained-backend`** → **`i18next-localstorage-backend`** (7-day TTL cache) → **`i18next-http-backend`** (fetches from `/locales/`)
- Bundled resources (`resources` + `partialBundledLanguages: true`) guarantee instant rendering without flash of raw keys.
- Currency formatting: `Intl.NumberFormat(locale, { style: "currency", currency })` via `lib/utils/i18n-utils.ts`
- Date formatting: `Intl.DateTimeFormat(locale, { dateStyle, timeStyle })` via `lib/utils/i18n-utils.ts`
- Translation files: `public/locales/en/common.json` and `public/locales/fr/common.json`

### 7. Global Error Handling
A centralized Axios response interceptor (`config/axiosInstance.ts`) catches all HTTP errors globally:
- **4xx**: Logs specific warnings (401 Unauthorized, 403 Forbidden)
- **5xx**: Logs critical server errors
- **Network errors**: Detects offline/unreachable states
- All errors are still propagated via `Promise.reject` to allow component-level handling when needed.

### 8. Schema Validation
All API payloads are validated at the service layer with **Zod** (`schemas/remittance-schema.ts`) before network transmission, ensuring type-safe contracts between client and server.

## 📊 Metrics & Instrumentation

The application integrates `prom-client` to track funnel drop-offs:
- **Endpoint**: `GET /api/metrics` — Exposes Prometheus-formatted metrics
- **Endpoint**: `POST /api/metrics` — Increments the abandonment counter
- **Metric name**: `remittance_flow_abandonment_total`
- **Trigger**: When the 5-minute countdown expires at Step 2 without confirmation, the ViewModel calls `trackAbandonment()` which fires a React Query mutation to increment the counter.

## 🧪 Testing Strategy

Tests are written with `@testing-library/react` and `Jest`, focusing on business rules rather than implementation details.

| Test File | What It Covers |
|---|---|
| `__tests__/remittance-logic.test.ts` | Pure math: `calculateReceiveAmount`, `isQuoteExpired`, edge cases |
| `__tests__/use-remittance-wizard-view-model.test.tsx` | Full state machine: Step transitions, reset, **timer expiration** + `trackAbandonment` |
| `__tests__/remittance-quote-step.test.tsx` | Component rendering, amount updates, form submission, loading state |
| `__tests__/remittance-confirm-step.test.tsx` | Quote display, confirmation button behavior |

## 📁 Project Structure

```
core-remit/
├── app/                    # Next.js App Router (UI layer)
│   ├── layout.tsx          # Root layout with I18n + Providers
│   ├── page.tsx            # Main dashboard page
│   └── providers.tsx       # React Query + Jotai provider wrapper
├── components/             # Declarative UI components (no logic)
├── config/                 # External configuration (currencies, policies, axios)
├── hooks/                  # ViewModel hooks (business logic)
├── lib/                    # i18n setup, atoms, utility functions
├── logic/                  # Domain-specific business rules (JSDoc documented)
├── pages/api/              # Mock API endpoints (rates, quote, confirm, metrics)
├── public/locales/         # Translation JSON files (en, fr)
├── query/                  # React Query hooks (typed queries & mutations)
├── schemas/                # Zod validation schemas
├── services/               # API service layer (axios calls)
├── styles/                 # Sass stylesheets (globals, remittance)
├── types/                  # TypeScript type definitions
└── __tests__/              # Jest test suites
```

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 13.1.1 (App Router + Pages Router Hybrid) |
| UI | React 18.2.0, TypeScript |
| Server State | TanStack React Query v5 |
| Client State | Jotai (atomic state) |
| Validation | Zod |
| Styling | Sass (.scss) |
| i18n | react-i18next, i18next-chained-backend, i18next-http-backend, i18next-localstorage-backend |
| Metrics | prom-client |
| HTTP | Axios (with global error interceptor) |
| Testing | Jest, @testing-library/react |
