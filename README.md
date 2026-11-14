# IT313_Ontario_Francismie_CampusNavigation

## Problem
Campus Connect is a campus events app. Students sign in, browse upcoming campus events, open event details, save events, and view their profile.

## Navigator structure
- `NavigationContainer` wraps the application.
- Root native stack: `Login` when signed out; `Main` (bottom tabs) and `EventDetails` when signed in.
- Bottom tabs inside `Main`: `Events`, `Saved`, and `Profile`.

## Route parameters
`RootStackParamList` defines `EventDetails` with `{ eventId: string }`. Event rows pass only the event ID. The details screen looks up the matching item in the events array.

## State and navigation
- The signed-in user and saved event IDs are held in `App` state.
- Saved tab badge shows the saved count and is hidden when the count is zero.
- `useFocusEffect` updates Last refreshed whenever Events receives focus.
- Both the header action and body button call the same save toggle function.
- Logging out clears the user and saved IDs; the root stack renders Login only.

## Run
1. Open this folder in VS Code.
2. Open Terminal > New Terminal.
3. Run `npm install`.
4. Run `npx expo start`.
5. Scan the QR code with Expo Go (phone and computer should use the same network).

If Expo reports package compatibility warnings, run `npx expo install --fix`, then restart using `npx expo start -c`.
