# Los Santos Gaming

A fictional, GTA-inspired open-world gaming hub built with **HTML, CSS, and vanilla JavaScript**. This is an original fan-style demo; it does not use official GTA assets, logos, or game files.

## Features

- Responsive cinematic landing page with custom CSS city/car artwork
- Single-page navigation: Home, Games, Street Race, City Map, Shop, Profile
- Playable endless lane-dodging racing mini-game using Canvas
- Reflex Rush reaction-time challenge
- Memory Grid card-matching game
- City IQ trivia game
- Virtual shop with item ownership and wallet
- Player profile, XP/levels, achievements, local leaderboard
- LocalStorage persistence for profile, scores, cash, and owned items
- Mobile-friendly controls and layout

## Run it

1. Download and extract the project folder.
2. Open `index.html` in a modern browser.
3. Click **Street Race** or select a mini-game.

No package installation or build step is required. A local static server is optional; for example, in VS Code use the Live Server extension, or run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Folder structure

```text
los-santos-gaming/
├── index.html             # All page sections and dialogs
├── README.md              # Project overview and run instructions
├── css/
│   └── style.css          # Theme, components, responsive layout
├── js/
│   ├── app.js             # Navigation, shop, profile, map, persistence
│   ├── race.js            # Canvas-based arcade racing game
│   └── minigames.js       # Reflex, memory, and quiz game logic
└── assets/                # Optional local images, audio, and icons
```

## Technologies

- **HTML5** — semantic page structure and accessible controls
- **CSS3** — responsive layout, gradients, transitions, and custom artwork
- **JavaScript** — UI state, game rules, score calculations, and LocalStorage
- **Canvas 2D API** — drawing the road, player car, traffic, and collectibles
- **LocalStorage API** — saving demo progress in the current browser

There are no required external JavaScript libraries. Google Fonts are imported by CSS as a progressive enhancement; the site falls back to system fonts when offline.

## Important notes

- The leaderboard contains a few fictional sample players; it is not an online multiplayer leaderboard.
- LocalStorage is browser/device-specific and is not a secure account system.
- The shop uses virtual currency only. There are no real-money payments.
- The map is an illustrative fictional city grid, not a navigable geographic map.

## Suggested next upgrades

1. Add a sound toggle and original sound effects.
2. Add missions with objectives and unlockable cosmetic rewards.
3. Add a real map using original artwork or a permitted map library.
4. Use Firebase/Supabase for real accounts and cross-device leaderboards.
5. Split game modes into separate HTML pages if the project grows.
