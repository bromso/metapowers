# WCAG 2.1 Criteria for Component Design

## Color Contrast
- **AA Normal text (< 18pt):** 4.5:1 minimum
- **AA Large text (>= 18pt or 14pt bold):** 3:1 minimum
- **AAA Normal text:** 7:1 minimum
- **AAA Large text:** 4.5:1 minimum

## Non-text Contrast (AA)
- UI components and graphical objects: 3:1 against adjacent colors
- Focus indicators: 3:1 against adjacent non-focused state

## Interaction
- **Keyboard:** All functionality available via keyboard (2.1.1)
- **Focus visible:** Focus indicator visible on all interactive elements (2.4.7)
- **Focus order:** Logical tab order matching visual layout (2.4.3)
- **Target size:** Interactive targets minimum 24x24 CSS pixels (2.5.8, AA)

## Content
- **Text alternatives:** Non-text content has text alternatives (1.1.1)
- **Meaningful sequence:** Reading order matches visual order (1.3.2)
- **Resize text:** Content readable at 200% zoom without loss (1.4.4)
- **Reflow:** No horizontal scrolling at 320px viewport width (1.4.10)

## State Communication
- **Error identification:** Errors identified and described in text (3.3.1)
- **Labels:** Input fields have visible labels (3.3.2)
- **Status messages:** Status changes communicated to assistive tech via aria-live (4.1.3)

## Motion
- **Reduced motion:** Respect `prefers-reduced-motion` for animations (2.3.3)
