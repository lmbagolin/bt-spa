# Beach Tennis SPA - Customized Skills

> Project-specific skills for Quasar 2 + Vue 3 + Pinia + TypeScript SPA
>
> **This guide customizes the Antigravity Kit for your specific frontend stack.**

---

## 🎯 Project Context

| Aspect               | Value                   |
| -------------------- | ----------------------- |
| **Framework**        | Quasar 2 (Vue 3-based)  |
| **Language**         | TypeScript              |
| **State Management** | Pinia                   |
| **Styling**          | SCSS                    |
| **UI Pattern**       | Sakai admin template    |
| **API**              | Axios + Laravel backend |
| **Build Tool**       | Vite (via Quasar)       |
| **Backend**          | Laravel 13 with Sanctum |

---

## ✅ Required Skills for This Project

### Tier 1: Essential (Read First)

These skills are **critical** for any Beach Tennis SPA work:

| Skill                      | Files   | When Required         |
| -------------------------- | ------- | --------------------- |
| **quasar-sakai-design**    | 4 files | EVERY page/component  |
| **vue3-typescript**        | 6 files | EVERY component       |
| **pinia-state-management** | 6 files | Managing state        |
| **api-integration**        | 6 files | Backend communication |

**Load order:** Design → Vue → Pinia → API

---

### Tier 2: Reference (Use As Needed)

These skills provide supplementary guidance:

| Skill                   | When Useful            |
| ----------------------- | ---------------------- |
| `frontend-design`       | UX/design decisions    |
| `testing-patterns`      | Writing tests          |
| `typescript-expert`     | Advanced type patterns |
| `code-review-checklist` | PR reviews             |
| `web-design-guidelines` | Accessibility audit    |

---

## ❌ Skills NOT Applicable

**Skip these entirely for this project:**

| Skill                  | Why                       |
| ---------------------- | ------------------------- |
| `react-best-practices` | We use Vue 3, not React   |
| `nestjs-expert`        | Backend uses Laravel      |
| `prisma-expert`        | Backend uses Eloquent ORM |
| `python-patterns`      | Not used in SPA           |
| `mobile-design`        | Web SPA only              |
| `game-development`     | Not a game                |
| `seo-fundamentals`     | Internal app, no SEO      |
| `tailwind-patterns`    | We use SCSS + Quasar      |

---

## 📚 Skill Reference

### quasar-sakai-design

**Custom skill for this project ✨**

- **Location**: `skills/quasar-sakai-design/`
- **Files**:
  - `SKILL.md` - Overview
  - `layout-structure.md` - Sakai sidebar/topbar layout
  - `quasar-components-mapping.md` - Quasar → Sakai patterns
  - `color-theme.md` - Colors, dark mode, theming
  - `scss-patterns.md` - SCSS mixins, variables, utilities

**Use for:**

- ✅ Building any UI component
- ✅ Creating pages/layouts
- ✅ Styling anything visual
- ✅ Responsive design
- ✅ Color/theme decisions

**Key files in project:**

- `src/css/bt-variables.scss` - SCSS variables
- `src/layouts/SakaiLayout.vue` - Main layout
- `src/components/**` - All styled components

---

### vue3-typescript

**Custom skill for this project ✨**

- **Location**: `skills/vue3-typescript/`
- **Files**:
  - `SKILL.md` - Overview
  - `component-patterns.md` - Component structure
  - `typescript-patterns.md` - Type definitions
  - `composition-api.md` - Composition API usage
  - `composables-patterns.md` - Custom hooks

**Use for:**

- ✅ Creating/updating components
- ✅ Type-safe development
- ✅ Handling component logic
- ✅ Creating reusable composables
- ✅ Form handling

**Key concept:** Always use `<script setup>` + TypeScript

**Key files in project:**

- `src/components/**` - All components
- `src/pages/**` - All pages
- `src/composables/**` - Reusable hooks

---

### pinia-state-management

**Custom skill for this project ✨**

- **Location**: `skills/pinia-state-management/`
- **Files**:
  - `SKILL.md` - Overview
  - `store-patterns.md` - Store structure
  - `actions-api.md` - API integration in stores
  - `getters-computed.md` - Derived state
  - `types-patterns.md` - TypeScript types
  - `best-practices.md` - Recommendations

**Use for:**

- ✅ Managing global state
- ✅ Async operations (API calls)
- ✅ Derived/computed values
- ✅ Cross-component communication

**Key pattern:**

```typescript
// Composition API store
export const useXyzStore = defineStore('xyz', () => {
  const state = ref()
  const action = async () => { ... }
  return { state, action }
})
```

**Key files in project:**

- `src/stores/**` - All Pinia stores
  - `tournament.ts`
  - `match.ts`
  - `player.ts`
  - `ui.ts` (UI state)

---

### api-integration

**Custom skill for this project ✨**

- **Location**: `skills/api-integration/`
- **Files**:
  - `SKILL.md` - Overview
  - `client-setup.md` - Axios configuration
  - `service-layer.md` - Service pattern
  - `error-handling.md` - Error strategies
  - `interceptors.md` - Request/response handling
  - `authentication.md` - Sanctum auth

**Use for:**

- ✅ Backend API communication
- ✅ Request/response handling
- ✅ Error management
- ✅ Authentication setup

**Key pattern:**

```typescript
// services/tournament.ts
export async function getTournaments(): Promise<Tournament[]> {
  const response = await api.get('/tournaments');
  return response.data;
}

// Use in store actions
const tournaments = await tournamentService.getTournaments();
```

**Key files in project:**

- `src/services/api.ts` - Axios instance
- `src/services/tournament.ts`
- `src/services/match.ts`
- `src/services/player.ts`

---

## 🔄 Skill Interaction Map

```
Component Page
      ↓
Uses Pinia Store (pinia-state-management)
      ↓
Store Action calls API Service (api-integration)
      ↓
Component styled with (quasar-sakai-design)
      ↓
Component logic with (vue3-typescript)
```

---

## 📋 Common Task Flowcharts

### Building a Page

```
1. vue3-typescript [component-patterns.md]
   └─ Create page component with <script setup>

2. pinia-state-management [store-patterns.md]
   └─ Create or update store

3. api-integration [service-layer.md]
   └─ Create service functions

4. pinia-state-management [actions-api.md]
   └─ Add async actions in store

5. quasar-sakai-design [layout-structure.md]
   └─ Define page layout (sidebar, topbar, main)

6. quasar-sakai-design [quasar-components-mapping.md]
   └─ Map components (q-card, q-table, q-form)

7. quasar-sakai-design [scss-patterns.md]
   └─ Apply SCSS styling

8. vue3-typescript [composition-api.md]
   └─ Connect component to store

9. Test on mobile/tablet/desktop
```

### Styling a Component

```
1. quasar-sakai-design [quasar-components-mapping.md]
   └─ Which Quasar component to use?

2. quasar-sakai-design [scss-patterns.md]
   └─ Get SCSS mixins/variables

3. quasar-sakai-design [color-theme.md]
   └─ Choose colors from palette

4. Apply SCSS in <style scoped lang="scss">
   └─ Import bt-variables.scss
   └─ Use $color-*, $spacing-*, @include
```

---

## 🎯 Agent Recommendations

When working with Claude agents:

### Use `frontend-specialist` agent

- **Best for**: Page layouts, component design, UI patterns
- **Load skills**: `quasar-sakai-design`, `vue3-typescript`, `frontend-design`
- **Context**: "I'm building a Quasar SPA with Sakai design"

### Use `debugger` agent

- **Best for**: Troubleshooting errors
- **Load skills**: Relevant skill (e.g., `vue3-typescript`)

### Use `test-engineer` agent

- **Best for**: Writing tests
- **Load skills**: `testing-patterns`, `vue3-typescript`

### Use `code-archaeologist` agent

- **Best for**: Refactoring, cleanup
- **Load skills**: `code-review-checklist`, `vue3-typescript`

---

## ✅ Project Readiness Checklist

### Setup (One-time)

- [ ] Quasar 2 installed with Vite
- [ ] Vue 3 (via Quasar)
- [ ] TypeScript configured
- [ ] Pinia store installed
- [ ] Axios installed
- [ ] SCSS global variables created (`src/css/bt-variables.scss`)
- [ ] Main layout created (`src/layouts/SakaiLayout.vue`)

### For Each Feature

- [ ] Use `vue3-typescript` for component structure
- [ ] Use `quasar-sakai-design` for styling
- [ ] Use `pinia-state-management` for state
- [ ] Use `api-integration` for API calls
- [ ] All components use `<script setup>` + TypeScript
- [ ] All styling uses SCSS + variables
- [ ] Responsive design tested
- [ ] Error states handled
- [ ] Loading states shown

---

## 🚀 Quick Skill Loading

**When you ask Claude to work on the SPA, mention:**

```
"I'm working on a Quasar 2 SPA with Vue 3, Pinia, and
TypeScript. The design follows the Sakai admin template pattern.
Use the quasar-sakai-design, vue3-typescript, pinia-state-management,
and api-integration skills from the SPA project."
```

---

## 📖 Reading Order

**If you're new to the project:**

1. **First Day**: Read these in order
   - `quasar-sakai-design/SKILL.md`
   - `quasar-sakai-design/layout-structure.md`
   - `vue3-typescript/SKILL.md`
   - `vue3-typescript/component-patterns.md`

2. **Second Day**: Continue with
   - `pinia-state-management/SKILL.md`
   - `pinia-state-management/store-patterns.md`
   - `api-integration/SKILL.md`
   - `api-integration/service-layer.md`

3. **Then**: Reference as needed
   - Other files in each skill
   - External docs (Quasar, Vue, etc.)

---

## 🔗 Project Resources

| Resource       | Link                        | Use For             |
| -------------- | --------------------------- | ------------------- |
| Quasar Docs    | https://quasar.dev          | Component reference |
| Vue 3 Docs     | https://vuejs.org           | Vue patterns        |
| Pinia Docs     | https://pinia.vuejs.org     | State management    |
| Axios Docs     | https://axios-http.com      | HTTP client         |
| Sakai Template | https://sakai.primevue.org/ | Design reference    |
| Laravel API    | https://laravel.com/docs/13 | Backend reference   |

---

## 💬 Quick Help

| Question                       | Skill                    | File                           |
| ------------------------------ | ------------------------ | ------------------------------ |
| How to create a component?     | `vue3-typescript`        | `component-patterns.md`        |
| How to style something?        | `quasar-sakai-design`    | `scss-patterns.md`             |
| How to manage state?           | `pinia-state-management` | `store-patterns.md`            |
| How to call API?               | `api-integration`        | `service-layer.md`             |
| Which Quasar component to use? | `quasar-sakai-design`    | `quasar-components-mapping.md` |
| How to handle errors?          | `api-integration`        | `error-handling.md`            |
| How to make responsive?        | `quasar-sakai-design`    | `layout-structure.md`          |

---

**Project**: Beach Tennis SPA
**Last Updated**: 2026-04-21
**Stack**: Quasar 2 + Vue 3 + Pinia + TypeScript + SCSS
