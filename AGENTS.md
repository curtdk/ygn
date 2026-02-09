# AGENTS.md - Developer Guidelines for Coding Agents

This is a **Medusa v2 + Next.js 15** monorepo e-commerce project with two main components:
- `medushaV2/` - Backend commerce server (Medusa v2.13.1)
- `medushaV2-storefront/` - Frontend storefront (Next.js 15 with App Router)

## Build, Lint & Test Commands

### Storefront (medushaV2-storefront/)
```bash
# Development (runs on port 8000 with Turbopack)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Analyze bundle size
yarn analyze
```

### Backend (medushaV2/)
```bash
# Development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Run all unit tests
npm run test:unit

# Run integration tests (HTTP)
npm run test:integration:http

# Run integration tests (modules)
npm run test:integration:modules

# Run a single test file
TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules jest path/to/test.spec.ts --silent --runInBand --forceExit

# Run a single test by name pattern
TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules jest -t "test name pattern" --silent --runInBand --forceExit
```

## Project Structure

```
medushaV2-storefront/src/
├── app/                    # Next.js App Router pages (file-based routing)
├── lib/
│   ├── config/            # SDK and configuration
│   ├── data/              # Server Actions for data fetching/mutations
│   ├── util/              # Utility functions
│   ├── hooks/             # React hooks
│   └── context/           # React contexts
├── modules/               # Feature modules
│   └── [feature]/
│       ├── components/    # Feature-specific components
│       └── templates/     # Page templates
└── styles/               # Global styles (Tailwind)

medushaV2/src/
├── modules/              # Medusa modules (custom logic)
├── workflows/            # Medusa workflows
├── api/                  # API routes
├── scripts/             # Utility scripts (e.g., seeding)
└── [feature]/           # Custom features
```

## Code Style Guidelines

### Imports Organization
Order imports in this sequence:
1. React/Next.js core imports
2. External libraries
3. Internal imports using path aliases (`@lib/*`, `@modules/*`)
4. Type imports from `@medusajs/types` or local types
5. Relative imports (`./`, `../`)

```typescript
// Example
"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions } from "./cookies"
```

### Formatting (Prettier)
- **No semicolons** (`semi: false`)
- **Double quotes** (`singleQuote: false`)
- **Tab width**: 2 spaces
- **Arrow parens**: always
- **Trailing commas**: ES5 style
- Run `yarn lint` in storefront to check formatting

### TypeScript
- **Strict mode enabled** - all code must be type-safe
- Use explicit return types for exported functions
- Prefer `interface` for object types, `type` for unions/intersections
- Use `HttpTypes` from `@medusajs/types` for Medusa API types
- Enable decorators for backend code (`experimentalDecorators: true`)

### Naming Conventions
- **Files**: `kebab-case.tsx` or `kebab-case.ts`
- **Components**: `PascalCase` (e.g., `ProductCard`, `CartButton`)
- **Functions/variables**: `camelCase` (e.g., `retrieveCart`, `updateLineItem`)
- **Server Actions**: Prefix with action verb (e.g., `addToCart`, `deleteLineItem`)
- **Constants**: `SCREAMING_SNAKE_CASE` for true constants
- **Types/Interfaces**: `PascalCase` with descriptive suffix (e.g., `CartProps`, `ProductResponse`)
- **Test files**: `*.spec.ts` or `*.unit.spec.ts`

### Component Structure
```typescript
// Server Component (default in Next.js 15)
import { ComponentProps } from "./types"

export default async function ServerComponent({ prop }: ComponentProps) {
  const data = await fetchData()
  
  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}

// Client Component
"use client"

import { useState } from "react"

export function ClientComponent() {
  const [state, setState] = useState()
  
  return <div>Interactive content</div>
}

// Server Action
"use server"

export async function serverAction(data: DataType) {
  // Server-side logic
  revalidateTag("cache-tag")
}
```

### Error Handling
- Use try-catch for async operations
- Chain `.catch()` for Promise-based error handling
- Use custom `medusaError` utility for consistent error formatting
- Always handle errors gracefully with user-friendly messages
- Set error states in components for UI feedback

```typescript
// Example pattern
export async function updateCart(data: UpdateData) {
  try {
    const result = await sdk.store.cart.update(data)
    revalidateTag("carts")
    return result
  } catch (error) {
    throw medusaError(error)
  }
}

// In components
.catch((err) => {
  setError(err.message)
})
.finally(() => {
  setLoading(false)
})
```

### Styling
- Use **Tailwind CSS** utility classes
- Use `clx()` from `@medusajs/ui` for conditional classes
- Follow responsive breakpoints: `xsmall:`, `small:`, `medium:`, `large:`
- Prefer Medusa UI components for consistency (`@medusajs/ui`, `@medusajs/icons`)
- Keep inline styles minimal, use Tailwind classes

### State Management
- Use React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Manage loading states for async operations
- Handle error states with user feedback
- Use URL params for shareable state (e.g., variant selection)
- Cookie-based cart state (managed via Server Actions)

### Data Fetching (Storefront)
- Use **Server Actions** (`"use server"`) for all data mutations
- Use **Server Components** for initial data fetching
- SDK calls via `@medusajs/js-sdk`
- Implement cache revalidation with `revalidateTag()`
- Use auth headers from `getAuthHeaders()` for authenticated requests

```typescript
"use server"

export async function fetchData() {
  const headers = await getAuthHeaders()
  const next = await getCacheOptions("resource")
  
  return await sdk.client.fetch(endpoint, {
    headers,
    next,
    cache: "force-cache",
  })
}
```

### Testing (Backend)
- Use **Jest** with SWC transformer
- Test files in `__tests__/` directories
- Unit tests: `*.unit.spec.ts`
- Integration tests: `*.spec.ts`
- Mock external dependencies
- Test environment loads from `.env.test`

## Path Aliases (Storefront)
```typescript
"@lib/*"     → "src/lib/*"
"@modules/*" → "src/modules/*"
"@pages/*"   → "src/pages/*"
```

## Special Rules & Requirements

### B2C Homepage Design (.continue/rules/b2c.md)
When working on `**/page.tsx` or `**/home/**/*.tsx`, ensure homepage includes:
1. Hero banner with call-to-action buttons
2. Product category grid display
3. Featured/popular products showcase
4. Trust badges and services (free shipping, return policy, etc.)
5. Promotional banners or countdown timers
6. Newsletter subscription area
7. Responsive design and modern UI

## Important Notes for Agents

- **Next.js 15 App Router**: Use Server Components by default, add `"use client"` only when needed
- **React 19**: Async Server Components are standard
- **Medusa v2 SDK**: Use `@medusajs/js-sdk` for all API calls, not direct fetch
- **No Direct DB Access**: Always use Medusa API/SDK
- **Cache Management**: Always revalidate tags after mutations
- **Type Safety**: Import types from `@medusajs/types` (HttpTypes namespace)
- **Monorepo**: Run commands in correct directory (backend or storefront)
- **Package Managers**: Use `yarn` for storefront, `npm` for backend
- **Node Version**: Requires Node.js >=20

## Common Tasks

**Add new product to cart:**
```typescript
await sdk.store.cart.createLineItem(cartId, { variant_id, quantity }, {}, headers)
revalidateTag(await getCacheTag("carts"))
```

**Fetch products with filters:**
```typescript
await sdk.store.product.list({ limit: 20, fields: "*variants" }, headers)
```

**Handle authentication:**
```typescript
const headers = await getAuthHeaders()
// Use headers in all authenticated requests
```

**Create new Server Action:**
1. Add `"use server"` directive at top of file
2. Export async function
3. Handle errors with try-catch or .catch()
4. Revalidate cache tags after mutations
5. Return serializable data only

## Environment Setup
- Copy `.env.template` to `.env` in both directories
- Configure Medusa backend URL in storefront
- Set up database connection for backend
- Configure payment providers (Stripe, PayPal, etc.)
