# Specification

## Summary
**Goal:** Add an authenticated My Profile page that shows the signed-in user’s name, registered email, Internet Identity UID (principal), and a deterministic unique number.

**Planned changes:**
- Create a new protected route `/profile` that renders a My Profile page in the authenticated area.
- On the My Profile page, display clearly labeled fields for Name, Email, and UID (principal), using English placeholders (e.g., “Not set”) when values are missing.
- Add a backend query method in `backend/main.mo` that returns a stable, deterministic “Unique Number” derived from the caller principal, and show it on the My Profile page with an English error state if it fails to load.
- Add navigation to reach My Profile from the dashboard experience, and provide a way to navigate back to dashboard/home from the profile page.

**User-visible outcome:** Signed-in users can navigate to “My Profile” and view their Name, Email, UID (principal), and a stable Unique Number; signed-out users are blocked by existing protected-route behavior and prompted to sign in.
