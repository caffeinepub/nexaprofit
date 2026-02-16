# Specification

## Summary
**Goal:** Simplify the Investment Plans page to always show all plans with only plan-specific content, and add an authenticated “Start Invest” in-app investing flow.

**Planned changes:**
- Update the Investment Plans UI (PricingSection) to remove the “Show Related Plans” mode/state and always render the full list of plans in a consistent grid/list on `#/plans`.
- Adjust plan cards to display only plan-relevant fields: name, description, weekly return, risk level, minimum investment range, and AI narrative (`plan.aiNarrative`), removing the generic hard-coded marketing bullet list.
- Add a “Start Invest” button to each plan card and implement an in-app investing flow (modal or dedicated section) with steps to confirm plan, enter amount, review summary, and confirm.
- Gate the “Start Invest” flow behind existing Internet Identity authentication: if not signed in, open the existing sign-in dialog, then continue the flow for the selected plan without leaving `#/plans` (no edits to immutable auth hook files; integrate via existing editable components/props).

**User-visible outcome:** On `#/plans`, users see all investment plans at once with clean, plan-specific details, and can click “Start Invest” to complete a guided in-app invest flow; if not signed in, they’re prompted to sign in first and then can proceed.
