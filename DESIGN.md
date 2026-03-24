# Design System Strategy: The Editorial Sanctuary

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Atheneum"**
This design system is crafted to transform the chaotic process of world-building and literary creation into a serene, high-end editorial experience. We reject the "dashboard" aesthetic—cluttered with borders, heavy shadows, and dense grids—in favor of a "sanctuary" that feels like fine stationery or a premium architectural monograph.

Our goal is to break the "standard template" look through **intentional asymmetry** and **tonal depth**. By utilizing extreme breathing room (white space) and a sophisticated grayscale palette punctuated by a muted "Morning Mist" blue (`primary: #4c616c`), we guide the creator’s focus toward their ideas, not the interface. The UI should feel like it is receding into the background, appearing only when needed.

---

## 2. Colors: Tonal Atmosphere

The palette is rooted in atmospheric neutrals. We utilize subtle shifts in temperature and brightness to create structure without visual noise.

*   **Primary Identity:** The muted `primary` (#4c616c) and its container variations (`primary-container`: #cfe6f2) are used sparingly for focus points and subtle branding.
*   **The "No-Line" Rule:** To achieve a truly premium feel, **1px solid borders for sectioning are prohibited.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-lowest` card sits atop a `surface-container-low` section.
*   **Surface Hierarchy & Nesting:** Treat the interface as physical layers of high-grade paper:
    *   **Base Layer:** `surface` (#f8fafb) for the global background.
    *   **Level 1 (Sub-sections):** `surface-container-low` (#f0f4f6) for sidebar backgrounds or grouped content areas.
    *   **Level 2 (Active Focus):** `surface-container-lowest` (#ffffff) for the primary writing canvas or elevated cards.
*   **Signature Textures:** For primary call-to-actions, use a subtle linear gradient transitioning from `primary` (#4c616c) to `primary-dim` (#40555f) to provide a "soulful" depth that flat hex codes lack.

---

## 3. Typography: The Writer's Voice

We use a duo-font system to balance modern utility with editorial elegance.

*   **Display & Headlines (Manrope):** We utilize the geometric yet warm nature of Manrope for all structural elements. 
    *   **Display-LG (3.5rem):** Reserved for world titles or epic chapter headings.
    *   **Headline-SM (1.5rem):** Used for section headers (e.g., "Character Settings").
*   **Labels & Metadata (Inter):** For high-density information (tags, timestamps, word counts), Inter provides exceptional legibility at small scales (`label-sm`: 0.6875rem).
*   **Hierarchy through Scale:** Instead of bolding everything, use the typography scale to denote importance. A `title-lg` (1.375rem) in `on-surface` is more authoritative than a bold `body-md`.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "digital." This system uses ambient light and layering.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f0f4f6) section. This creates a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (like a dropdown or modal), use an ultra-diffused shadow:
    *   `blur: 40px`, `y: 8px`, `opacity: 4%`.
    *   **Shadow Tint:** Use a tinted version of `on-surface` (#2a3437) instead of pure black to maintain a professional, organic look.
*   **Glassmorphism:** For floating toolbars or side panels, use `surface-container-lowest` with 80% opacity and a `backdrop-filter: blur(12px)`. This allows the world-building content to subtly bleed through, integrating the UI into the workspace.
*   **Ghost Borders:** If accessibility requires a stroke, use `outline-variant` (#a9b4b7) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components: Refined Utility

### Buttons
*   **Primary:** Solid `primary` (#4c616c) with `on-primary` text. Use `rounded-md` (0.375rem).
*   **Secondary:** `surface-container-high` (#e1eaec) background. No border.
*   **Tertiary:** Ghost style. `on-surface-variant` text that shifts to `primary` on hover.

### Cards & Writing Areas
*   **No Dividers:** Forbid the use of divider lines between items in a list or sections in a card. 
*   **Negative Space:** Use `spacing-6` (2rem) or `spacing-8` (2.75rem) to create separation. Content grouping is achieved through proximity, not lines.

### Input Fields
*   **Refinement:** Text inputs should be "Underlined" style or "Ghost" style. 
*   **State:** Use `primary` for the active focus indicator (a 2px bottom bar) and `surface-container-low` for the inactive background.

### Literature-Specific Components
*   **Manuscript Cards:** Large white tiles (`surface-container-lowest`) with generous padding (`spacing-8`) to mimic the feel of a physical page.
*   **World-Tree Chips:** Using `secondary-container` (#d1e6f0) with `on-secondary-container` (#41545d) text for character tags or location labels.

---

## 6. Do's and Don'ts

### Do
*   **DO** use extreme white space. If a layout feels "empty," it is likely correct.
*   **DO** use asymmetrical layouts (e.g., a wide left column for writing and a narrow right column for world-notes) to break the "admin dashboard" feel.
*   **DO** use thin, 1.5px stroke weight for icons to match the "Manrope" typography.

### Don't
*   **DON'T** use pure black (#000000) for text. Always use `on-surface` (#2a3437) to maintain a soft, high-end contrast.
*   **DON'T** use 1px solid borders to separate the sidebar from the main content; use a background color shift from `surface-container-low` to `surface`.
*   **DON'T** use standard "blue" for links. Use the brand `primary` (#4c616c) for an authoritative, curated appearance.