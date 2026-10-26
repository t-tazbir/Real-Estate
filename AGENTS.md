# ARCHFORM — Codex Project Notes

Read this file before editing the project. Keep future prompts short and use this file as the ongoing context. After completing a task, update **Project state** and **Pending work** briefly so the user does not have to explain the project again.

## Project basics
- Static architecture portfolio website using HTML, CSS, and vanilla JavaScript.
- Main files: `index.html`, `style.css`, `main.js`.
- Fonts: Inter via Google Fonts. Tailwind CDN is included in `index.html`, but most custom styling lives in `style.css`.
- Image assets are expected under `asset/img/`; check actual files before selecting image paths.
- Keep the current visual style: minimal, editorial, architecture-focused, black/white, large typography, generous whitespace.

## Current page structure
1. Hero (`.hero-stage`, `#home`)
2. Studio (`#studio`)
3. Selected Projects (`#projects`)
4. Services / “Crafting Form with Purpose” (`#services`)
5. Process / “From Vision to Reality” (`#process`)
6. Architectural image collection slider (`#collection-gallery`)
7. Journals (`#journals`)

## Required target order
1. Hero
2. Studio
3. Selected Projects
4. Services / “Crafting Form with Purpose”
5. Process / “From Vision to Reality”
6. Architectural image collection slider (`#collection-gallery`) directly after the process section

Move the existing whole `#process` section after the whole `#services` section; do not duplicate its content.

## Existing JavaScript behaviour to preserve
- Fixed header and mobile navigation; `main.js` appends the header and mobile panel to `document.body` to avoid stacking/overflow issues.
- Studio reveal animations, studio image parallax, and travelling “We” text.
- Selected Projects scroll shift.
- Services accordion (one item open at a time).
- Process stack progress updated by `updateProcessStack()` in the shared `requestAnimationFrame` scroll handler.

Do not break these features or replace unrelated site sections.

## Process section status / intent
- Four cards: `01 / Discovery & Vision`, `02 / Concept & Design`, `03 / Collaboration & Build`, `04 / Delivery & Impact`.
- Existing CSS uses sticky `.process-item` cards and long `.process-step` scroll areas. The current effect is subtle: `--process-progress` only shifts the item by about `-26px` and darkens an overlay. This is not yet the requested strong, visible parallax effect.
- Desired effect: each card fills the viewport and remains pinned; the next card visibly rises from below and covers it. Movement is tied to actual scroll progress and reverses when scrolling upward. Card, text/content, and image should have separate restrained parallax movement.
- Keep the reference composition: large number on the left, heading/description/image to the right on desktop; compact readable single-column layout on mobile. Preserve all existing process text and image sources unless asked otherwise.

## Collection slider requirements (not implemented in supplied snapshot)
- Add directly below the entire `#process` section after section order is corrected.
- Exactly five architectural images; inspect local assets first and use suitable local files where possible.
- Keep the gallery in a **centered, constrained-width container**, not full-viewport width. At a 1728px desktop viewport, the visual carousel should be roughly 1300px wide with generous white margins on both sides (use a responsive `width: min(...)` / `max-width`, not `width: 100vw`).
- Keep the gallery heading above the carousel: small `GALLERY` kicker, then a large centered `THE ARCFORM` / `COLLECTION` title split across exactly two lines. Place a black pill-shaped `VIEW ALL` button directly beneath the title, matching the existing black rounded buttons elsewhere on the site (white text, compact padding, fully rounded corners). Keep the title and button centered.
- Show **exactly three images at a time on desktop**: one large, sharp, dominant center image and smaller left/right previews. Center image is roughly square; side images are shorter/smaller. The left preview tilts slightly counter-clockwise, the right preview slightly clockwise. Apply a subtle gray/washed-out opacity to both side previews; keep the active image clear and in focus.
- Put white circular buttons with black arrow icons vertically centered at the **left and right edges of the active center image**, not at the far edges of the whole carousel.
- Next moves the right preview into the center; Previous moves the left preview into the center. Animate the image positions and active/inactive styling smoothly. Use all five images with infinite wrap-around in both directions; no autoplay.
- Images are display-only: **no anchor links, click navigation, lightbox, or captions**. Only Previous/Next buttons control the carousel.
- On mobile, keep the active image dominant and controls reachable; show side peeks only when space allows. Never make the overall page horizontally scrollable.


## Journals section — new implementation request
- Add a `#journals` section after the architectural collection gallery unless the current page structure has a more appropriate established location.
- Match the supplied JOURNALS reference: small `JOURNALS` kicker; large, left-aligned two-line title `BEYOND THE` / `BLUEPRINT`; black pill-shaped `VIEW ALL JOURNALS` button aligned to the right.
- On desktop show three clickable article cards in one row. Left and right images are tall/large; the center image is noticeably shorter. Keep clean white space, square-ish image edges, and the existing black/white editorial style.
- Under each image show article title on the left and published date on the right (month, day, year). On hover/focus, reveal a short article excerpt beneath the title/date, matching the supplied phone screenshots. Keep image crop with `object-fit: cover`.
- Use these reference article details if no existing journal content is available:
  1. `DESIGNING FOR TIMELESSNESS` — `AUG 23, 2025` — `Architecture should outlast trends. At Arcform Studio, we explore how strong forms, natural balance, and subtle elegance come together.`
  2. `SPACES THAT BREATHE` — `AUG 23, 2025` — `Architecture is more than walls and roofs—it's about creating spaces that inspire calm, connection, and a sense of belonging.`
  3. `THE SILENCE OF FORM` — `AUG 23, 2025` — `In a world overwhelmed by noise, architecture can offer serenity through restraint, clarity, and balance.`
- Make each article image/card clickable. Reuse existing internal journal destinations if they exist; otherwise keep each destination as a clearly editable local slug, not an invented external URL. `VIEW ALL JOURNALS` should link to the journals index if one exists, otherwise use a clearly editable local destination.
- Mobile: stack cards vertically, keep all titles/dates/excerpts readable, and make hover content available on keyboard focus and touch (do not require hover to read essential content). No horizontal page overflow.
- Preserve all existing sections/interactions. Scope new CSS and update this file after implementation.

## Working rules
- Before changing code, inspect the relevant existing HTML, CSS, and JavaScript.
- Make the smallest practical change and keep class names/styles scoped to the new component.
- Prefer vanilla JS and existing assets; do not add dependencies without a clear need.
- Respect `prefers-reduced-motion` and accessible button labels.
- Do not claim visual testing unless the page was actually run and inspected. If browser testing is unavailable, say so.
- After finishing, update this file with what changed, the current implementation status, and any remaining work. Keep this file concise.

## Project state
- `#process` follows the complete Services section; its four sticky cards use scroll-linked card, content, and image parallax.
- The five-image collection slider follows Process. It shows three images in a centered, constrained composition with side previews, circular controls, and infinite Previous/Next navigation. Its centered title is exactly `THE ARCFORM` / `COLLECTION`, with a `VIEW ALL` pill beneath.
- Journals follows the collection slider. It has the left-aligned `BEYOND THE` / `BLUEPRINT` heading, right-side `VIEW ALL JOURNALS` pill, and three clickable article cards. Left/right photos are taller than the center photo. Titles and dates appear under each image; excerpts reveal on hover/focus and remain visible on mobile.
- Journal destinations are editable local paths (`/journals/` and `/journals/<slug>/`); no journal detail/index pages currently exist in this static project.
- Article content: `DESIGNING FOR TIMELESSNESS` (AUG 23, 2025), “Architecture should outlast trends. At Arcform Studio, we explore how strong forms, natural balance, and subtle elegance come together.”; `SPACES THAT BREATHE` (AUG 23, 2025), “Architecture is more than walls and roofs—it's about creating spaces that inspire calm, connection, and a sense of belonging.”; `THE SILENCE OF FORM` (AUG 23, 2025), “In a world overwhelmed by noise, architecture can offer serenity through restraint, clarity, and balance.”

## Pending work
- Add real journal index and article pages if these local destinations should navigate to published content.
- Run visual browser checks at target desktop and phone viewport sizes when browser tooling is available. Static validation alone does not verify the visual layout.
