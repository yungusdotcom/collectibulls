# Collectibulls — Accessibility & Security Audit
**Date:** March 3, 2026  
**Scope:** Full codebase review — CollectibullsApp.jsx, storage.js, usePersistedState.js, constants.js, globals.css, layout.js, next.config.js

---

## Security Audit

### What's Already Solid

**HTTP Security Headers** (next.config.js) — strong foundation in place:
- X-Content-Type-Options: nosniff — prevents MIME sniffing
- X-Frame-Options: DENY — blocks clickjacking
- X-XSS-Protection: 1; mode=block — legacy XSS filter
- Referrer-Policy: strict-origin-when-cross-origin — limits referrer leakage
- Permissions-Policy: camera/mic/geo all disabled
- Content-Security-Policy with frame-ancestors 'none'
- poweredByHeader: false — hides Next.js fingerprint

**Storage Security** (storage.js):
- Key sanitization strips non-alphanumeric characters
- 5MB max value size limit prevents storage bombing
- SSR-safe window checks (typeof window === "undefined")
- Storage prefix namespacing prevents key collisions
- Try/catch on all storage operations

### Issues Found

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| S1 | Medium | CSP allows 'unsafe-eval' and 'unsafe-inline' for scripts | next.config.js:18 |
| S2 | Medium | No input sanitization on form fields before storage | CollectibullsApp.jsx:572-574 |
| S3 | Low | JSON.parse on localStorage without schema validation | storage.js:17 |
| S4 | Low | Date.now() for transaction IDs is predictable | CollectibullsApp.jsx:574 |
| S5 | Info | No rate limiting on form submissions | CollectibullsApp.jsx:572 |
| S6 | Info | connect-src 'self' will need updating for eBay API | next.config.js:22 |

### Recommended Fixes

**S1 — CSP Tightening:** 'unsafe-eval' is required by Next.js in dev but should be removed or scoped in production. Add nonce-based script loading when feasible. For now, this is acceptable for a client-side app with no user-generated HTML rendering.

**S2 — Input Sanitization:** The form accepts raw text for card names and grades. While this data only renders in React (which auto-escapes JSX), it gets stored in localStorage as JSON. Add a sanitizer before storage:
```js
function sanitizeInput(str) {
  return str.replace(/[<>"'&]/g, '').trim().slice(0, 200);
}
```

**S3 — Schema Validation:** Add basic type checking after JSON.parse to ensure the data structure matches expectations before using it. If corrupted data is loaded, fall back to defaults.

**S4 — Better IDs:** Replace Date.now() with crypto.randomUUID() for unpredictable, collision-resistant IDs.

**S5 — Form Rate Limiting:** Add a simple debounce or cooldown on the submit handler to prevent accidental double-submissions.

**S6 — CSP for eBay:** When integrating the eBay API, add the eBay API domain to connect-src.

---

## Accessibility Audit

### What's Already Solid

**globals.css** has good foundations:
- focus-visible outlines (2px cyan) for keyboard users
- focus:not(:focus-visible) removes outlines for mouse users
- prefers-reduced-motion kills all animations
- .sr-only class available for screen reader text
- html lang="en" and dir="ltr" set in layout.js
- Font preconnects for performance
- BullLogo has aria-label and role="img"

### Issues Found

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| A1 | High | All SVG icons missing aria-hidden or aria-label | Throughout — TrendArrow, BuyIcon, SellIcon, TabIcon, etc. |
| A2 | High | Interactive elements missing accessible names | Buttons with only icons (notification bell, close, grid/list toggle) |
| A3 | High | Modal dialogs missing role="dialog", aria-modal, focus trap | Vault detail modal (line ~470), Trade form modal (line ~682) |
| A4 | High | Tab navigation not using proper ARIA tab pattern | Tab bar (line ~880) |
| A5 | Medium | Color contrast — text3 (#4A4D65) on darkest (#06060C) = 2.7:1 | Fails WCAG AA (needs 4.5:1 for small text) |
| A6 | Medium | Color contrast — green (#39FF14) on dark backgrounds | Neon green on dark passes for large text but may fail for 9px labels |
| A7 | Medium | Toggle switches missing role="switch" and aria-checked | ToggleSwitch component (line ~83) |
| A8 | Medium | Form labels not associated with inputs via htmlFor/id | Trade form (lines 700-709) |
| A9 | Medium | No skip-to-content link | layout.js |
| A10 | Low | Expandable transaction rows missing aria-expanded | Trade log (line ~644) |
| A11 | Low | Horizontal scroll areas not keyboard-navigable | Top movers, filter chips |
| A12 | Low | Font sizes below 12px throughout (7px-10px labels) | Multiple screens |
| A13 | Info | No aria-live regions for dynamic content updates | Portfolio value, P&L changes |

### Recommended Fixes

**A1 — Decorative SVGs:** Add aria-hidden="true" to all decorative icons. For icons that convey meaning (TrendArrow, BuyIcon, SellIcon), add an sr-only span next to them:
```jsx
const TrendArrow = ({ up, size = 12 }) => (
  <>
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none">
      {up ? <path d="M3 11L8 5L13 11" ... /> : <path d="M3 5L8 11L13 5" ... />}
    </svg>
    <span className="sr-only">{up ? "Trending up" : "Trending down"}</span>
  </>
);
```

**A2 — Button Labels:** Every icon-only button needs aria-label:
```jsx
// Notification bell
<button aria-label="Notifications" ...>
// Close button
<button aria-label="Close" onClick={...}>
// Grid/List toggle
<button aria-label="Grid view" aria-pressed={viewMode==="grid"} ...>
```

**A3 — Modal Focus Trap:** Both modals need:
- role="dialog" and aria-modal="true" on the modal container
- aria-labelledby pointing to the modal title
- Focus trap (trap focus inside modal when open, return focus on close)
- Escape key to close

**A4 — Tab Bar ARIA:** The bottom navigation should use:
```jsx
<nav aria-label="Main navigation">
  <div role="tablist">
    <button role="tab" aria-selected={isActive} aria-controls="panel-home" id="tab-home">
```

**A5 — Contrast Fix:** Bump text3 from #4A4D65 to #6B6E8A (4.5:1 ratio on #06060C). This maintains the subdued look while passing WCAG AA.

**A7 — Toggle ARIA:**
```jsx
<button role="switch" aria-checked={on} aria-label={label} onClick={onToggle}>
```

**A8 — Label Association:** Add id to inputs and htmlFor to labels:
```jsx
<label htmlFor="card-name" style={labelStyle}>CARD NAME</label>
<input id="card-name" value={formCard} ... />
```

**A9 — Skip Link:** Add to layout.js body:
```jsx
<a href="#main-content" className="sr-only" style={{ position: 'absolute', left: '-9999px', ':focus': { left: 0 } }}>
  Skip to main content
</a>
```

**A12 — Minimum Font Sizes:** WCAG doesn't mandate minimum sizes, but 7-8px labels are extremely small on mobile. Consider bumping the smallest labels from 7px to 10px minimum for usability.

**A13 — Live Regions:** Add aria-live="polite" to the portfolio value container so screen readers announce value changes.

---

## Priority Action Items

### Immediate (before public launch)
1. Fix modal focus traps and ARIA roles (A3)
2. Add aria-labels to all icon buttons (A2)
3. Add aria-hidden to decorative SVGs (A1)
4. Add input sanitization on form submissions (S2)
5. Fix tab bar ARIA pattern (A4)
6. Bump text3 contrast to pass WCAG AA (A5)

### Soon (next sprint)
7. Associate form labels with inputs (A8)
8. Add toggle switch ARIA (A7)
9. Replace Date.now() IDs with crypto.randomUUID() (S4)
10. Add schema validation to storage reads (S3)
11. Add skip-to-content link (A9)
12. Add aria-expanded to expandable rows (A10)

### Later (polish)
13. Add aria-live regions for dynamic values (A13)
14. Review minimum font sizes for mobile (A12)
15. Add form submission rate limiting (S5)
16. Prep CSP connect-src for eBay API (S6)

---

## Summary

**Security: B+** — Strong header config and storage practices. Needs input sanitization and schema validation before accepting real user data, especially ahead of eBay API integration.

**Accessibility: C** — Good CSS foundations (focus-visible, reduced-motion, sr-only) but the component layer is missing most ARIA attributes. Modals have no focus traps, buttons have no accessible names, and the tab pattern isn't semantic. The fixes are straightforward — mostly adding attributes to existing elements.

Neither category has any showstoppers, but the accessibility gaps need attention before this goes to a wider audience.
