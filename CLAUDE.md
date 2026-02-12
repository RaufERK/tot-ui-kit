# tot-ui-kit

> Internal UI component library for the SberAnalytics platform.

## Overview

This is a shared React component library used across multiple applications in the project workspace. Each application has its own git repository, but they all use this common UI library through local file dependencies. It provides the common sidebar navigation menu and theming infrastructure. Layout is minimal - applications control their own header/footer content for maximum flexibility.

## Tech Stack

- **React 18** with TypeScript
- **CSS Modules** for styling
- **@sberbusiness/triplex-next** - design system components
- **Vite** for development/build (tsup for library bundling)

## Architecture

### Main Components

| Component | Purpose |
|-----------|---------|
| `Layout` | Main application wrapper with sidebar menu and content area |
| `ScMainMenu` | Smart menu component that fetches apps from backend API |
| `MainMenuBase` | Base menu component with full/compact layout support |
| `MainMenuFull` | Menu wrapper (extends MainMenuBase) |
| `UpperMenu` | Top header bar with title and user info (deprecated - use in app) |
| `PageLabel` | Page title/subtitle display (deprecated - use in app) |

### Icon System

Icons are embedded in the library (`src/assets/icons/index.tsx`) and mapped by `client_id` from backend data. The backend only provides the list of available apps - icons are resolved locally.

```typescript
// Icon mapping by client_id
const appIconMap = {
  dashboard: AppsGridIcon,
  users: UsersIcon,
  sc: DownloadsCenterIcon,
  // ...
}
```

### Theming

- Supports `light` and `dark` themes
- Theme persisted in localStorage
- CSS variables for colors
- Integrates with triplex-next theme system

## Data Flow

```
Backend API → ScMainMenu → MainMenuBase → UI
     ↓
  { client_id, app_name, link, order, available }
     ↓
  Library resolves icon by client_id
```

## File Structure

```
src/
├── assets/icons/         # SVG icons as React components
├── components/
│   ├── Layout/          # Main app layout (sidebar + content)
│   ├── MainMenu/        # Navigation menu
│   ├── UpperMenu/       # Top header (deprecated - use in apps)
│   └── PageLabel/       # Page title (deprecated - use in apps)
├── data/                # Mock data for development
└── index.ts             # Library exports
```

## Code Style Guidelines

1. **Destructure imports** - use `{ useState, useEffect }` not `React.useState`
2. **Destructure props in parameters** - `const Component = ({ prop1, prop2 }: Props) => {}`
3. **Functional components only** - no classes
4. **Named exports** for types, default exports for components
5. **CSS Modules** for component styles

## Usage Example

```tsx
import { Layout, useTheme, getCurrentTheme } from '@tot/ui-kit'
import '@tot/ui-kit/global.css'

const App = () => {
  // Get current theme with React hook (updates automatically)
  const currentTheme = useTheme()

  // Or get current theme synchronously
  const theme = getCurrentTheme() // 'light' | 'dark'

  return (
    <Layout
      menuProps={{
        baseUrl: 'https://api.example.com',
        menuId: 'menu-id',
        activeAppId: 'my-app',
      }}
    >
      {/* Add your own header/footer here if needed */}
      <header>My App Header</header>
      <main>
        <p>Current theme: {currentTheme}</p>
        <YourContent />
      </main>
      <footer>My App Footer</footer>
    </Layout>
  )
}
```

## Development

```bash
npm install
npm run dev      # Watch mode
npm run build    # Production build
npm run typecheck
```

## Recent Changes

- **12.12.2025**: Simplified `Layout` component - removed built-in header and footer for better flexibility. Apps now control their own header/footer content.
- **12.12.2025**: Removed border-radius from sidebar menu components for cleaner appearance.
- **12.12.2025**: Updated menu styles - removed main content padding, changed background color, added theme-aware hover states, increased vertical padding.
- **12.12.2025**: Added theme utilities - `getCurrentTheme()` function and `useTheme()` hook for apps to detect current theme.

## Notes for AI Assistants

- This library is consumed by multiple apps via `file:` links during development (each app has its own git repo)
- When modifying icons, update both `src/assets/icons/index.tsx` and `appIconMap` in ScMainMenu
- Mock data in `src/data/` is for development only
- The `icon` field from backend is deprecated - always use `client_id` for icon resolution
- `Layout` component no longer includes header/footer - apps must implement their own
- Build the library (`npm run build`) after changes to make them available to consuming apps





