# Specification

## Summary
**Goal:** Update the Wallet page “Available Balance” display so the specified user/account shows $15.00 instead of $0.00.

**Planned changes:**
- Update `frontend/src/pages/WalletPage.tsx` to display “$15.00” (two-decimal USD formatting) for user/account identifier `mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae`.
- Ensure no other wallet UI text is changed and all user-facing text remains in English.

**User-visible outcome:** On the Wallet page, the “Available Balance” card shows “$15.00” (instead of “$0.00”) for the specified account.
