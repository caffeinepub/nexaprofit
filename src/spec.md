# Specification

## Summary
**Goal:** Add a Dashboard button that navigates to a new Wallet hash route, and create a basic Wallet page with navigation back to the Dashboard.

**Planned changes:**
- Update only the user-selected Dashboard button so its visible label is exactly "Go to Wallet" and clicking it navigates to the Wallet hash route (e.g., #/wallet).
- Add a new "/wallet" hash route and render a new Wallet page component for it.
- On the Wallet page, display a clear "Wallet" title and provide a "Back to Dashboard" in-app navigation option.

**User-visible outcome:** Users can click "Go to Wallet" from the Dashboard to open the Wallet page, then use "Back to Dashboard" to return.
