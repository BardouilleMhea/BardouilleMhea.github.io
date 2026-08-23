# The Bardouille Collection — Fluid Edition

Personal site for **Mhea Bardouille**, built as a library card catalog: cream index cards
with red and blue ruled lines on a dark desk, dry academic humor, footnotes as the primary
comedic device. This is the motion-enhanced variant — cross-document view transitions,
springy card physics, fluid `clamp()` type — of the original `mhea-bardouille-site`.

Plain HTML + CSS + one small vanilla JS file. **No build step, no dependencies, no
framework.** Works with JavaScript disabled (the cards are simply cards).

---

## 1. What's in the box

| File | What it is |
|---|---|
| `index.html` | Homepage — drawer 1. Name card + three routing cards. Card 1 flips over. |
| `projects.html` | Card 2's destination — the project catalog, one index card per project, searchable. |
| `recruiter.html` | Card 3's destination — the responsible version (abstract, CV, skills, publications, contact). |
| `404.html` | "This card was checked out and never returned." GitHub Pages serves it automatically. |
| `styles.css` | The whole design system. Organized in layers — see §5. |
| `catalog.js` | All interactions. Progressive enhancement only; delete it and the site still works. |

`styles.css` is layered so you always know where a rule came from:
1. **Base + components** (top) — cards, ruling, tabs, stamps, typography
2. **Whimsy annex** — lamp, marginalia, tape, coffee ring, barcode, kbd keys
3. **Fluid Edition annex** — view transitions, springs, clamp() type, iOS-safe desk
4. **Review annex** — verified fixes from a cross-model code review

---

## 2. Preview locally

Any static file server works. The simplest:

```bash
cd mhea-bardouille-site-fluid
python3 -m http.server 8080
# open http://localhost:8080
```

---

## 3. Deploy to GitHub Pages

### Option A — user site → `https://USERNAME.github.io`

1. Create a **public** repo on GitHub named exactly `USERNAME.github.io`
   (your GitHub username in place of USERNAME).
2. Push this folder as the repo root:

```bash
cd mhea-bardouille-site-fluid
git init
git add .
git commit -m "Initial catalog: drawer 1 of 1"
git branch -M main
git remote add origin git@github.com:USERNAME/USERNAME.github.io.git
git push -u origin main
```

3. That's it — Pages activates automatically for this repo name.
   The site is live at `https://USERNAME.github.io` within a couple of minutes.

### Option B — project site → `https://USERNAME.github.io/REPO-NAME`

1. Create a repo with any name (e.g. `card-catalog`), push the same way as above
   (swap the remote URL).
2. On GitHub: **Settings → Pages → Build and deployment →
   Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save.**
3. Live at `https://USERNAME.github.io/REPO-NAME` a minute or two later.

All internal links are relative, so both options work without any changes.

### If you use HTTPS remotes instead of SSH

Replace the remote line with
`git remote add origin https://github.com/USERNAME/REPO-NAME.git` — everything else
is identical.

### Custom domain (optional)

**Settings → Pages → Custom domain**, add a `CNAME` record at your DNS host pointing to
`USERNAME.github.io`, and tick "Enforce HTTPS" once it verifies.

### Updating the site later

```bash
git add .
git commit -m "Refile cards"
git push
```

Pages redeploys automatically on every push. Revisions expected; Reviewer 2 demanded them.

---

## 4. Before you publish — the REPLACE-ME checklist

Search the whole folder for `REPLACE-ME` and for `[bracketed text]`. Every hit is yours:

| Where | What to replace |
|---|---|
| `index.html` | LinkedIn URL on the reverse side of Card 1. The no-JS fallback says when that link is still pending. |
| `projects.html` | Each project card: title, `filed:` / `contains:` values, description, and the `→ open` link (point at a repo or write-up). |
| `recruiter.html` | The Abstract paragraph, both Work Experience entries, Education, all skills chips, the three publications-table rows, the Appendix list, and the **email address** (it is load-bearing). |
| `404.html` | The missing-card-report email (same address as the contact card). |
| Optional | An `og:image` meta tag on each page for link previews (a photo of a real desk would be on-theme). |

Placeholder `→ open` links (`href="#"`) don't navigate. With JavaScript, the card shakes
and announces "not filed yet." Without JavaScript, `aria-disabled` and `tabindex="-1"`
keep the placeholder out of the tab order. When filing a URL, replace the `href` and remove
those two attributes.

---

## 5. Editing guide — where everything lives

### Content

- **Name, tagline, footnotes** — `index.html`, the first `<section class="card card--wide tape">`.
  Footnote superscripts are `<sup>1</sup>`; the notes themselves are `<li>` items in
  `<ol class="footnotes">` (numbering is automatic, per card).
- **The rotating "current status" lines** — `catalog.js`, the `statuses` array.
  Add or remove strings; one is picked per visit, the *re-observe* button re-rolls.
- **Pencil marginalia** (the handwritten notes, incl. Reviewer 2) — any
  `<span class="margin-note">…</span>` in the HTML. Add `margin-note--right` to park one
  on the card's right edge. Delete the span to remove a note.
- **Stamps** ("No judgement", "Defended", …) — `<span class="stamp">Text</span>` inside a
  card. One per card looks right; they intentionally overlap the ruled area, like real stamps.
- **Tabs** ("Card 1/2/3") — `<span class="tab tab--green|--teal|--amber">`.
- **Add a project card** — in `projects.html`, copy any `<article class="card proj">` block
  and edit it. The search filter and the "n = X" count adapt automatically. Alternate
  `tilt-l` / `tilt-r` / no class so the drawer looks hand-filed.
- **Remove a project card** — delete its whole `<article>` block. Nothing else to update.
- **Recruiter sections** — each `§` section in `recruiter.html` is a self-contained
  `<section class="card">`; reorder or delete freely. Section numbers are just text in
  the `catalog-no` line.
- **Colophon / footer jokes** — bottom of each page, `<footer class="colophon">`.
- **Tab-away browser titles** ("still filed under: procrastination") — the
  `data-away-title` attribute on each page's `<body>`.

### Design knobs (all in `styles.css`, in `:root` unless noted)

- **Paper / desk / ink colors** — `--paper`, `--desk`, `--ink`, etc. All `oklch()`;
  nudge the first number (lightness) before anything else.
- **Ruled lines** — `--line` controls the ruling *and* the line-height together, so text
  always sits on the lines. In this edition it's a `clamp()` (24–28px with viewport).
- **Tab colors** — `--tab-green`, `--tab-teal`, `--tab-amber`.
- **Fonts** — `--serif` (Spectral), `--tw` (Courier Prime), plus Caveat for marginalia.
  Change the Google Fonts `<link>` in each page's `<head>` together with the tokens.
- **Card tilt** — `.tilt-l` / `.tilt-r` set `--tilt`; adjust the degree values to taste.
- **Motion feel** — Fluid annex: `--ease-spring` (card lift), `--ease-flip` (the flip),
  view-transition durations under `::view-transition-old/new(root)`.
- **The lamp** — dusk darkness lives in `body[data-lamp="off"]::after { opacity: … }`.
- **Turn a whimsy feature off** — delete its block: `.lamp-cord` (+ the button in each
  HTML file), `.coffee-ring`, `.tape`, `.barcode`, `.margin-note`, the `statuses` block
  in `catalog.js`. Every feature is independent; nothing else breaks.

### Adding a whole new page

1. Copy an existing page (e.g. `projects.html`) and keep the skeleton: the fonts +
   `styles.css` links, the lamp-cord `<button>`, the `drawer-label` header, the
   `breadcrumb` back-link, and the `catalog.js` script tag at the bottom.
2. Change the drawer-plate text, `<title>`, meta description, and `data-away-title`.
3. Link to it from a card. Cross-document view transitions pick it up automatically.

### Things to know before "improving" it

- **Progressive enhancement is the contract**: every feature must degrade — test once
  with JS disabled and once with `prefers-reduced-motion` on. Controls that need
  `catalog.js` carry the `js-only` class, so the no-JS version does not advertise dead controls.
- The Fluid Edition targets current evergreen browsers. It uses CSS nesting, container
  queries, `:has()`, `oklch()`, and view transitions. Older browsers still get the HTML,
  but some decorative and interaction styling may be missing without a CSS build step.
- The recruiter page **prints cleanly on purpose** (there's a print button); if you add
  content there, check print preview — cards never split across pages.
- Keep the humor deadpan: footnotes, understatement, bureaucratic stamps. If a joke
  needs an exclamation mark, it isn't the house style.

---

## 6. Feature inventory (for the curious)

Desk lamp with memory · randomized status line with observer effect · pencil marginalia
by Reviewer 2 · searchable card catalog with view-transition reflow · keyboard shortcuts
1/2/3 · washi tape, coffee ring, barcode that encodes nothing · cross-document view
transitions with a morphing drawer plate · springy card physics · "not filed yet" card
shake · highlighter-yellow selection · index-card favicon · tab titles that notice when
you leave · APA-style self-citation · a 404 card that is simply overdue.
