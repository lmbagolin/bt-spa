---
name: quasar-sakai-design
description: Design system combining Quasar 2 components with Sakai admin template layout patterns. Color schemes, typography, responsive layouts, and dashboard structures.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Quasar + Sakai Design System

> **Philosophy:** Quasar's component library with Sakai's sophisticated dashboard aesthetic.
> **Goal:** Professional admin interface following Sakai UX patterns but built with Quasar components.

---

## 🎯 Quick Reference

| Need | File |
|------|------|
| Layout structure (sidebar + topbar) | [layout-structure.md](layout-structure.md) |
| Color & theme system | [color-theme.md](color-theme.md) |
| Typography & spacing | [typography-spacing.md](typography-spacing.md) |
| Quasar components mapping | [quasar-components-mapping.md](quasar-components-mapping.md) |
| SCSS utilities & patterns | [scss-patterns.md](scss-patterns.md) |
| Dashboard patterns | [dashboard-patterns.md](dashboard-patterns.md) |
| Responsive design | [responsive-design.md](responsive-design.md) |

---

## 📋 Mandatory Files (Read These First)

| File | Why |
|------|-----|
| [layout-structure.md](layout-structure.md) | Defines Sakai sidebar/topbar/main layout |
| [quasar-components-mapping.md](quasar-components-mapping.md) | Maps Sakai patterns to Quasar components |
| [color-theme.md](color-theme.md) | Sakai color palette + Quasar theming |

---

## 🔗 Related Skills

| Need | Skill |
|------|-------|
| Vue 3 component patterns | `@[skills/vue3-typescript]` |
| State management | `@[skills/pinia-state-management]` |
| SCSS & CSS utilities | Use `[scss-patterns.md](scss-patterns.md)` in this skill |
| Quasar docs | https://quasar.dev |
| Sakai template | https://sakai.primevue.org/ |

---

## 🏗️ Sakai Key Concepts

### Layout Structure
```
┌─────────────────────────────┐
│         TOPBAR (Header)     │  - Fixed, contains logo/user/notifications
├──────────┬──────────────────┤
│          │                  │
│ SIDEBAR  │  MAIN CONTENT    │  - Sidebar collapsible on mobile
│ (Dark)   │  (Light/Dark)    │  - Main content scrollable
│          │                  │
└──────────┴──────────────────┘
```

### Visual Characteristics
- **Sidebar**: Dark background (#2c3e50 or #34495e), white/light text
- **Topbar**: Clean, minimal, often dark or white with shadow
- **Main**: Light background with subtle cards/sections
- **Typography**: Clean sans-serif, good hierarchy
- **Spacing**: Generous padding/margins, breathing room
- **Colors**: Professional palette (blues, grays, accents)
- **Cards**: Subtle shadows, rounded corners (8-12px)

---

## ✅ Before Starting

- [ ] Read [layout-structure.md](layout-structure.md)?
- [ ] Read [quasar-components-mapping.md](quasar-components-mapping.md)?
- [ ] Understood Sakai vs Quasar differences?
- [ ] SCSS utilities imported in your project?

---

## 🚀 Common Tasks

### "Create a dashboard page"
1. Use [dashboard-patterns.md](dashboard-patterns.md)
2. Reference Sakai layout: https://sakai.primevue.org/dashboard
3. Map Quasar components from [quasar-components-mapping.md](quasar-components-mapping.md)
4. Apply SCSS from [scss-patterns.md](scss-patterns.md)

### "Style a form"
1. Check [quasar-components-mapping.md](quasar-components-mapping.md) → Form section
2. Read [color-theme.md](color-theme.md) for input styling
3. Reference [typography-spacing.md](typography-spacing.md)

### "Make layout responsive"
1. Read [responsive-design.md](responsive-design.md)
2. Use Quasar's `$q.screen` breakpoints
3. Apply SCSS mixins from [scss-patterns.md](scss-patterns.md)

---

## 📚 Resources

| Resource | URL |
|----------|-----|
| Quasar Components | https://quasar.dev/components |
| Quasar Layout System | https://quasar.dev/layout |
| Quasar CSS | https://quasar.dev/style |
| Sakai Template | https://sakai.primevue.org/ |
| Sakai Source (GitHub) | https://github.com/primefaces/sakai-quasar ⭐ |

---

## 🎨 Sakai Color Palette (Reference)

```scss
// Primary colors
$primary-blue: #1976d2;
$secondary-blue: #64b5f6;

// Neutrals
$dark-bg: #2c3e50;
$card-bg: #ffffff;
$text-dark: #2c3e50;
$text-light: #7f8c8d;
$border-color: #ecf0f1;

// Status
$success: #27ae60;
$warning: #f39c12;
$danger: #e74c3c;
$info: #3498db;
```

---

## 🔄 Workflow

1. **Plan the page**: Sketch layout (sidebar content? cards? forms?)
2. **Choose Quasar component**: Map from [quasar-components-mapping.md](quasar-components-mapping.md)
3. **Apply Sakai styling**: Use [color-theme.md](color-theme.md) + [scss-patterns.md](scss-patterns.md)
4. **Test responsive**: Check [responsive-design.md](responsive-design.md) breakpoints
5. **Review with Sakai reference**: Compare visual with https://sakai.primevue.org/

---

## ⚠️ Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Quasar default styling too "Material Design" | Override with SCSS from [scss-patterns.md](scss-patterns.md) |
| Sidebar doesn't match Sakai dark theme | Use [color-theme.md](color-theme.md) dark mode settings |
| Spacing feels cramped | Apply [typography-spacing.md](typography-spacing.md) padding rules |
| Layout breaks on mobile | Follow [responsive-design.md](responsive-design.md) |

---

## 🎯 Decision Checklist

- [ ] Page/component matches Sakai visual style?
- [ ] Using appropriate Quasar component (not custom HTML)?
- [ ] SCSS follows patterns from [scss-patterns.md](scss-patterns.md)?
- [ ] Responsive breakpoints tested?
- [ ] Color palette aligned with [color-theme.md](color-theme.md)?
- [ ] Spacing consistent with [typography-spacing.md](typography-spacing.md)?
