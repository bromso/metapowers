# Button Component Brief

## Context
Design system for a B2B SaaS product. The design system uses Tailwind-based tokens. The product supports English, German, Japanese, and Arabic (RTL).

## User Need
Users need a consistent, accessible button component that works across the product for primary actions, secondary actions, and destructive actions.

## Existing Patterns
- Currently using unstyled HTML buttons with inline styles
- No existing button component in the design system
- Icons are used inline with text in some buttons

## Design System Tokens Available
- Colors: `color.bg.primary`, `color.bg.secondary`, `color.bg.destructive`, `color.bg.ghost`, `color.text.on-primary`, `color.text.on-secondary`, `color.text.default`, `color.border.default`, `color.border.focus`
- Spacing: `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`
- Typography: `type.label.sm`, `type.label.md`, `type.label.lg`
- Radii: `radius.sm`, `radius.md`, `radius.full`
- Shadows: `shadow.focus-ring`

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Full keyboard navigation
- Screen reader support
- Reduced motion support
