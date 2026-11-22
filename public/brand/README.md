# Official brand assets (required from the brand owner)

The official Codistack logo was not present in the project. Add these PNG files, then rebuild:

- `codistack-logo.png`      original logo artwork (unaltered)
- `codistack-logo-dark.png` optional: faithful transparent / light-wordmark variant for dark backgrounds
- `codistack-symbol.png`    optional: the angular C symbol alone (favicon + app icon)

The site detects them automatically (src/lib/brand.ts). Without them it shows a plain text label and never an invented logo.
