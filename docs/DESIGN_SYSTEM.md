# Design System Specification

> Unified theme system for AI coding tools. Based on the `frontend-template` project.
> Stack: Vue 3 + Naive UI + UnoCSS (presetWind3)

---

## 1. Color System

### 1.1 Semantic Colors

```yaml
primary: '#059669' # Emerald 600 — 清新翡翠绿 (brand color)
info: '#3b82f6' # Blue 500 — 柔和蓝
success: '#10b981' # Emerald 500
warning: '#f59e0b' # Amber 500
error: '#ef4444' # Red 500
```

### 1.2 Color Palette (per semantic color, 11 steps)

Each semantic color (primary, info, success, warning, error) generates a full palette:

```
50, 100, 200, 300, 400, 500 (main), 600, 700, 800, 900, 950
```

CSS variable format: `rgb(var(--{color}-{step}-color))` — RGB values only, no `rgb()` wrapper.

Primary palette example (Emerald family):

```yaml
primary-50: '#ecfdf5'
primary-100: '#d1fae5'
primary-200: '#a7f3d0'
primary-300: '#6ee7b7'
primary-400: '#34d399'
primary-500: '#10b981' # default main
primary-600: '#059669' # actual primary (matches themeColor)
primary-700: '#047857'
primary-800: '#065f46'
primary-900: '#064e3b'
primary-950: '#022c22'
```

### 1.3 Theme Tokens (light mode)

```yaml
container-bg: 'rgb(255, 255, 255)' # Card/panel backgrounds — pure white
layout-bg: 'rgb(249, 250, 251)' # Page/layout background — very light gray (#f9fafb)
inverted-bg: 'rgb(15, 23, 42)' # Inverted elements (dark backgrounds)
base-text: 'rgb(31, 41, 55)' # Primary text color (#1f2937)
nprogress: (same as primary)
```

### 1.4 Theme Tokens (dark mode)

```yaml
container-bg: 'rgb(30, 41, 59)' # Dark container (#1e293b)
layout-bg: 'rgb(15, 23, 42)' # Dark page background (#0f172a)
base-text: 'rgb(241, 245, 249)' # Light text (#f1f5f9)
inverted-bg: (inherits light mode value)
```

### 1.5 Neutral / Gray Scale

Use Tailwind-compatible gray families for text, borders, and backgrounds:

```yaml
slate-50: '#f8fafc'
slate-100: '#f1f5f9'
slate-200: '#e2e8f0'
slate-300: '#cbd5e1'
slate-400: '#94a3b8'
slate-500: '#64748b'
slate-600: '#475569'
slate-700: '#334155'
slate-800: '#1e293b'
slate-900: '#0f172a'
```

Placeholder text: `#9ca3af` (gray-400)
Border default: `#e5e7eb` (gray-200 via CSS var `--un-default-border-color`)

### 1.6 CSS Variables

```css
:root {
  --primary-color: 5 150 105;
  --primary-50-color: 236 253 245;
  --primary-100-color: 209 250 229;
  /* ... 200-950 ... */
  --info-color: 59 130 246;
  --success-color: 16 185 129;
  --warning-color: 245 158 11;
  --error-color: 239 68 68;
  --container-bg-color: 255 255 255;
  --layout-bg-color: 249 250 251;
  --inverted-bg-color: 15 23 42;
  --base-text-color: 31 41 55;
  --nprogress-color: 5 150 105;
  --header-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --sider-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --tab-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

---

## 2. Typography

### 2.1 Font Family

```css
font-family:
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  'Noto Sans',
  sans-serif,
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji';
```

### 2.2 Font Weights

```yaml
normal: 400
medium: 500 # buttons, badges, emphasis
strong: 600 # headings, bold text
```

### 2.3 Font Sizes (recommended)

```yaml
xs: 12px # badges, version tags
sm: 14px # descriptions, secondary text
base: 16px # body text
lg: 18px # feature titles, CTA text
xl: 32px # section headings
2xl: 36px # CTA headings
3xl: 48px # hero text (small screens)
4xl: 64px # hero text (large screens)
```

### 2.4 Line Height

```yaml
body: 1.5 # base line-height (html)
relaxed: 1.625 # paragraph descriptions
tight: 1.2 # headings
```

---

## 3. Spacing

Use UnoCSS default spacing scale (4px base unit):

```yaml
unit: 4px
# Examples:
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
```

Common patterns in this project:

- Content padding: `24px` (`p-24px`)
- Section vertical padding: `80px` (`py-80px`)
- Card padding: `24px`
- Gap between grid items: `24px`-`32px`
- Max content width: `1200px` (`max-w-1200px`)
- Header height: `64px` (`h-16`)

---

## 4. Border Radius

```yaml
sm: 4px # tags, small elements
md: 8px # buttons, inputs, selects (Naive UI default)
lg: 12px # cards, large buttons
xl: 16px # icon containers, tech stack items
2xl: 24px # stat containers
32px: # hero icon containers, CTA sections
full: 9999px # circular elements (avatars, decorative blobs)
```

Naive UI component overrides:

```yaml
Tag.borderRadius: 4px
Card.borderRadius: 12px
Button.borderRadiusMedium: 8px
Input.borderRadius: 8px
Select.borderRadius: 8px
```

---

## 5. Shadows

```yaml
low: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
high: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'

# Layout-specific (same as low by default):
header: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
sider: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
tab: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
```

Card shadow pattern:

```css
/* Default state */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Hover state */
box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
```

---

## 6. Transitions & Animations

```yaml
duration:
  normal: 300ms # page transitions, card hovers
  fast: 200ms # color changes, small interactions

timing-function: 'cubic-bezier(0, 0, 0.2, 1)' # ease-out
```

Page transition classes:

- `fade` — opacity 0.3s
- `fade-slide` — opacity + translateX(±30px) 0.3s
- `fade-bottom` — opacity + translateY(±10%) 0.3s
- `fade-scale` — opacity + scale(1.2→1) 0.28s
- `zoom-fade` — opacity + scale(0.92→1) 0.2s+0.3s
- `zoom-out` — opacity + scale(0→1) 0.15s

Interaction feedback:

- Buttons: `active:scale-95` (press down effect)
- Cards: `hover:-translate-y-4px` (lift on hover)
- CTA buttons: `active:scale-95` + shadow transition

---

## 7. Layout Patterns

### 7.1 Page Structure

```
┌─────────────────────────────────────┐
│  GlobalHeader (sticky, z-50)       │  ← shadow-header, bg-container
│  ┌─────┬──────────┬──────────┐     │
│  │Logo │ NMenu    │ Actions  │     │  ← h-64px, max-w-1200px centered
│  └─────┴──────────┴──────────┘     │
├─────────────────────────────────────┤
│  GlobalContent                      │  ← bg-layout, min-h-screen
│  ┌─────────────────────────────┐   │
│  │  max-w-1200px centered      │   │  ← px-24px padding
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  GlobalFooter                       │
└─────────────────────────────────────┘
```

### 7.2 Header

```yaml
height: 64px
position: sticky, top-0, z-50
background: container color
shadow: header shadow
max-width: 1200px centered
```

### 7.3 Content Area

```yaml
max-width: 1200px
padding-x: 24px
margin: 0 auto
background: layout color
min-height: 100vh
```

### 7.4 Mobile

- Header collapses to hamburger menu
- NDrawer (width 80%, placement left) for mobile navigation
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (responsive)

---

## 8. Component Patterns

### 8.1 Card

```html
<!-- UnoCSS shortcut: card-wrapper -->
<div class="rd-8px shadow-low transition-shadow duration-300 ease-out hover:shadow-high">
  <NCard :bordered="false" />
</div>

<!-- Naive UI override: Card borderRadius 12px, shadow low -->
```

### 8.2 Primary Button

```html
<!-- UnoCSS shortcut: btn-primary -->
<NButton
  type="primary"
  class="h-48px rd-12px px-32px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
></NButton>
```

### 8.3 Feature Card Pattern

```html
<div class="text-center p-8px">
  <div class="p-16px rd-20px transition-colors duration-300" style="background-color: {color}15">
    <SvgIcon :icon="icon" class="size-32px" :style="{ color }" />
  </div>
  <h3 class="text-18px font-bold text-base-text">{{ title }}</h3>
  <p class="mt-12px text-14px text-slate-500 leading-relaxed">{{ description }}</p>
</div>
```

### 8.4 Section Heading Pattern

```html
<div class="text-center mb-64px">
  <h2 class="text-32px font-bold text-base-text">{{ title }}</h2>
  <div class="mt-8px h-4px w-48px bg-primary rd-full mx-auto" />
  <!-- accent line -->
  <p class="mt-16px text-16px text-slate-500">{{ subtitle }}</p>
</div>
```

### 8.5 Hero Gradient Decoration

```html
<div class="absolute -top-240px -right-240px size-480px rd-full bg-primary/5 blur-3xl" />
<div class="absolute -bottom-240px -left-240px size-480px rd-full bg-blue-500/5 blur-3xl" />
```

### 8.6 Stats/Highlight Box

```html
<div class="text-center p-32px rd-24px bg-primary/5 border border-primary/10 transition-all duration-300 hover:bg-primary/10">
  <div class="text-48px font-bold text-primary tabular-nums">{{ value }}</div>
  <div class="mt-8px text-16px font-medium text-slate-500">{{ label }}</div>
</div>
```

### 8.7 CTA Section

```html
<div class="bg-primary rd-32px p-64px shadow-high relative overflow-hidden group">
  <!-- Decorative blobs -->
  <div class="absolute top-0 right-0 size-300px bg-white/10 rd-full blur-3xl transition-transform duration-700 group-hover:scale-125" />
  <!-- Content -->
  <h2 class="text-36px font-bold text-white relative z-10">...</h2>
</div>
```

---

## 9. UnoCSS Shortcuts

```yaml
# Card styles
card-wrapper: 'rd-8px shadow-low transition-shadow duration-300 ease-out hover:shadow-high'
card: 'h-82vh flex flex-col items-center bg-container p-24px rd-12px shadow-low'

# Button styles
btn-primary: 'bg-primary text-white rd-8px px-16px py-8px transition-colors duration-200 ease-out hover:bg-primary-600'

# Flex utilities
flex-center: 'flex justify-center items-center'
flex-x-center: 'flex justify-center'
flex-y-center: 'flex items-center'
flex-col: 'flex flex-col'
flex-col-center: 'flex-center flex-col'
flex-1-hidden: 'flex-1 overflow-hidden'

# Text utilities
ellipsis-text: 'overflow-hidden whitespace-nowrap text-ellipsis'

# Position utilities
absolute-center: 'absolute left-0 top-0 flex-center size-full'
fixed-center: 'fixed left-0 top-0 flex-center size-full'
```

---

## 10. Dark Mode

- **Toggle mechanism**: Class-based (`html.dark`)
- **Detection**: `usePreferredColorScheme()` from @vueuse/core
- **Schemes**: `light` | `dark` | `auto`
- **CSS injection**: Theme tokens injected as CSS variables in `:root` and `html.dark`
- **Container**: DarkModeContainer component wraps content areas

Dark mode color shifts:

```yaml
container: white → #1e293b
layout: #f9fafb → #0f172a
base-text: #1f2937 → #f1f5f9
```

---

## 11. Icon System

- **Library**: Iconify via `@iconify/vue` and `unplugin-icons`
- **Icon set**: `@iconify/json` (full collection)
- **SVG icons**: Custom SVG sprite via `vite-plugin-svg-icons`
- **Usage**: `<SvgIcon icon="ph:rocket-launch-duotone" />` (Iconify format)
- **Duotone style**: Preferred for feature icons (`:duotone` suffix)
- **Home page icons**: `ph:speedometer-duotone`, `ph:palette-duotone`, `ph:code-duotone`, `ph:devices-duotone`

---

## 12. Scrollbar

- Width: 7px
- Color: `rgba(0, 0, 0, 0.5)`
- Style: thin
- Track: transparent
- Border-radius: matches thumb size

---

## 13. Accessibility

- **Grayscale Mode**: `filter: grayscale(100%)`
- **Color Weakness Mode**: `filter: invert(80%)`
- **Dark Mode**: Toggle via `html.dark` class
- **Watermark**: Configurable overlay (text / username / timestamp)

---

## 14. AI Coding Guidelines

When generating UI code for this project:

1. **Use UnoCSS utility classes** (Tailwind-compatible syntax)
2. **Use Naive UI components** (`NButton`, `NCard`, `NInput`, etc.)
3. **Reference theme tokens** via `text-primary`, `bg-primary`, `text-base-text`, `bg-container`, `bg-layout`
4. **Border radius**: Use `rd-4px` (sm), `rd-8px` (md), `rd-12px` (lg), `rd-16px` (xl)
5. **Shadows**: Use `shadow-low` for cards, `shadow-high` for hover/modal
6. **Transitions**: Default `duration-300 ease-out`
7. **Dark mode**: Use `dark:` variant prefix (e.g., `dark:bg-container`)
8. **Flex layout**: Prefer shortcuts like `flex-center`, `flex-col-center`
9. **Colors**: Use palette variants for hover/active states (`hover:bg-primary-600`)
10. **Spacing**: Prefer multiples of 4px (4, 8, 12, 16, 24, 32)
