# AI Memory Companion — Design System v1.0

> Emotional Temperature: **Memorial Candle · Morning Memory Box / Late-Night Comfort**
>
> Every decision is judged against one standard: does this feel gentle, safe, and human? Not tech demo, not productivity dashboard. It sits closer to a keepsake box or a handwritten letter than to a SaaS app.

---

## 1. Dual Theme Strategy

**Tailwind v4 CSS-first strategy** via `dark:` semantic classes + CSS custom properties (`var(--*)`.

Defined in: `frontend/src/index.css` → `@theme` block + `:root` (light) / `html.dark` (dark) overrides.

**Persistence:** `localStorage['ai-memory-theme']` · Defaults to `prefers-color-scheme` system preference.

### 1.1 Light — "Morning Memory Box"

Palette intent: warm cream + lavender-blush · paper-grain texture · never hospital-white.

| Token | Value | Role |
|---|---|---|
| `--surface-bg` | `#faf6f2` | Base canvas |
| `--surface-elev` | `#ffffff` | Cards / paper |
| `--surface-soft` | `#f3ece7` | Alt surfaces |
| `--text-strong` | `#3a3540` | Body copy (WCAG AA on cream) |
| `--text-muted` | `#6b616f` | Secondary text |
| `--text-subtle` | `#9a8ea0` | Hints, timestamps |
| `--border-soft` | `rgba(70,58,58,0.08)` | Dividers |
| `--glass-bg` | `rgba(255,255,255,0.55)` | Glassmorphism |
| `--glass-border` | `rgba(70,58,58,0.08)` | Glass border |
| `--ai-presence` | `rgba(159,122,234,0.22)` | "Someone is here" glow |
| `--ai-bubble-bg` | `rgba(159,122,234,0.10)` | AI bubble |
| `--user-bubble-bg` | gradient 135° #9f7aea → #7c3aed | User bubble |

**Paper-grain texture applied via radial-gradient on body; disabled in dark.

### 1.2 Dark — "Late-Night Comfort"

Palette intent: deep indigo/charcoal · soft violet glass panels · warm lamp-like AI glow. Not a control room.

| Token | Value | Role |
|---|---|---|
| `--surface-bg` | `#0b1022` | Deep indigo base (not pure #000) |
| `--surface-elev` | `#131935` | Card / panel |
| `--surface-soft` | `#0f1430` | Muted alt |
| `--text-strong` | `rgba(255,255,255,0.90)` | Body |
| `--text-muted` | `rgba(255,255,255,0.62)` | Secondary |
| `--text-subtle` | `rgba(255,255,255,0.38)` | Timestamps |
| `--border-soft` | `rgba(255,255,255,0.06)` | Dividers |
| `--glass-bg` | `rgba(19,25,53,0.6)` | Glass dark |
| `--ai-presence` | `rgba(167,139,250,0.28)` | Glow stronger |
| `--ai-bubble-bg` | `rgba(255,255,255,0.055)` | AI bubble |
| `--user-bubble-bg` | gradient 135° #7c3aed → #6366f1 | User bubble |

---

## 2. Color Tokens (Theme-Agnostic Brand)

Defined in `@theme` (always available via `var(--color-*)`).

| Token | Hex | Purpose |
|---|---|---|
| `--color-primary` | `#9f7aea` | Soft violet (brand heart) |
| `--color-primary-light` | `#b79bf3` | Hover/lighter violet |
| `--color-primary-dark` | `#7c3aed` | Deep violet / CTA |
| `--color-accent-rose` | `#d982b1` | Dusty rose / warmth |
| `--color-accent-sage` | `#7ea38a` | Gentle success |
| `--color-accent-amber` | `#c99a4b` | Keepsake gold |

Use `color-mix(in srgb, var(--color-X) N%, transparent)` for semi-transparent variants.

---

## 3. Typography Strategy

### Fonts
- **Display / UI chrome: **`Inter` (var(--font-sans)) — humanist warm sans
- **AI / companion messages:** `Fraunces` (var(--font-serif)) — soft serif to feel "voice-like" / handwritten

Intentional font-family **contrast** between user messages (Inter) vs AI messages (Fraunces) carries huge emotional weight without any visual noise.

### Usage Rules
- User bubble: `var(--font-sans)` · UI chrome: `var(--font-sans)`
- AI bubble: `var(--font-serif)` 0.95rem · line-height relaxed
- Headlines: `letter-spacing: -0.01em`
- Body: 0.875rem (14px) for UI · 15/16px for content

### Gradient text utility
- `gradient-text` → violet → rose blend
- `gradient-text-warm` → rose → pale violet

---

## 4. Signature Motif (Pick ONE, execute well)

### **AI Presence: Breathing Glow

Utility class `.ai-presence` applied to the AI avatar wrapper.

Implementation (in `index.css`):
- Pulsing radial-gradient ::before pseudo-element inset -6px
- `animation: breath 4.2s ease-in-out infinite` — scale 1 → 1.045 → 1, opacity 0.92 → 1 → 0.92
- Uses `var(--ai-presence)` color
- Disabled under `prefers-reduced-motion: reduce`

**DO NOT stack with additional signature motifs (no fireflies, no scrapbook dividers, etc). Just the breath glow. One motif, restrained.

---

## 5. Shadows & Elevation

| Token | Formula |
|---|---|
| `--shadow-soft` | 0 8px 30px rgba(0,0,0,0.08) |
| `--shadow-card` | 0 10px 40px rgba(15,23,42,0.10) |
| `--shadow-card-hover` | 0 18px 60px rgba(15,23,42,0.16) |
| `--shadow-glow` | 0 0 36px rgba(159,122,234,0.28) |

Hover card rule: `.hover-card` → translateY(-3px) + shadow lift + border-color bump. 0.25s `var(--ease-gentle)` (cubic-bezier 0.22, 1, 0.36, 1).

**No bouncy springs. Stiffness 240–300, damping 20–24 max. "Calm" is the priority.

---

## 6. Radius

```
--radius-2xl:  1rem
--radius-3xl:  1.5rem   (standard card)
--radius-4xl:  2rem     (bubble/hero)
```

Chat bubbles: rounded-3xl · single-corner bite (br-md / bl-md) on sender side.

---

## 7. Motion System (Framer Motion)

### Page load
- Staged fade/slide-up: headline → subtext → CTA → chat preview card
- `initial: { opacity: 0, y: 16 }` → `animate: { opacity: 1, y: 0 }`
- `transition: { type: 'spring', stiffness: 240, damping: 24 }`

### Chat bubbles
- Spring-in from sender side: user = x: +14 · ai = x: -14
- Scale 0.96 → 1
- whileHover: scale 1.01 ONLY · 0.2s

### Composing / typing indicator
- **NOT the 3-dot bounce.** Replace with: `.typing-dot` class using `animation: typing-breath 2.4s ease-in-out infinite` with staggered delay (0 / 0.35s / 0.7s)
- Scale 1 → 1.12 → 1 · opacity 0.55 → 1 → 0.55

### Hover
- Cards/buttons: scale 1.02 + shadow lift · 150–200ms ease-out. Nothing bouncy.

### Voice reply playback
- Waveform bars: `.waveform-bar` · or `.audio-bar` animations synced.

### Reduced-motion fallback
- Everything falls back to opacity fades only. Global `@media (prefers-reduced-motion: reduce)` block disables all keyframe animations and Framer Motion components check `reducedMotion` from `useTheme()`.

---

## 8. Chat Screen Design (Core Product)

### Bubbles
| Side | Font | Background | Border / Glow |
|---|---|---|---|
| User | Inter (sans) | `var(--user-bubble-bg)` (gradient) | Shadow 0 8px 24px primary/22% |
| AI | **Fraunces** (serif) 0.95rem | `var(--ai-bubble-bg)` | 1px `var(--ai-bubble-border)` + `ai-presence` avatar glow |

### Input
- Textarea grows · enter to send, shift+enter newline
- Mic button mic-glow when recording
- File upload button next to mic

### Composing indicator
3 dots breathing animation under "breathing" (NOT BOUNCE.

---

## 9. Memory Creation Flow

Treats it like curating a keepsake — NOT a form.

- Warm empty states: "Start with one memory — a phrase, a photo, a sound."
- Soft step indicator — no harsh corporate forms.
- Paper-grain surface in light mode; warm amber accent color

---

## 10. Accessibility Floor (Non-Negotiable)

- Both themes pass **WCAG AA contrast: `--text-strong` over surfaces
- Visible `:focus-visible` outline: 3px `var(--ai-presence)` glow ring + 1px inner ring
- Mobile responsive down to 320px
- Mobile-first pass 14px min readable
- `prefers-reduced-motion` honored globally

---

## 11. Component Utilities Library

All live in `frontend/src/index.css` `@layer components`:

- `.glass`, `.glass-card`, `.glass-dark`, `.glass-light`
- `.hero-mesh` (mesh gradient blobs)
- `.gradient-text`, `.gradient-text-warm`
- `.nav-active`
- `.hover-card`
- `.section-divider`
- `.ai-presence` (signature breathing avatar)
- `.typing-dot` (breathing typing dots)
- `.form-input`, `.form-label`
- `.waveform-bar`, `.audio-bar`, `.record-btn-active`, `.mic-glow`

---

## 12. Implementation Map

| File | Responsibility |
|---|---|
| `frontend/src/contexts/ThemeContext.jsx` | Theme state · system preference, `useTheme()` hook |
| `frontend/src/components/ThemeToggle.jsx` | Sun⇄Moon morph button, aria labels |
| `frontend/src/index.css` | ALL design tokens, animations, component utilities |
| `frontend/src/pages/Chat.jsx` | Chat orchestration · composer area layout |
| `frontend/src/components/ChatBubble.jsx` | Fraunces AI vs Inter user distinction |
| `frontend/src/components/Navbar.jsx` | ThemeToggle placement · sticky glass nav |
| `frontend/tailwind.config.js` | v4 CSS-first config (minimal, tokens live in CSS) |
| `.stitch/DESIGN.md` | This document (source of truth) |

---

## 13. Copy Tone

Second person, warm plain.
- "Preserve a memory" not "Create asset"
- Empty states: gentle guide · never system-message style not clinical.
- No hype words like revolutionary, cutting-edge.
- Credibility = careful, deliberate, calm.

---

_End of DESIGN.md v1.0
