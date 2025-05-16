# Structure
```
/MyApp
│
├── api/              # API calls & axios setup (Raw Rest Data)
├── assets/           # Images, fonts, icons, etc.
├── components/       # Reusable UI components
├── constants/        # App-wide constants (colors, sizes, etc.)
├── hooks/            # Custom React hooks
├── i18n/             # Translations & localization setup
├── app/              # Pages + routes (Expo Router replaces /screens)
├── services/         # Firebase, notifications, other services
├── lib/              # Business logic (fetching, auth, data transformation)
├── utils/            # Utility functions
├── context/          # Global state providers (e.g., AuthContext)
├── types/            # Shared type provider , only use if you are creating a type to be used in a global way
│
├── App.tsx           # Main entry point (kept at root)
│
├── .env              # Environment variables
├── .eslintrc.js      # Linting rules
├── tsconfig.json     # TypeScript config
├── package.json
└── README.md

```

# Further Reading
[Expo Router Docs](https://docs.expo.dev/router/introduction/)