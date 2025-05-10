# Alinma App - Project Structure

This document outlines the architecture and structure of the Alinma App project.

## Directory Structure

```
/src/
  /assets/            # Images, fonts, icons, etc.
  /components/        # Reusable UI components
    /ui/              # Base UI components (Button, Card, etc.)
    /navigation/      # Navigation-related components
  /screens/           # Full screen components
  /navigation/        # Navigation configuration
  /hooks/             # Custom React hooks
  /contexts/          # Context providers
  /services/          # API services
  /store/             # Global state management (if using Redux/Zustand)
  /utils/             # Utility functions
  /constants/         # App-wide constants
  /i18n/              # Internationalization
  /types/             # TypeScript type definitions
  /theme/             # Theme configuration
  App.tsx             # Main App component
```

## Core Concepts

### Navigation

The app uses a drawer navigation pattern built with React Navigation. The main navigation setup is in `/navigation/AppNavigator.tsx`.

### State Management

- **Context API**: Used for global state management through context providers in `/contexts/`.
- **Local State**: Component-level state is managed with React hooks.

### Theming

The app supports both light and dark mode through the ThemeContext, with theme definitions in `/theme/colors.ts`.

### API Integration

- API calls are made through service modules in `/services/`.
- The `apiClient.ts` provides a consistent interface for all API requests.

### Components

- **UI Components**: Base components in `/components/ui/` provide consistent styling and theming.
- **Screen Components**: Full screens are in `/screens/` and should ideally be composed of smaller components.

### Code Style

- PascalCase for components: `Button.tsx`, `ProfileScreen.tsx`
- camelCase for utilities and services: `formatDate.ts`, `authService.ts`
- Descriptive naming over abbreviations

## Best Practices

1. **Keep screens lean**: Move business logic to hooks or services.
2. **Component reusability**: Design components to be reusable where possible.
3. **Theme consistency**: Use the theme system for styling, avoid hardcoded colors.
4. **Type safety**: Enforce strong typing with TypeScript.
5. **Separation of concerns**: UI components should be purely presentational when possible.

## Getting Started

To start development:

```bash
npm install
npm start
```

For more detailed information, refer to the main project README. 