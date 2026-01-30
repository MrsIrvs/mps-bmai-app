# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server on localhost:8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite (SWC)
- **UI**: shadcn-ui components (in `src/components/ui/`) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL with Row-Level Security)
- **State**: React Context (AuthContext, AppContext) + TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6

## Architecture

### Authentication & Authorization

Three user roles with different access levels:
- **admin**: Full access to all features and buildings
- **technician**: Access to buildings in their assigned region
- **client**: Access only to specifically assigned buildings

Auth flow uses Supabase Auth. The `useAuth` hook (`src/hooks/useAuth.tsx`) provides:
- `user`, `session`, `profile`, `role` state
- `signIn`, `signUp`, `signOut` functions

Protected routes use `ProtectedRoute` component (`src/components/auth/ProtectedRoute.tsx`).

### Context Providers

Wrap order in `App.tsx`:
```
QueryClientProvider → TooltipProvider → AuthProvider → AppProvider → Routes
```

- **AuthProvider**: User authentication state and profile/role data
- **AppProvider** (`src/contexts/AppContext.tsx`): Selected building, buildings list, sidebar state

### Building-Scoped Data

Most features filter by `selectedBuilding` from AppContext. The sidebar includes a building selector dropdown that filters all page data.

### Database Tables (Supabase)

**Core Tables:**
- `profiles`: User profile data (user_id, email, full_name, buildings[], region)
- `user_roles`: Role assignments (user_id, role enum)
- `buildings`: Building records with `client_user_ids[]` for client access

**O&M Manual Tables:**
- `manuals`: Manual metadata (name, equipment_type, processing_status)
- `manual_sections`: Hierarchical TOC structure (parent_section_id for nesting)
- `manual_content`: Searchable content chunks with vector embeddings
- `manual_images`: Extracted diagrams/schematics with OCR text
- `manual_cross_references`: Links between sections
- `manual_search_logs`: Search analytics and feedback

### Path Aliases

TypeScript path alias `@/*` maps to `src/*`. Use imports like:
```typescript
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
```

## Key Patterns

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.tsx` wrapped with `ProtectedRoute`
3. Add navigation link in `src/components/layout/AppSidebar.tsx`

### Form Handling

Use React Hook Form with Zod schemas:
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
});
```

### Supabase Queries

Use the typed client from `src/integrations/supabase/client.ts`. Types are auto-generated in `src/integrations/supabase/types.ts`.

For manual-related operations, use the query functions in `src/lib/queries.ts`:
```typescript
import { getManualsByBuilding, searchManualContentKeyword } from '@/lib/queries';

// Get manuals for a building
const { data, error } = await getManualsByBuilding(buildingId);

// Search manual content
const { data: results } = await searchManualContentKeyword(buildingId, 'filter replacement');
```

The `executeQuery` wrapper provides consistent error handling:
```typescript
import { executeQuery, supabase } from '@/integrations/supabase/client';

const result = await executeQuery(
  supabase.from('manuals').select('*').eq('building_id', id)
);
```

### UI Components

shadcn-ui components are in `src/components/ui/`. Import from there:
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
```

## Manual Search Infrastructure

Two search modes are available via PostgreSQL functions:

- **Keyword Search**: Full-text search using `search_manual_content_keyword()`
- **Semantic Search**: Vector similarity using `search_manual_content()` (requires OpenAI embeddings)

Equipment types: `HVAC`, `Electrical`, `Fire`, `Plumbing`, `Hydraulic`, `Security`, `Lift`, `Other`

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[anon-key]
```

For semantic search (optional):
```
OPENAI_API_KEY=[api-key]  # For generating embeddings
```

See `.env.example` for full configuration options.
