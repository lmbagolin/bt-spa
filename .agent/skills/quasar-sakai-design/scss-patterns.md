# SCSS Patterns for Sakai Design

> SCSS utilities and mixins for Sakai styling in Quasar. **All styles must use SCSS, no inline CSS.**

---

## 🎯 Quick Patterns

| Need               | Mixin/Utility                             |
| ------------------ | ----------------------------------------- |
| Card styling       | `.sakai-card` class                       |
| Spacing rhythm     | `$spacing-xs` to `$spacing-xl`            |
| Shadows            | `@include sakai-shadow()`                 |
| Rounded corners    | `$border-radius-sm` / `$border-radius-md` |
| Hover effects      | `@include hover-lift()`                   |
| Responsive padding | `@include responsive-padding()`           |
| Typography styles  | `@include heading-style()`                |

---

## 📐 Layout SCSS

### Global Variables

**Create `src/css/bt-variables.scss`:**

```scss
// ═══════════════════════════════════════════════════════
// LAYOUT DIMENSIONS
// ═══════════════════════════════════════════════════════

$layout-header-height: 70px;
$layout-sidebar-width: 250px;
$layout-sidebar-width-collapsed: 60px;
$layout-main-padding: 24px;
$layout-main-padding-mobile: 16px;

// Breakpoints
$breakpoint-xs: 480px;
$breakpoint-sm: 600px;
$breakpoint-md: 1024px;
$breakpoint-lg: 1440px;

// ═══════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════

// Sidebar
$color-sidebar-bg: #2c3e50;
$color-sidebar-text: #bdc3c7;
$color-sidebar-text-hover: #ffffff;
$color-sidebar-hover: rgba(255, 255, 255, 0.05);
$color-sidebar-active: #1976d2;
$color-sidebar-border: #34495e;

// Topbar
$color-topbar-bg: #ffffff;
$color-topbar-border: #e0e0e0;
$color-topbar-shadow: rgba(0, 0, 0, 0.08);

// Main content
$color-main-bg: #f5f5f5;
$color-card-bg: #ffffff;
$color-card-border: #e0e0e0;
$color-card-shadow: rgba(0, 0, 0, 0.08);

// Text colors
$color-text-primary: #2c3e50;
$color-text-secondary: #7f8c8d;
$color-text-light: #bdc3c7;

// Status colors
$color-success: #27ae60;
$color-warning: #f39c12;
$color-danger: #e74c3c;
$color-info: #3498db;
$color-primary: #1976d2;

// ═══════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// ═══════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════

$font-family-base:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
  'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
$font-family-mono: 'Monaco', 'Menlo', 'Courier New', monospace;

$font-size-xs: 12px;
$font-size-sm: 13px;
$font-size-base: 14px;
$font-size-md: 15px;
$font-size-lg: 16px;
$font-size-xl: 18px;
$font-size-2xl: 20px;
$font-size-3xl: 24px;
$font-size-4xl: 32px;

$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line heights
$line-height-tight: 1.2;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// ═══════════════════════════════════════════════════════
// BORDERS
// ═══════════════════════════════════════════════════════

$border-radius-sm: 4px;
$border-radius-md: 6px;
$border-radius-lg: 8px;
$border-radius-xl: 12px;

$border-width: 1px;
$border-color: $color-card-border;

// ═══════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.12);

// ═══════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════

$transition-fast: 0.15s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;

$easing-ease-in: ease-in;
$easing-ease-out: ease-out;
$easing-ease-in-out: ease-in-out;
```

---

## 🎨 Mixins

### Shadow Mixin

```scss
@mixin sakai-shadow($level: 'md') {
  @if $level == 'sm' {
    box-shadow: $shadow-sm;
  } @else if $level == 'md' {
    box-shadow: $shadow-md;
  } @else if $level == 'lg' {
    box-shadow: $shadow-lg;
  } @else if $level == 'xl' {
    box-shadow: $shadow-xl;
  }
}
```

**Usage:**

```scss
.sakai-card {
  @include sakai-shadow('md');
}
```

### Hover Lift Effect

```scss
@mixin hover-lift() {
  transition:
    transform $transition-normal,
    box-shadow $transition-normal;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
```

**Usage:**

```scss
.sakai-card {
  @include hover-lift();
}
```

### Responsive Padding

```scss
@mixin responsive-padding() {
  padding: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-md;
  }

  @media (max-width: $breakpoint-xs) {
    padding: $spacing-sm;
  }
}
```

**Usage:**

```scss
.sakai-page {
  @include responsive-padding();
}
```

### Typography Mixin

```scss
@mixin heading-style($level: 1) {
  font-family: $font-family-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  line-height: $line-height-tight;

  @if $level == 1 {
    font-size: $font-size-4xl;
    margin-bottom: $spacing-lg;
  } @else if $level == 2 {
    font-size: $font-size-3xl;
    margin-bottom: $spacing-md;
  } @else if $level == 3 {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-md;
  } @else if $level == 4 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-sm;
  }
}

h1 {
  @include heading-style(1);
}
h2 {
  @include heading-style(2);
}
h3 {
  @include heading-style(3);
}
h4 {
  @include heading-style(4);
}
```

### Flex Utilities

```scss
@mixin flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between() {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column() {
  display: flex;
  flex-direction: column;
}
```

---

## 🏗️ Component SCSS

### Card Styles

```scss
// Base card
.sakai-card {
  background-color: $color-card-bg;
  border-radius: $border-radius-lg;
  border: none;
  @include sakai-shadow('md');
  margin-bottom: $spacing-lg;
  overflow: hidden;

  // Card header
  .sakai-card-header {
    background-color: #f9f9f9;
    border-bottom: $border-width solid $color-card-border;
    padding: $spacing-md;
    @include flex-between();

    .sakai-card-title {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin: 0;
    }
  }

  // Card body
  :deep(.q-card__section) {
    padding: $spacing-md;

    &:last-child {
      padding-bottom: $spacing-md;
    }
  }

  // Card footer
  .sakai-card-footer {
    border-top: $border-width solid $color-card-border;
    padding: $spacing-md;
    background-color: #fafafa;
    @include flex-between();
  }

  // Hover effect
  @include hover-lift();
}
```

### Sidebar Styles

```scss
// Sidebar menu
.sakai-sidebar {
  background-color: $color-sidebar-bg;
  color: $color-sidebar-text;

  :deep(.q-item) {
    padding: $spacing-sm $spacing-md;
    margin: $spacing-xs $spacing-sm;
    border-radius: $border-radius-md;
    color: $color-sidebar-text;
    transition: all $transition-normal;
    font-size: $font-size-sm;

    // Icons
    .q-icon {
      color: $color-sidebar-text;
      margin-right: $spacing-md;
    }

    // Hover state
    &:hover {
      background-color: $color-sidebar-hover;
      color: $color-sidebar-text-hover;

      .q-icon {
        color: $color-sidebar-text-hover;
      }
    }

    // Active state
    &.q-router-link--active {
      background-color: $color-sidebar-active;
      color: #ffffff;

      .q-icon {
        color: #ffffff;
      }
    }
  }

  // Expansion items
  :deep(.q-expansion-item) {
    .q-expansion-item__header {
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;

      &:hover {
        background-color: $color-sidebar-hover;
      }
    }

    .q-expansion-item__content {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 0;
    }
  }
}
```

### Table Styles

```scss
.sakai-table {
  // Card wrapper
  :deep(.q-table__card) {
    background-color: $color-card-bg;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-md;
    overflow: hidden;
  }

  // Header
  :deep(.q-table__head) {
    background-color: #f9f9f9;

    tr {
      border-bottom: $border-width solid $color-card-border;
    }

    th {
      color: $color-text-primary;
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
      padding: $spacing-md;
      text-transform: none;
    }
  }

  // Rows
  :deep(.q-table__row) {
    border-bottom: $border-width solid $color-card-border;
    transition: background-color $transition-fast;

    &:hover {
      background-color: #f9f9f9;
    }

    td {
      padding: $spacing-md;
      color: $color-text-primary;
      font-size: $font-size-base;
    }
  }

  // No data message
  :deep(.q-table__body-nodata) {
    padding: $spacing-xl;
    text-align: center;
    color: $color-text-secondary;
  }
}
```

### Form Input Styles

```scss
// Input wrapper
:deep(.q-field) {
  margin-bottom: $spacing-md;

  // Label
  .q-field__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
  }

  // Control area
  .q-field__control {
    font-size: $font-size-base;
    color: $color-text-primary;
  }

  // Outlined variant
  &.q-field--outlined {
    .q-field__control {
      padding: 10px 14px;
      border-radius: $border-radius-sm;
      border: $border-width solid $color-card-border;
      background-color: #ffffff;
      transition:
        border-color $transition-fast,
        box-shadow $transition-fast;

      &:hover {
        border-color: $color-text-light;
      }

      &:focus-within {
        border-color: $color-primary;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }
    }

    // Placeholder
    input::placeholder {
      color: $color-text-secondary;
    }

    // Error state
    &.q-field--error {
      .q-field__control {
        border-color: $color-danger;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
      }
    }
  }
}

// Button styles
:deep(.q-btn) {
  border-radius: $border-radius-sm;
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
  padding: 8px 16px;
  text-transform: none;
  transition: all $transition-fast;

  // Primary
  &.bg-primary {
    background-color: $color-primary;

    &:hover {
      background-color: darken($color-primary, 5%);
    }
  }

  // Outline
  &.q-btn--outline {
    border: $border-width solid $color-primary;
    color: $color-primary;

    &:hover {
      background-color: rgba(25, 118, 210, 0.05);
    }
  }

  // Danger
  &.bg-negative {
    background-color: $color-danger;

    &:hover {
      background-color: darken($color-danger, 5%);
    }
  }
}
```

---

## 📋 Spacing System

**Use these constants for consistent spacing:**

```scss
// Margin
.mt-xs {
  margin-top: $spacing-xs;
}
.mt-sm {
  margin-top: $spacing-sm;
}
.mt-md {
  margin-top: $spacing-md;
}
.mt-lg {
  margin-top: $spacing-lg;
}
.mt-xl {
  margin-top: $spacing-xl;
}

// Padding
.p-sm {
  padding: $spacing-sm;
}
.p-md {
  padding: $spacing-md;
}
.p-lg {
  padding: $spacing-lg;
}
.p-xl {
  padding: $spacing-xl;
}

// Gap (for flex/grid)
.gap-sm {
  gap: $spacing-sm;
}
.gap-md {
  gap: $spacing-md;
}
.gap-lg {
  gap: $spacing-lg;
}
```

---

## 🎯 Usage in Components

**Example Vue component with SCSS:**

```vue
<template>
  <q-card class="sakai-card">
    <q-card-section class="sakai-card-header">
      <h3 class="sakai-card-title">Tournaments</h3>
    </q-card-section>
    <q-card-section class="sakai-card-body">
      <q-table :rows="tournaments" :columns="columns" class="sakai-table" />
    </q-card-section>
  </q-card>
</template>

<script setup>
// Vue logic here
</script>

<style scoped lang="scss">
@import '@/css/bt-variables.scss';

// Component styles here
.sakai-card {
  // Already has styles from global SCSS
}

// Add component-specific styles
.tournament-actions {
  @include flex-between();
  margin-top: $spacing-md;
}
</style>
```

---

## ✅ SCSS File Organization

**Recommended project structure:**

```
src/css/
├── bt-variables.scss      # All variables & mixins
├── sakai-global.scss         # Global resets, base styles
├── bt-components.scss     # Card, table, form styles
└── index.scss                # Import all above
```

**In `quasar.conf.js`:**

```javascript
framework: {
  config: {
    // ...
  },
  scss: ['src/css/index.scss']
}
```

---

## 🔍 Quick Reference

| Task         | SCSS                                    |
| ------------ | --------------------------------------- |
| Card styling | Use `.sakai-card` class                 |
| Spacing      | Use `$spacing-xs` to `$spacing-xl`      |
| Colors       | Use `$color-*` variables                |
| Shadows      | Use `@include sakai-shadow()`           |
| Hover effect | Use `@include hover-lift()`             |
| Responsive   | Use `@media (max-width: $breakpoint-*)` |
| Typography   | Use heading mixins                      |
| Borders      | Use `$border-radius-*`                  |
