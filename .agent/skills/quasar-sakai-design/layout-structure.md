# Sakai Layout Structure in Quasar

## 🏗️ Overall Structure

Sakai uses a **3-part layout**:

1. **Topbar** (Header) - Fixed top
2. **Sidebar** (Navigation) - Left side, collapsible
3. **Main Content** - Scrollable area

```
┌────────────────────────────────────────┐
│           TOPBAR (Header)              │  Height: 60-70px
├─────────────────┬──────────────────────┤
│                 │                      │
│    SIDEBAR      │   MAIN CONTENT       │
│   (250px base)  │                      │
│   Collapsible   │   Scrollable         │
│                 │   with padding       │
└─────────────────┴──────────────────────┘
```

---

## 📐 Dimensions

| Element      | Width     | Height      | Notes                      |
| ------------ | --------- | ----------- | -------------------------- |
| Topbar       | 100%      | 70px        | Fixed, spans full width    |
| Sidebar      | 250px     | Full height | Collapsible to 0 on mobile |
| Main Content | Remaining | Full        | Scrollable, padding: 24px  |

---

## 🎨 Colors (Sakai Pattern)

### Topbar

```scss
// Light version
background-color: #ffffff;
border-bottom: 1px solid #e0e0e0;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

// Dark version
background-color: #2c3e50;
border-bottom: 1px solid #34495e;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
```

### Sidebar

```scss
// Always dark in Sakai pattern
background-color: #2c3e50;
color: #ffffff;
border-right: 1px solid #34495e;

// Hover effects
.menu-item:hover {
  background-color: #34495e;
}

// Active state
.menu-item.active {
  background-color: #1976d2;
  color: #ffffff;
}
```

### Main Content

```scss
background-color: #f5f5f5; // Light gray
// or
background-color: #1a1a1a; // Dark mode

// Cards/sections inside
background-color: #ffffff; // Light mode
background-color: #2c3e50; // Dark mode
```

---

## 🖥️ Quasar Component Implementation

### Basic Layout Template

```vue
<template>
  <q-layout view="hHh lpR fFf">
    <!-- TOPBAR -->
    <q-header elevated class="sakai-header">
      <q-toolbar class="sakai-toolbar">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleSidebar" />
        <q-toolbar-title>Application Name</q-toolbar-title>

        <!-- Right side icons -->
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer
      v-model="showSidebar"
      side="left"
      bordered
      class="sakai-sidebar"
      :width="250"
      :breakpoint="1024"
    >
      <q-list>
        <!-- Menu items -->
        <q-item
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          clickable
          exact-active
          active-class="sakai-active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- MAIN CONTENT -->
    <q-page-container>
      <q-page class="sakai-page">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const showSidebar = ref(true);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const menuItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Tournaments', icon: 'sports_tennis', path: '/tournaments' },
  { label: 'Matches', icon: 'sports', path: '/matches' },
  { label: 'Players', icon: 'people', path: '/players' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
];
</script>

<style scoped lang="scss">
.sakai-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.sakai-toolbar {
  height: 70px;
  padding: 0 24px;
}

.sakai-sidebar {
  background-color: #2c3e50;
  color: #ffffff;

  :deep(.q-item) {
    padding: 12px 16px;
    margin: 4px 8px;
    border-radius: 6px;
    color: #bdc3c7;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }

    &.q-router-link--active {
      background-color: #1976d2;
      color: #ffffff;

      .q-icon {
        color: #ffffff;
      }
    }
  }
}

.sakai-page {
  background-color: #f5f5f5;
  padding: 24px;
  min-height: calc(100vh - 70px);
}

.sakai-active {
  background-color: #1976d2 !important;
  color: #ffffff !important;
}
</style>
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)

- Sidebar always visible
- Width: 250px
- Menu labels visible

### Tablet (600px - 1024px)

- Sidebar collapsible
- Width: 250px when open
- Hamburger menu visible

### Mobile (< 600px)

- Sidebar hidden by default
- Full width when opened
- Overlay mode (sidebar above content)

**Quasar `breakpoint` attribute handles this automatically!**

---

## 🎯 Key Sakai Pattern Elements

### Topbar Features

- Logo/App name (left)
- Menu toggle button (hamburger)
- Notifications (bell icon)
- User profile (avatar)
- Breadcrumbs (optional, in some Sakai variants)

### Sidebar Features

- Logo/branding (top)
- Main menu items with icons
- Sub-menu/expandable items
- Active state highlighting
- Hover effects
- Dark background

### Main Content Features

- Padding around edges (24px)
- Grid-based layout inside
- Cards for grouped content
- Light background
- Scrollable if content exceeds height

---

## 🔧 SCSS Variables (Define in Your Global SCSS)

```scss
// Layout dimensions
$layout-header-height: 70px;
$layout-sidebar-width: 250px;
$layout-sidebar-width-collapsed: 60px;
$layout-main-padding: 24px;

// Colors
$color-sidebar-bg: #2c3e50;
$color-sidebar-text: #bdc3c7;
$color-sidebar-hover: rgba(255, 255, 255, 0.05);
$color-sidebar-active: #1976d2;
$color-topbar-bg: #ffffff;
$color-topbar-border: #e0e0e0;
$color-main-bg: #f5f5f5;
$color-card-bg: #ffffff;

// Transitions
$transition-sidebar: all 0.3s ease;
$transition-menu: all 0.2s ease;
```

---

## 🚀 Usage in Pages

All pages inherit this layout by using the default layout component:

```vue
<!-- pages/Dashboard.vue -->
<template>
  <!-- Automatically wrapped in SakaiLayout -->
  <div class="dashboard-content">
    <!-- Your page content here -->
  </div>
</template>
```

The layout wraps all pages automatically via `src/layouts/SakaiLayout.vue` (or similar).

---

## ✅ Implementation Checklist

- [ ] Topbar has height 70px?
- [ ] Sidebar width 250px base?
- [ ] Sidebar dark background (#2c3e50)?
- [ ] Main content padding 24px?
- [ ] Sidebar collapsible on mobile?
- [ ] Active menu item highlights in blue (#1976d2)?
- [ ] Responsive breakpoint at 1024px?
- [ ] Menu items have icons?
- [ ] Smooth transitions on hover/active?
