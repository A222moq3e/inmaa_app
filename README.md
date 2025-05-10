# Structure
```
/MyApp
│
├── api/              # API calls & axios setup
├── assets/           # Images, fonts, icons, etc.
├── components/       # Reusable UI components
├── constants/        # App-wide constants (colors, sizes, etc.)
├── hooks/            # Custom React hooks
├── i18n/             # Translations & localization setup
├── navigation/       # Navigation stacks and tabs
├── screens/          # All screens, grouped by feature
├── services/         # Firebase, notifications, other services
├── store/            # Zustand / Redux / Context state management
├── types/            # Global TypeScript types/interfaces
├── utils/            # Utility functions
│
├── App.tsx           # Main entry point (kept at root)
├── index.js          # React Native entry point (registers App)
│
├── .env              # Environment variables
├── .eslintrc.js      # Linting rules
├── tsconfig.json     # TypeScript config
├── package.json
└── README.md

```