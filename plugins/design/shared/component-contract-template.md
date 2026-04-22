# Component Contract: [Component Name]

## Purpose
[One sentence: what problem this component solves for the user]

## Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| | | | | |

## Variant Matrix
| Dimension | Values |
|-----------|--------|
| Size | sm, md, lg |
| Style | primary, secondary, ghost |
| State | default, hover, focus, active, disabled, error, loading |

Total combinations: [size x style x state]

## Slots / Composition
- [Named slots or children composition points]

## Token References
| Usage | Token | Fallback |
|-------|-------|----------|
| Background | `color.bg.[variant]` | — |
| Text | `color.text.[variant]` | — |
| Border | `color.border.[variant]` | — |
| Spacing | `spacing.[size]` | — |
| Border radius | `radius.[size]` | — |
| Typography | `type.[scale]` | — |

## Accessibility
- Keyboard interaction: [describe]
- ARIA role: [role]
- ARIA attributes: [list]
- Focus management: [describe]
- Screen reader announcement: [describe]

## i18n Considerations
- [Translatable strings]
- [RTL layout behavior]
- [Content expansion allowance]
