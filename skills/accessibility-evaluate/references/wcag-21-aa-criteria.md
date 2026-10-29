# WCAG 2.1 Level AA Success Criteria

## 1. Perceivable

### 1.1 Text Alternatives
- **1.1.1 Non-text Content (A):** All non-text content has a text alternative

### 1.2 Time-based Media
- **1.2.1 Audio-only and Video-only (A):** Alternatives for prerecorded media
- **1.2.2 Captions (A):** Captions for prerecorded audio
- **1.2.3 Audio Description or Media Alternative (A):** Alternative for prerecorded video
- **1.2.4 Captions Live (AA):** Captions for live audio
- **1.2.5 Audio Description (AA):** Audio description for prerecorded video

### 1.3 Adaptable
- **1.3.1 Info and Relationships (A):** Information and relationships conveyed through presentation can be programmatically determined
- **1.3.2 Meaningful Sequence (A):** Content order is meaningful and programmatically determined
- **1.3.3 Sensory Characteristics (A):** Instructions don't rely solely on shape, size, visual location, orientation, or sound
- **1.3.4 Orientation (AA):** Content not restricted to a single display orientation
- **1.3.5 Identify Input Purpose (AA):** Input field purpose can be programmatically determined

### 1.4 Distinguishable
- **1.4.1 Use of Color (A):** Color is not the only visual means of conveying information
- **1.4.2 Audio Control (A):** Mechanism to pause or stop audio that plays automatically
- **1.4.3 Contrast Minimum (AA):** Text has contrast ratio of at least 4.5:1 (3:1 for large text)
- **1.4.4 Resize Text (AA):** Text can be resized up to 200% without loss of content
- **1.4.5 Images of Text (AA):** Text is used instead of images of text (with exceptions)
- **1.4.10 Reflow (AA):** Content reflows without two-dimensional scrolling at 320px width
- **1.4.11 Non-text Contrast (AA):** UI components and graphics have 3:1 contrast ratio
- **1.4.12 Text Spacing (AA):** No loss of content when text spacing is adjusted
- **1.4.13 Content on Hover or Focus (AA):** Additional content on hover/focus is dismissible, hoverable, persistent

## 2. Operable

### 2.1 Keyboard Accessible
- **2.1.1 Keyboard (A):** All functionality available via keyboard
- **2.1.2 No Keyboard Trap (A):** Keyboard focus can be moved away from any component
- **2.1.4 Character Key Shortcuts (A):** Single character key shortcuts can be turned off or remapped

### 2.2 Enough Time
- **2.2.1 Timing Adjustable (A):** Time limits can be turned off, adjusted, or extended
- **2.2.2 Pause, Stop, Hide (A):** Moving, blinking, scrolling content can be paused

### 2.3 Seizures and Physical Reactions
- **2.3.1 Three Flashes or Below Threshold (A):** Nothing flashes more than three times per second

### 2.4 Navigable
- **2.4.1 Bypass Blocks (A):** Skip navigation mechanism available
- **2.4.2 Page Titled (A):** Pages have descriptive titles
- **2.4.3 Focus Order (A):** Focus order is logical and meaningful
- **2.4.4 Link Purpose in Context (A):** Link purpose determinable from link text or context
- **2.4.5 Multiple Ways (AA):** More than one way to locate a page
- **2.4.6 Headings and Labels (AA):** Headings and labels are descriptive
- **2.4.7 Focus Visible (AA):** Keyboard focus indicator is visible

### 2.5 Input Modalities
- **2.5.1 Pointer Gestures (A):** Multi-point or path-based gestures have single-pointer alternatives
- **2.5.2 Pointer Cancellation (A):** Down-event doesn't trigger function (use up-event)
- **2.5.3 Label in Name (A):** Accessible name contains visible text
- **2.5.4 Motion Actuation (A):** Motion-triggered functions have UI alternatives

## 3. Understandable

### 3.1 Readable
- **3.1.1 Language of Page (A):** Default language is programmatically determined
- **3.1.2 Language of Parts (AA):** Language of passages can be programmatically determined

### 3.2 Predictable
- **3.2.1 On Focus (A):** Focus doesn't trigger unexpected context changes
- **3.2.2 On Input (A):** Input doesn't trigger unexpected context changes
- **3.2.3 Consistent Navigation (AA):** Navigation is consistent across pages
- **3.2.4 Consistent Identification (AA):** Components with same function are identified consistently

### 3.3 Input Assistance
- **3.3.1 Error Identification (A):** Errors are identified and described in text
- **3.3.2 Labels or Instructions (A):** Labels or instructions provided for input
- **3.3.3 Error Suggestion (AA):** Error messages suggest corrections
- **3.3.4 Error Prevention Legal/Financial/Data (AA):** Submissions are reversible, checked, or confirmed

## 4. Robust

### 4.1 Compatible
- **4.1.1 Parsing (A):** Deprecated in WCAG 2.2 but still relevant for older content
- **4.1.2 Name, Role, Value (A):** UI components have accessible name, role, and value
- **4.1.3 Status Messages (AA):** Status messages are programmatically determinable via ARIA live regions
