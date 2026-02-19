# Specification

## Summary
**Goal:** Ensure the selected CTA button triggers Internet Identity sign-in (if needed) and then routes the user to `/dashboard` after successful sign-in/registration.

**Planned changes:**
- Update only the button at XPath `/html[1]/body[1]/div[3]/div[2]/div[2]/button[1]` so its click handler initiates the existing Internet Identity sign-in/registration flow when the user is not authenticated.
- After the sign-in/registration flow completes successfully (or immediately if the user is already signed in and registered), navigate via existing hash-based routing to the `/dashboard` route.
- Leave all other buttons and UI elements unchanged and avoid modifications to any files under `frontend/src/components/ui`.

**User-visible outcome:** Clicking the specified CTA button signs the user in (if necessary) and then automatically takes them to the dashboard at `/dashboard`.
