---
name: vue3-typescript
description: Vue 3 + TypeScript patterns, composition API, component design, and type safety. Optimized for Quasar SPA projects.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Vue 3 + TypeScript Patterns

> **Philosophy:** Vue 3 Composition API with strict TypeScript for type safety and maintainability.
> **Context:** Beach Tennis SPA with Quasar 2, Pinia state management, and Axios API calls.

---

## 📋 Quick Reference

| Need                | File                                               |
| ------------------- | -------------------------------------------------- |
| Component structure | [component-patterns.md](component-patterns.md)     |
| TypeScript types    | [typescript-patterns.md](typescript-patterns.md)   |
| Composition API     | [composition-api.md](composition-api.md)           |
| Hooks/Composables   | [composables-patterns.md](composables-patterns.md) |
| Vue Router setup    | [router-setup.md](router-setup.md)                 |
| Error handling      | [error-handling.md](error-handling.md)             |

---

## 🔗 Related Skills

| Need                | Skill                                                            |
| ------------------- | ---------------------------------------------------------------- |
| UI/Layout styling   | `@[skills/quasar-sakai-design]`                                  |
| State management    | `@[skills/pinia-state-management]`                               |
| API communication   | `@[skills/api-integration]`                                      |
| Component libraries | Use `@[skills/quasar-sakai-design#quasar-components-mapping.md]` |

---

## ✅ Before Starting

- [ ] Read [component-patterns.md](component-patterns.md)?
- [ ] Read [typescript-patterns.md](typescript-patterns.md)?
- [ ] Understand Composition API vs Options API (we use Composition)?
- [ ] Know about `<script setup>` syntax?

---

## 📚 Resources

| Resource          | URL                                              |
| ----------------- | ------------------------------------------------ |
| Vue 3 Docs        | https://vuejs.org                                |
| Vue 3 Guide       | https://vuejs.org/guide/introduction.html        |
| TypeScript in Vue | https://vuejs.org/guide/typescript/overview.html |
| Quasar Components | https://quasar.dev/components                    |
| Pinia Store       | https://pinia.vuejs.org                          |

---

## 🎯 Common Patterns

### "Create a new page component"

1. Read [component-patterns.md](component-patterns.md)
2. Use `<script setup>` syntax
3. Define TypeScript interfaces for props
4. Use Pinia store for state
5. Apply Sakai styling from [quasar-sakai-design](../quasar-sakai-design/SKILL.md)

### "Create a reusable component"

1. Check [component-patterns.md](component-patterns.md) → Reusable Components
2. Expose props with TypeScript `PropType`
3. Emit events with `defineEmits`
4. Document with JSDoc comments

### "Handle API calls"

1. Use composable from [composables-patterns.md](composables-patterns.md)
2. Type response with interfaces
3. Handle errors with try/catch
4. Show loading/error states

### "Add form validation"

1. Use Quasar's `<q-input>` with validation
2. Create validation composable from [composables-patterns.md](composables-patterns.md)
3. Show error messages from Quasar validation
4. Type form data with interfaces

---

## 🚀 Quick Start Example

**Creating a simple page component:**

```vue
<template>
  <q-page class="sakai-page">
    <q-card class="sakai-card">
      <q-card-section class="sakai-card-header">
        <h3 class="sakai-card-title">Tournaments</h3>
      </q-card-section>

      <q-card-section v-if="loading" class="text-center">
        <q-spinner color="primary" size="40px" />
      </q-card-section>

      <q-card-section v-else-if="error" class="bg-negative text-white">
        {{ error }}
      </q-card-section>

      <q-card-section v-else>
        <q-table :rows="tournaments" :columns="columns" class="sakai-table" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTournamentStore } from '@/stores/tournament'

interface Tournament {
  id: string
  name: string
  date: string
  status: 'active' | 'completed' | 'pending'
}

const tournamentStore = useTournamentStore()
const tournaments = ref<Tournament[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
]

onMounted(async () => {
  loading.value = true
  try {
    tournaments.value = await tournamentStore.fetchTournaments()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
@import '@/css/bt-variables.scss';

// Component styles here
</style>
```

---

## 📋 File Organization

**Recommended structure for this SPA:**

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   └── SakaiLayout.vue
│   ├── forms/            # Form components
│   │   ├── TournamentForm.vue
│   │   └── PlayerForm.vue
│   ├── tables/           # Table/list components
│   │   ├── TournamentTable.vue
│   │   └── PlayerTable.vue
│   └── common/           # Reusable components
│       ├── StatusBadge.vue
│       └── LoadingCard.vue
│
├── pages/
│   ├── DashboardPage.vue
│   ├── TournamentsPage.vue
│   ├── MatchesPage.vue
│   └── PlayersPage.vue
│
├── stores/               # Pinia stores
│   ├── tournament.ts
│   ├── match.ts
│   ├── player.ts
│   └── ui.ts
│
├── composables/          # Reusable composition API hooks
│   ├── useForm.ts
│   ├── useFetch.ts
│   ├── useTournament.ts
│   └── useValidation.ts
│
├── services/
│   ├── api.ts            # Axios instance
│   ├── tournament.ts      # Tournament API calls
│   ├── match.ts
│   └── player.ts
│
├── types/
│   ├── models.ts         # Data models
│   ├── api.ts            # API responses
│   └── ui.ts             # UI state types
│
└── css/
    ├── bt-variables.scss
    ├── sakai-global.scss
    └── index.scss
```

---

## 🎯 Decision Checklist

- [ ] Using `<script setup>` syntax?
- [ ] All props/emits typed with TypeScript?
- [ ] Component has clear, single responsibility?
- [ ] Reusable logic extracted to composables?
- [ ] Proper error handling and loading states?
- [ ] Sakai styling applied correctly?
- [ ] Tested on mobile/tablet/desktop?
- [ ] TypeScript compiler shows no errors?

---

## ⚠️ Common Pitfalls

| Pitfall                        | Solution                           |
| ------------------------------ | ---------------------------------- |
| Props not typed                | Use `PropType<Interface>`          |
| Magic strings                  | Use TypeScript enums or constants  |
| Missing null checks            | Use `?.` optional chaining         |
| Not handling errors            | Always wrap API calls in try/catch |
| CSS leaking between components | Use `scoped` attribute             |
| Props drilling                 | Use Pinia for shared state         |

---

## 🔄 Workflow

1. **Plan**: What does the component do? What props/data?
2. **Type**: Define TypeScript interfaces
3. **Markup**: Create HTML structure
4. **Logic**: Implement component logic in `<script setup>`
5. **Style**: Add SCSS from Sakai design system
6. **Test**: Check on different screen sizes

---

## 📚 Key Concepts

### Composition API (vs Options API)

- ✅ **USE**: Composition API (`ref`, `computed`, `watch`)
- ❌ **DON'T USE**: Options API (`data()`, `methods()`, `watch:`)

### `<script setup>` Syntax

- ✅ **USE**: `<script setup lang="ts">`
- ❌ **DON'T USE**: `<script>` with `export default`

### Type Safety

- ✅ Always define types for props, emits, computed
- ✅ Use TypeScript interfaces for data
- ✅ Avoid `any` type

---

**For detailed patterns, see:**

- [component-patterns.md](component-patterns.md) - Component structure
- [typescript-patterns.md](typescript-patterns.md) - Type definitions
- [composition-api.md](composition-api.md) - API usage
- [composables-patterns.md](composables-patterns.md) - Reusable hooks
