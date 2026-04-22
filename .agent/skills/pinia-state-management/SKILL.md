---
name: pinia-state-management
description: Pinia store patterns for Vue 3. State management, actions, getters, and composition with TypeScript.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Pinia State Management

> **Philosophy:** Single source of truth with Pinia. Composition API stores with TypeScript.
> **Context:** Beach Tennis SPA managing Tournament, Match, and Player state.

---

## 📋 Quick Reference

| Need               | File                                       |
| ------------------ | ------------------------------------------ |
| Store structure    | [store-patterns.md](store-patterns.md)     |
| Actions & API      | [actions-api.md](actions-api.md)           |
| Getters & computed | [getters-computed.md](getters-computed.md) |
| TypeScript types   | [types-patterns.md](types-patterns.md)     |
| Best practices     | [best-practices.md](best-practices.md)     |
| Testing stores     | [testing-stores.md](testing-stores.md)     |

---

## 🔗 Related Skills

| Need                | Skill                                              |
| ------------------- | -------------------------------------------------- |
| Vue 3 components    | `@[skills/vue3-typescript]`                        |
| API integration     | `@[skills/api-integration]`                        |
| TypeScript patterns | `@[skills/vue3-typescript#typescript-patterns.md]` |

---

## ✅ Before Starting

- [ ] Read [store-patterns.md](store-patterns.md)?
- [ ] Understand Pinia composition API syntax?
- [ ] Know difference between state/actions/getters?

---

## 🎯 Common Tasks

### "Create a new store for Tournaments"

1. Read [store-patterns.md](store-patterns.md)
2. Define types in [types-patterns.md](types-patterns.md)
3. Create `state` with initial values
4. Add `getters` for computed values
5. Add `actions` for API calls
6. Use in components with `useStore()`

### "Fetch data from API"

1. Check [actions-api.md](actions-api.md)
2. Use axios instance from services
3. Add loading/error state
4. Update state with response
5. Handle errors gracefully

### "Create computed value from store"

1. Read [getters-computed.md](getters-computed.md)
2. Add getter function in store
3. Use in component with `computed()`
4. Test getter logic

---

## 🚀 Quick Start Example

**Create a tournament store:**

```typescript
// src/stores/tournament.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Tournament, CreateTournamentInput } from '@/types/models';
import * as tournamentService from '@/services/tournament';

export const useTournamentStore = defineStore('tournament', () => {
  // STATE
  const tournaments = ref<Tournament[]>([]);
  const selectedTournament = ref<Tournament | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // GETTERS
  const activeTournaments = computed(() => tournaments.value.filter((t) => t.status === 'active'));

  const completedTournaments = computed(() =>
    tournaments.value.filter((t) => t.status === 'completed'),
  );

  const getTournamentById = (id: string) =>
    computed(() => tournaments.value.find((t) => t.id === id));

  // ACTIONS
  const fetchTournaments = async () => {
    loading.value = true;
    error.value = null;
    try {
      tournaments.value = await tournamentService.getTournaments();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createTournament = async (data: CreateTournamentInput) => {
    loading.value = true;
    error.value = null;
    try {
      const newTournament = await tournamentService.createTournament(data);
      tournaments.value.push(newTournament);
      return newTournament;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const selectTournament = (tournament: Tournament) => {
    selectedTournament.value = tournament;
  };

  const clearSelection = () => {
    selectedTournament.value = null;
  };

  // RESET
  const $reset = () => {
    tournaments.value = [];
    selectedTournament.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    tournaments,
    selectedTournament,
    loading,
    error,

    // Getters
    activeTournaments,
    completedTournaments,
    getTournamentById,

    // Actions
    fetchTournaments,
    createTournament,
    selectTournament,
    clearSelection,

    // Reset
    $reset,
  };
});
```

**Use in a component:**

```vue
<template>
  <q-page class="sakai-page">
    <q-card class="sakai-card" v-if="loading">
      <q-spinner color="primary" />
    </q-card>

    <q-banner v-else-if="tournamentStore.error" class="bg-negative text-white">
      {{ tournamentStore.error }}
    </q-banner>

    <q-table
      v-else
      :rows="tournamentStore.activeTournaments"
      :columns="columns"
      class="sakai-table"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTournamentStore } from '@/stores/tournament';

const tournamentStore = useTournamentStore();

const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'date', label: 'Date', field: 'date' },
  { name: 'status', label: 'Status', field: 'status' },
];

onMounted(() => {
  tournamentStore.fetchTournaments();
});
</script>
```

---

## 📚 Resources

| Resource          | URL                                                      |
| ----------------- | -------------------------------------------------------- |
| Pinia Docs        | https://pinia.vuejs.org                                  |
| Pinia API         | https://pinia.vuejs.org/api/                             |
| Vue 3 Composition | https://vuejs.org/guide/extras/composition-api-faq.html  |
| State Management  | https://vuejs.org/guide/scaling-up/state-management.html |

---

## 🎯 Store Architecture

### Types of Stores

| Type               | Use Case                       | Pattern                |
| ------------------ | ------------------------------ | ---------------------- |
| **Domain stores**  | Tournament, Player, Match data | API sync, caching      |
| **UI stores**      | Modal state, sidebar, theme    | Local state only       |
| **Session stores** | User auth, permissions         | API sync + persistence |

### Store Naming

```typescript
// Domain stores (plural nouns)
useTournamentStore(); // ✅
usePlayerStore(); // ✅
useMatchStore(); // ✅

// UI stores (UI-specific)
useUIStore(); // ✅
useModalStore(); // ✅
useThemeStore(); // ✅

// Session stores
useAuthStore(); // ✅
useUserStore(); // ✅
```

---

## 🔄 State Management Flow

```
Component renders
       ↓
Uses store with composable: const store = useStore()
       ↓
Accesses computed getters: store.activeTournaments
       ↓
Triggers action: store.fetchTournaments()
       ↓
Action updates state: tournaments.value = [...]
       ↓
Computed updates automatically
       ↓
Component re-renders
```

---

## ⚠️ Common Pitfalls

| Pitfall                 | Solution                                  |
| ----------------------- | ----------------------------------------- |
| Mutating state directly | Only mutate in actions, not in components |
| API calls in components | Move to store actions                     |
| Missing error handling  | Always wrap in try/catch                  |
| Stale data              | Use loading/error states properly         |
| Memory leaks            | Clean up subscriptions in `onUnmounted`   |
| Circular dependencies   | Keep stores focused on one domain         |

---

## ✅ Store Checklist

- [ ] State properties initialized?
- [ ] All mutations/changes in actions?
- [ ] Error handling in all async actions?
- [ ] Loading states for async operations?
- [ ] Proper TypeScript types defined?
- [ ] Getters for computed values?
- [ ] `$reset()` method for cleanup?
- [ ] Store not doing too much (single responsibility)?

---

**For detailed patterns, see:**

- [store-patterns.md](store-patterns.md) - Full store structure
- [actions-api.md](actions-api.md) - API integration in actions
- [getters-computed.md](getters-computed.md) - Derived state
- [types-patterns.md](types-patterns.md) - TypeScript definitions
- [best-practices.md](best-practices.md) - Recommendations
