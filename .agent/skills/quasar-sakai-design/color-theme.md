# Sakai Color & Theme System

> Colors, theming, and dark mode for Quasar + Sakai design system.

---

## 🎨 Sakai Color Palette

### Primary Colors

```
BLUE (Primary)          GRAY (Neutral)
#1976d2 (Main)          #ecf0f1 (Lightest)
#1565c0 (Darker)        #bdc3c7 (Light)
#2196f3 (Lighter)       #7f8c8d (Medium)
#64b5f6 (Accent)        #34495e (Dark)
                        #2c3e50 (Darkest)
```

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Success | Green | #27ae60 |
| Warning | Orange | #f39c12 |
| Danger | Red | #e74c3c |
| Info | Blue | #3498db |
| Neutral | Gray | #95a5a6 |

---

## 🌈 Light Mode (Default)

### Backgrounds

```scss
// Main areas
$bg-page: #f5f5f5;           // Main content background
$bg-card: #ffffff;            // Card/component backgrounds
$bg-header: #ffffff;          // Topbar background
$bg-sidebar: #2c3e50;         // Sidebar background

// Hover/States
$bg-hover: #f9f9f9;           // Card hover
$bg-input: #ffffff;           // Form input background
$bg-input-focus: #f0f7ff;     // Input focus background
$bg-disabled: #f5f5f5;        // Disabled element background
$bg-overlay: rgba(0, 0, 0, 0.5); // Modal overlay
```

### Text Colors

```scss
// Primary text
$text-primary: #2c3e50;       // Main text color
$text-secondary: #7f8c8d;     // Secondary text (labels, hints)
$text-light: #95a5a6;         // Disabled/placeholder text
$text-inverse: #ffffff;       // Text on dark backgrounds

// Sidebar text
$text-sidebar: #bdc3c7;       // Normal sidebar text
$text-sidebar-active: #ffffff; // Active sidebar item
```

### Borders & Dividers

```scss
$border-color: #e0e0e0;       // Default border color
$border-light: #ecf0f1;       // Light border
$border-dark: #bdc3c7;        // Dark border
$divider-color: #ecf0f1;      // Divider lines
```

### Shadows (Light Mode)

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.12);
```

---

## 🌙 Dark Mode

### Backgrounds

```scss
// Main areas
$dark-bg-page: #1a1a1a;       // Main content background
$dark-bg-card: #2c3e50;       // Card/component backgrounds
$dark-bg-header: #1e1e1e;     // Topbar background
$dark-bg-sidebar: #1a1a1a;    // Sidebar background

// Hover/States
$dark-bg-hover: #34495e;      // Card hover
$dark-bg-input: #2c3e50;      // Form input background
$dark-bg-input-focus: #34495e; // Input focus background
$dark-bg-disabled: #1a1a1a;   // Disabled element background
$dark-bg-overlay: rgba(0, 0, 0, 0.7); // Modal overlay
```

### Text Colors

```scss
$dark-text-primary: #ecf0f1;  // Main text color
$dark-text-secondary: #95a5a6; // Secondary text
$dark-text-light: #7f8c8d;    // Disabled/placeholder text
$dark-text-inverse: #2c3e50;  // Text on light backgrounds
```

### Borders & Dividers

```scss
$dark-border-color: #34495e;  // Default border color
$dark-border-light: #2c3e50;  // Light border
$dark-border-dark: #1a1a1a;   // Dark border
$dark-divider-color: #34495e; // Divider lines
```

### Shadows (Dark Mode)

```scss
$dark-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
$dark-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.4);
$dark-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.5);
$dark-shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.6);
```

---

## 🎨 Quasar Theme Configuration

### In `quasar.conf.js`

```javascript
module.exports = function (ctx) {
  return {
    framework: {
      config: {
        dark: false, // Set to 'auto' for auto-detect
        brand: {
          primary: '#1976d2',
          secondary: '#2c3e50',
          accent: '#9C27B0',
          dark: '#1d1d1d',
          'dark-page': '#121212',
          positive: '#27ae60',
          negative: '#e74c3c',
          info: '#3498db',
          warning: '#f39c12',
        },
        // Add custom CSS variables
        cssVariables: {
          primary: '#1976d2',
          secondary: '#2c3e50',
          'text-primary': '#2c3e50',
          'text-secondary': '#7f8c8d',
          'bg-page': '#f5f5f5',
        }
      }
    }
  }
}
```

---

## 🔄 Dark Mode Implementation

### Using Quasar's Dark Mode

**In any component:**

```vue
<template>
  <div class="my-component">
    <!-- Component content -->
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Toggle dark mode
const toggleDarkMode = () => {
  $q.dark.set(!$q.dark.isActive)
}

// Check if dark mode is active
const isDark = computed(() => $q.dark.isActive)
</script>
```

### SCSS Dark Mode Support

**Use `$q-dark` variable:**

```scss
// Light mode (default)
.my-card {
  background-color: #ffffff;
  color: #2c3e50;
}

// Dark mode
.body--dark .my-card {
  background-color: #2c3e50;
  color: #ecf0f1;
}
```

**Or use mixins:**

```scss
.my-card {
  background-color: #ffffff;
  color: #2c3e50;

  @media (prefers-color-scheme: dark) {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
}
```

---

## 🎨 Applying Colors in Components

### Buttons

```vue
<!-- Primary -->
<q-btn label="Save" color="primary" unelevated />

<!-- Secondary -->
<q-btn label="Cancel" color="secondary" outline />

<!-- Danger -->
<q-btn label="Delete" color="negative" unelevated />

<!-- Success -->
<q-btn label="Confirm" color="positive" unelevated />

<!-- Warning -->
<q-btn label="Alert" color="warning" flat />
```

### Inputs

```vue
<!-- Default -->
<q-input
  v-model="value"
  label="Enter text"
  outlined
/>

<!-- With color -->
<q-input
  v-model="value"
  label="Highlight"
  outlined
  color="primary"
/>

<!-- With warning -->
<q-input
  v-model="value"
  label="Warning"
  outlined
  color="warning"
/>

<!-- With error -->
<q-input
  v-model="value"
  label="Error"
  outlined
  color="negative"
  error
/>
```

### Badges & Chips

```vue
<!-- Status badge -->
<q-badge color="positive" label="Active" />
<q-badge color="warning" label="Pending" />
<q-badge color="negative" label="Inactive" />

<!-- Chip -->
<q-chip
  icon="sports_tennis"
  color="primary"
  text-color="white"
  label="Beach Tennis"
/>
```

---

## 📊 Color Usage Examples

### Table with Status Colors

```vue
<template>
  <q-table
    :rows="rows"
    :columns="columns"
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge
          :color="getStatusColor(props.row.status)"
          :label="props.row.status"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'positive'
    case 'pending': return 'warning'
    case 'inactive': return 'negative'
    default: return 'info'
  }
}
</script>
```

### Alert/Banner with Colors

```vue
<!-- Success alert -->
<q-banner class="bg-positive text-white">
  ✓ Operation completed successfully
</q-banner>

<!-- Warning alert -->
<q-banner class="bg-warning text-white">
  ⚠ Warning: Check your input
</q-banner>

<!-- Error alert -->
<q-banner class="bg-negative text-white">
  ✗ Error: Something went wrong
</q-banner>

<!-- Info alert -->
<q-banner class="bg-info text-white">
  ℹ Information: New update available
</q-banner>
```

---

## 🎯 Gradient Examples

### Sidebar Gradient

```scss
.sakai-sidebar {
  background: linear-gradient(
    135deg,
    #2c3e50 0%,
    #34495e 100%
  );
}
```

### Card Hover Gradient

```scss
.sakai-card {
  &:hover {
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f9f9f9 100%
    );
  }
}
```

### Accent Gradient

```scss
.accent-gradient {
  background: linear-gradient(
    90deg,
    #1976d2 0%,
    #2196f3 100%
  );
}
```

---

## 📱 Responsive Color Adjustments

**On smaller screens, use darker colors for better readability:**

```scss
.text-primary {
  color: #2c3e50;

  @media (max-width: 600px) {
    color: #1a1a1a; // Darker on mobile
  }
}

.bg-page {
  background-color: #f5f5f5;

  @media (max-width: 600px) {
    background-color: #ffffff; // Higher contrast on mobile
  }
}
```

---

## ✅ Color Accessibility Checklist

- [ ] Sufficient contrast ratio (WCAG AA: 4.5:1 for text)?
- [ ] Not relying on color alone for status?
- [ ] Dark mode colors tested?
- [ ] Colorblind-friendly status indicators (icons + color)?
- [ ] Hover states use colors consistently?

---

## 🔗 Color Resources

- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Quasar Colors**: https://quasar.dev/style/color-palette
- **Sakai Template**: https://sakai.primevue.org/
- **Material Design Colors**: https://material.io/design/color/
