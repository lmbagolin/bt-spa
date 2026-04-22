# Quasar Components → Sakai Patterns Mapping

> Map Quasar components to Sakai design patterns. **Always use Quasar components, never raw HTML.**

---

## 🎯 Quick Lookup

| UI Need         | Sakai Pattern  | Quasar Component              | Docs                                                                                          |
| --------------- | -------------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| Header/Topbar   | Fixed header   | `<q-header>` + `<q-toolbar>`  | [q-header](https://quasar.dev/layout/header-and-footer)                                       |
| Navigation menu | Dark sidebar   | `<q-drawer>` + `<q-list>`     | [q-drawer](https://quasar.dev/layout/drawer), [q-list](https://quasar.dev/components/list)    |
| Button          | Various styles | `<q-btn>`                     | [q-btn](https://quasar.dev/components/button)                                                 |
| Card/Section    | White card box | `<q-card>`                    | [q-card](https://quasar.dev/components/card)                                                  |
| Form input      | Text field     | `<q-input>`                   | [q-input](https://quasar.dev/components/input)                                                |
| Select/Dropdown | Select options | `<q-select>`                  | [q-select](https://quasar.dev/components/select)                                              |
| Table/Grid      | Data table     | `<q-table>`                   | [q-table](https://quasar.dev/components/table)                                                |
| Dialog/Modal    | Popup window   | `<q-dialog>`                  | [q-dialog](https://quasar.dev/components/dialog)                                              |
| Alert/Toast     | Notification   | `<q-banner>` or Notify plugin | [q-banner](https://quasar.dev/components/banner), [Notify](https://quasar.dev/plugins/notify) |
| Tabs            | Tabbed content | `<q-tabs>`                    | [q-tabs](https://quasar.dev/components/tabs)                                                  |
| Progress        | Loading bar    | `<q-linear-progress>`         | [q-linear-progress](https://quasar.dev/components/linear-progress)                            |
| Checkbox        | Toggle option  | `<q-checkbox>`                | [q-checkbox](https://quasar.dev/components/checkbox)                                          |
| Radio           | Single choice  | `<q-radio>`                   | [q-radio](https://quasar.dev/components/radio)                                                |
| Toggle          | On/Off switch  | `<q-toggle>`                  | [q-toggle](https://quasar.dev/components/toggle)                                              |

---

## 📦 Layout Components

### Topbar (Header)

**Sakai Pattern:**

```
[Logo] [Hamburger] [Title] [Spacer] [Notifications] [User Menu]
```

**Quasar Implementation:**

```vue
<q-header elevated>
  <q-toolbar>
    <q-btn flat dense round icon="menu" @click="toggleMenu" />
    <q-toolbar-title>App Name</q-toolbar-title>
    <q-space />
    <q-btn flat dense round icon="notifications" />
    <q-btn flat dense round icon="account_circle" />
  </q-toolbar>
</q-header>
```

**SCSS Styling:**

```scss
:deep(.q-header) {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

:deep(.q-toolbar) {
  height: 70px;
  padding: 0 24px;
}
```

---

### Sidebar (Navigation Menu)

**Sakai Pattern:**

```
[Logo]
─────────────
[Dashboard]  ← Active (blue bg)
[Tournaments]
[Matches]
  [Detail 1]
  [Detail 2]
```

**Quasar Implementation:**

```vue
<q-drawer side="left" bordered :breakpoint="1024">
  <q-list>
    <q-item
      v-for="item in menuItems"
      :key="item.path"
      :to="item.path"
      clickable
      exact-active
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>
        {{ item.label }}
      </q-item-section>
    </q-item>

    <!-- Expandable submenu -->
    <q-expansion-item
      icon="sports"
      label="Tournaments"
      header-class="sakai-menu-item"
    >
      <q-list>
        <q-item to="/tournaments/upcoming" clickable>
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>
          <q-item-section>Upcoming</q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </q-list>
</q-drawer>
```

**SCSS Styling:**

```scss
:deep(.q-drawer) {
  background-color: #2c3e50;

  .q-item {
    color: #bdc3c7;
    margin: 4px 8px;
    border-radius: 6px;
    padding: 12px 16px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }

    &.q-router-link--active {
      background-color: #1976d2;
      color: #ffffff;
    }
  }
}
```

---

## 🎨 Form Components

### Text Input

**Sakai Pattern:**

```
Label
┌──────────────────┐
│ Type here...     │
└──────────────────┘
```

**Quasar Implementation:**

```vue
<q-input v-model="formData.name" label="Tournament Name" outlined dense class="sakai-input" />
```

**SCSS Styling:**

```scss
:deep(.q-field) {
  margin-bottom: 16px;

  .q-field__label {
    font-size: 13px;
    font-weight: 500;
    color: #2c3e50;
  }

  .q-field__control {
    font-size: 14px;
  }
}

:deep(.q-field--outlined .q-field__control) {
  padding: 12px 14px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;

  &:hover {
    border-color: #bdc3c7;
  }

  &:focus-within {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }
}
```

### Select/Dropdown

**Quasar Implementation:**

```vue
<q-select
  v-model="formData.category"
  :options="categories"
  label="Category"
  outlined
  dense
  emit-value
  map-options
/>
```

### Checkbox

**Quasar Implementation:**

```vue
<q-checkbox v-model="formData.isActive" label="Active" />
```

### Toggle/Switch

**Quasar Implementation:**

```vue
<q-toggle v-model="formData.isPublic" label="Public" />
```

---

## 📊 Data Display Components

### Card (Section Container)

**Sakai Pattern:**

```
┌─────────────────────┐
│ Card Title          │
├─────────────────────┤
│ Content here        │
│ More content        │
└─────────────────────┘
```

**Quasar Implementation:**

```vue
<q-card class="sakai-card">
  <q-card-section class="sakai-card-header">
    <div class="text-h6">Card Title</div>
  </q-card-section>
  <q-separator />
  <q-card-section>
    <!-- Content -->
  </q-card-section>
</q-card>
```

**SCSS Styling:**

```scss
.sakai-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: none;
  margin-bottom: 24px;

  .sakai-card-header {
    background-color: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
    padding: 16px;
  }

  :deep(.q-card__section) {
    padding: 16px;
  }
}
```

### Table

**Sakai Pattern:**

```
┌────────────┬──────────┬──────────┐
│ Name       │ Status   │ Action   │
├────────────┼──────────┼──────────┤
│ Item 1     │ Active   │ [Edit]   │
│ Item 2     │ Pending  │ [Edit]   │
└────────────┴──────────┴──────────┘
```

**Quasar Implementation:**

```vue
<q-table :rows="tournaments" :columns="columns" row-key="id" class="sakai-table" bordered square />
```

**SCSS Styling:**

```scss
.sakai-table {
  :deep(.q-table__card) {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  :deep(.q-table__head tr, .q-table__row) {
    border-bottom: 1px solid #e0e0e0;
  }

  :deep(.q-table__head tr) {
    background-color: #f9f9f9;

    th {
      color: #2c3e50;
      font-weight: 600;
      padding: 12px 16px;
    }
  }

  :deep(.q-table__row) {
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
```

---

## 🎯 Actions & Feedback

### Button Styles

**Primary (Blue)**

```vue
<q-btn label="Save" color="primary" unelevated />
```

**Secondary (Outlined)**

```vue
<q-btn label="Cancel" outline color="primary" />
```

**Danger (Red)**

```vue
<q-btn label="Delete" color="negative" unelevated />
```

**SCSS:**

```scss
:deep(.q-btn) {
  border-radius: 4px;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 14px;
  text-transform: none;

  &.bg-primary {
    background-color: #1976d2;
  }

  &.text-primary {
    color: #1976d2;
  }

  &.bg-negative {
    background-color: #e74c3c;
  }
}
```

### Notifications (Toast)

**Quasar Implementation:**

```javascript
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Success
$q.notify({
  type: 'positive',
  message: 'Tournament created successfully',
  icon: 'check_circle',
});

// Error
$q.notify({
  type: 'negative',
  message: 'Error saving tournament',
  icon: 'error',
});
```

### Banner/Alert

**Quasar Implementation:**

```vue
<q-banner v-if="hasErrors" class="bg-red-2 text-red-9" icon="warning">
  Please fix the following errors...
</q-banner>
```

---

## 📋 Layout Grid

**Sakai Pattern:** Uses a grid-based layout inside main content.

**Quasar Implementation:**

```vue
<div class="row q-col-gutter-lg">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- Card 1 -->
  </div>
  <div class="col-12 col-md-6 col-lg-4">
    <!-- Card 2 -->
  </div>
  <div class="col-12 col-md-6 col-lg-4">
    <!-- Card 3 -->
  </div>
</div>
```

**Column Classes:**

- `col-12`: Full width (mobile)
- `col-md-6`: Half width (tablet)
- `col-lg-4`: Third width (desktop)

---

## ✅ Component Usage Checklist

Before using any component:

- [ ] Using `<q-*>` component, not raw HTML?
- [ ] Component matches Sakai visual style?
- [ ] Applied SCSS styling for Sakai look?
- [ ] Tested on mobile/tablet/desktop?
- [ ] Accessibility: labels, ARIA attributes?
- [ ] Reviewed Quasar docs for this component?

---

## 🔗 Documentation Links

- **All Quasar Components**: https://quasar.dev/components
- **Quasar Layout System**: https://quasar.dev/layout
- **Quasar CSS Grid**: https://quasar.dev/layout/grid
- **Quasar Typography**: https://quasar.dev/style/typography
- **Sakai Reference**: https://sakai.primevue.org/
