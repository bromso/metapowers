# Common Accessibility Remediation Patterns

## Images & Non-text Content
- Add `alt` attribute to all `<img>` elements
- Decorative images: `alt=""` and `role="presentation"`
- Complex images: provide long description via `aria-describedby`
- SVG icons: `aria-hidden="true"` if decorative, `role="img"` with `<title>` if meaningful

## Color & Contrast
- Text on background: minimum 4.5:1 ratio (3:1 for large text >= 18pt or 14pt bold)
- UI components and graphics: minimum 3:1 ratio
- Don't rely on color alone — use icons, patterns, or text labels

## Keyboard Navigation
- All interactive elements must be focusable (`tabindex="0"` for custom elements)
- Focus order matches visual order (use DOM order, not CSS/JS reordering)
- Visible focus indicator on all interactive elements
- No keyboard traps — user can always Tab away
- Custom widgets: implement ARIA keyboard patterns (arrow keys for menus, Enter/Space for buttons)

## Forms & Input
- Every input has a visible `<label>` associated via `for`/`id`
- Required fields: `aria-required="true"` and visual indicator (not color alone)
- Error messages: `aria-describedby` linking error text to the input
- Error identification: describe what's wrong and how to fix it
- Group related inputs with `<fieldset>` and `<legend>`

## ARIA
- Prefer native HTML elements over ARIA (`<button>` over `<div role="button">`)
- Don't change native semantics (`<h2 role="tab">` is wrong)
- Interactive ARIA roles must be keyboard accessible
- Use `aria-live="polite"` for dynamic content updates
- Use `aria-expanded`, `aria-selected`, `aria-checked` for state communication

## Headings & Structure
- One `<h1>` per page
- Heading hierarchy: don't skip levels (h1 → h2 → h3, not h1 → h3)
- Use landmark regions: `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`
- Use `<ul>`/`<ol>` for lists, `<table>` for tabular data

## Motion & Animation
- Respect `prefers-reduced-motion` media query
- Provide pause/stop controls for auto-playing content
- No content flashes more than 3 times per second
