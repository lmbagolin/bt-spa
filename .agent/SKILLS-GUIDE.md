# Beach Tennis SPA - Skills Guide

> Comprehensive guide to using skills for Beach Tennis frontend SPA development.
> **Stack**: Quasar 2, Vue 3, Pinia, TypeScript, SCSS

---

## 🎯 Quick Skill Selector

### "I need to..."

| Task                          | Primary Skill            | Secondary Skills                                |
| ----------------------------- | ------------------------ | ----------------------------------------------- |
| **Build a page/route**        | `vue3-typescript`        | `quasar-sakai-design`, `pinia-state-management` |
| **Style the UI**              | `quasar-sakai-design`    | `frontend-design`                               |
| **Create reusable component** | `vue3-typescript`        | `quasar-sakai-design`                           |
| **Manage application state**  | `pinia-state-management` | `vue3-typescript`                               |
| **Call backend API**          | `api-integration`        | `pinia-state-management`                        |
| **Handle form validation**    | `vue3-typescript`        | `quasar-sakai-design`                           |
| **Build admin dashboard**     | `quasar-sakai-design`    | `vue3-typescript`, `pinia-state-management`     |
| **Responsive layout**         | `quasar-sakai-design`    | `frontend-design`                               |
| **Debug issues**              | Use `debugger` agent     | Relevant skill                                  |
| **Test component**            | `testing-patterns`       | `vue3-typescript`                               |

---

## 📚 Available Skills

### Core Frontend Skills (For This Project)

| Skill                      | Focus                      | When to Use               |
| -------------------------- | -------------------------- | ------------------------- |
| **quasar-sakai-design**    | UI/Layout + Sakai patterns | Every component/page      |
| **vue3-typescript**        | Components + Type safety   | Building components/pages |
| **pinia-state-management** | State management           | Managing app state        |
| **api-integration**        | Backend communication      | API calls                 |
| **frontend-design**        | UX/accessibility           | Design decisions          |

### Generic Skills (Available)

| Skill                   | Focus                                                           | Use Selectively        |
| ----------------------- | --------------------------------------------------------------- | ---------------------- |
| `react-best-practices`  | React patterns (not directly applicable, but concepts transfer) | Reference only         |
| `web-design-guidelines` | UX audit, accessibility                                         | Accessibility reviews  |
| `testing-patterns`      | Jest, Vitest                                                    | Writing tests          |
| `code-review-checklist` | Code quality                                                    | PR reviews             |
| `typescript-expert`     | Advanced TypeScript                                             | Type-level programming |

### NOT Applicable (Skip These)

| Skill              | Why                               |
| ------------------ | --------------------------------- |
| `nestjs-expert`    | Backend uses Laravel, not NestJS  |
| `prisma-expert`    | Backend uses Eloquent, not Prisma |
| `python-patterns`  | No Python in project              |
| `mobile-design`    | Web SPA only, not mobile native   |
| `game-development` | Not a game                        |
| `seo-fundamentals` | Internal SPA, no SEO needed       |

---

## 🎨 Task-Based Skill Chains

### Building a New Page (e.g., TournamentsPage)

1. **Planning** → `vue3-typescript` [component-patterns.md]
2. **Layout** → `quasar-sakai-design` [layout-structure.md]
3. **Styling** → `quasar-sakai-design` [scss-patterns.md]
4. **State** → `pinia-state-management` [store-patterns.md]
5. **API** → `api-integration` [service-layer.md]
6. **Validation** → `vue3-typescript` [composition-api.md]

**Commands:**

```bash
# Generate the page component
# Add to router
# Create store in pinia-state-management
# Create service in api-integration
# Add styling from quasar-sakai-design
```

---

### Creating a Reusable Component (e.g., TournamentForm)

1. **Design** → `quasar-sakai-design` [quasar-components-mapping.md]
2. **Structure** → `vue3-typescript` [component-patterns.md]
3. **Props/Emits** → `vue3-typescript` [typescript-patterns.md]
4. **Styling** → `quasar-sakai-design` [scss-patterns.md]
5. **Validation** → `vue3-typescript` [composables-patterns.md]

---

### Implementing API Integration

1. **Setup** → `api-integration` [client-setup.md]
2. **Service** → `api-integration` [service-layer.md]
3. **Error Handling** → `api-integration` [error-handling.md]
4. **Store Actions** → `pinia-state-management` [actions-api.md]
5. **Component Usage** → `vue3-typescript` [composition-api.md]

---

### Styling the Dashboard

1. **Layout** → `quasar-sakai-design` [layout-structure.md]
2. **Colors** → `quasar-sakai-design` [color-theme.md]
3. **Components** → `quasar-sakai-design` [quasar-components-mapping.md]
4. **SCSS** → `quasar-sakai-design` [scss-patterns.md]
5. **UX** → `frontend-design` [ux-psychology.md]

---

## 🔍 Skill Deep Dives

### quasar-sakai-design

**What it covers:**

- Sakai admin template patterns
- Quasar component mapping
- Color and theme system
- SCSS patterns and mixins
- Responsive design
- Layout structure (sidebar + topbar + main)

**Files:**

- `SKILL.md` - Overview
- `layout-structure.md` - Page layout
- `quasar-components-mapping.md` - Quasar → Sakai mapping
- `color-theme.md` - Colors and theming
- `scss-patterns.md` - SCSS utilities and mixins

**Use when:** Building ANY visual component

---

### vue3-typescript

**What it covers:**

- Vue 3 Composition API
- `<script setup>` syntax
- TypeScript type definitions
- Component lifecycle
- Props and emits
- Custom hooks (composables)
- Error handling

**Files:**

- `SKILL.md` - Overview
- `component-patterns.md` - Component structure
- `typescript-patterns.md` - Type definitions
- `composition-api.md` - API usage
- `composables-patterns.md` - Reusable hooks

**Use when:** Creating components or pages

---

### pinia-state-management

**What it covers:**

- Pinia store structure
- State, getters, actions
- API integration in stores
- Error handling
- Loading states
- Store composition

**Files:**

- `SKILL.md` - Overview
- `store-patterns.md` - Store structure
- `actions-api.md` - API in actions
- `getters-computed.md` - Derived state
- `types-patterns.md` - TypeScript types
- `best-practices.md` - Recommendations

**Use when:** Managing state or async operations

---

### api-integration

**What it covers:**

- Axios client setup
- Service layer pattern
- Error handling
- Request/response interceptors
- Authentication (Sanctum)
- Response typing

**Files:**

- `SKILL.md` - Overview
- `client-setup.md` - Axios configuration
- `service-layer.md` - Service pattern
- `error-handling.md` - Error strategies
- `interceptors.md` - Request/response handling
- `authentication.md` - Sanctum auth

**Use when:** Calling backend API

---

### frontend-design

**What it covers:**

- UX principles
- Color systems
- Typography
- Visual effects
- Accessibility
- Animation guidelines

**Use when:** Making design/UX decisions

---

## 💡 Workflow Examples

### Example 1: Add Tournament Creation Feature

**Steps:**

1. **Plan the page layout**
   - Use `quasar-sakai-design` [layout-structure.md]
   - Create sidebar nav entry, main content area

2. **Create TournamentForm component**
   - Use `vue3-typescript` [component-patterns.md]
   - Use `quasar-sakai-design` [quasar-components-mapping.md] → Form inputs

3. **Add form validation**
   - Use `vue3-typescript` [composables-patterns.md]
   - Create `useFormValidation` composable

4. **Style the form**
   - Use `quasar-sakai-design` [scss-patterns.md]
   - Apply input styling, spacing, colors

5. **Create tournament store**
   - Use `pinia-state-management` [store-patterns.md]
   - Add `createTournament` action

6. **Create tournament service**
   - Use `api-integration` [service-layer.md]
   - Add `createTournament()` function

7. **Connect components → store → API**
   - Use `vue3-typescript` [composition-api.md]
   - Use `pinia-state-management` [actions-api.md]

---

### Example 2: Display Tournaments List

**Steps:**

1. **Create TournamentsPage component**
   - Use `vue3-typescript` [component-patterns.md]

2. **Fetch tournaments on page load**
   - Use `pinia-state-management` [store-patterns.md]
   - Use `api-integration` [service-layer.md]

3. **Display in table**
   - Use `quasar-sakai-design` [quasar-components-mapping.md] → `<q-table>`
   - Use `quasar-sakai-design` [scss-patterns.md] → `.sakai-table`

4. **Add filters/sorting**
   - Use `pinia-state-management` [getters-computed.md]
   - Use `vue3-typescript` [composition-api.md]

5. **Handle loading/error states**
   - Use `quasar-sakai-design` [quasar-components-mapping.md] → `<q-spinner>`
   - Use `quasar-sakai-design` [quasar-components-mapping.md] → `<q-banner>`

---

## 🚀 Quick Commands

### Create a new page

```bash
# 1. Create file: src/pages/NewPage.vue
# 2. Use: vue3-typescript [component-patterns.md]
# 3. Use: quasar-sakai-design [layout-structure.md]
# 4. Add to router: src/router/routes.ts
```

### Create a new component

```bash
# 1. Create file: src/components/NewComponent.vue
# 2. Use: vue3-typescript [component-patterns.md]
# 3. Use: quasar-sakai-design [quasar-components-mapping.md]
```

### Create a new store

```bash
# 1. Create file: src/stores/newDomain.ts
# 2. Use: pinia-state-management [store-patterns.md]
# 3. Use: api-integration [service-layer.md] for API calls
```

### Create API service

```bash
# 1. Create file: src/services/newDomain.ts
# 2. Use: api-integration [service-layer.md]
# 3. Import in store actions
```

---

## ✅ Skills Checklist for Common Tasks

### Building a Page ✓

- [ ] Read `vue3-typescript` [component-patterns.md]
- [ ] Read `quasar-sakai-design` [layout-structure.md]
- [ ] Read `pinia-state-management` [store-patterns.md]
- [ ] Read `api-integration` [service-layer.md]
- [ ] Component uses `<script setup>` + TypeScript
- [ ] Page styled with Sakai design system
- [ ] State managed in Pinia store
- [ ] API calls through service layer
- [ ] Loading/error states handled
- [ ] Responsive on mobile/tablet

### Building a Component ✓

- [ ] Read `vue3-typescript` [component-patterns.md]
- [ ] Read `quasar-sakai-design` [quasar-components-mapping.md]
- [ ] Props defined with TypeScript types
- [ ] Emits defined for parent communication
- [ ] Uses `<script setup>` syntax
- [ ] Styled with SCSS + Sakai variables
- [ ] Quasar components used (not raw HTML)
- [ ] Single responsibility principle
- [ ] Reusable across pages

### Styling ✓

- [ ] Read `quasar-sakai-design` [scss-patterns.md]
- [ ] Using SCSS variables from bt-variables.scss
- [ ] Using mixins: `@include sakai-shadow()`, etc.
- [ ] Spacing uses `$spacing-*` variables
- [ ] Colors use `$color-*` variables
- [ ] Responsive with media queries
- [ ] No inline styles (all in SCSS)
- [ ] Dark mode supported (if applicable)

---

## 🎓 Learning Path

### Week 1: Foundations

1. Read `quasar-sakai-design` [layout-structure.md]
2. Read `vue3-typescript` [component-patterns.md]
3. Read `pinia-state-management` [store-patterns.md]
4. Create simple page with static data

### Week 2: API Integration

1. Read `api-integration` [client-setup.md]
2. Read `api-integration` [service-layer.md]
3. Create API service
4. Connect store to API

### Week 3: Advanced

1. Read `vue3-typescript` [composition-api.md]
2. Read `pinia-state-management` [getters-computed.md]
3. Create reusable composables
4. Optimize performance

---

## 📞 Need Help?

| Question                       | Answer                                                         |
| ------------------------------ | -------------------------------------------------------------- |
| "How do I style a button?"     | `quasar-sakai-design` [quasar-components-mapping.md] → Buttons |
| "How do I create a component?" | `vue3-typescript` [component-patterns.md]                      |
| "How do I fetch data?"         | `api-integration` [service-layer.md]                           |
| "How do I manage state?"       | `pinia-state-management` [store-patterns.md]                   |
| "How do I validate forms?"     | `vue3-typescript` [composables-patterns.md]                    |
| "How do I make it responsive?" | `quasar-sakai-design` [responsive-design.md]                   |

---

## 🔗 External Resources

| Resource       | Link                        |
| -------------- | --------------------------- |
| Quasar Docs    | https://quasar.dev          |
| Vue 3 Guide    | https://vuejs.org           |
| Pinia Store    | https://pinia.vuejs.org     |
| Sakai Template | https://sakai.primevue.org/ |
| Axios Docs     | https://axios-http.com      |

---

**Last Updated**: 2026-04-21
**Project**: Beach Tennis SPA
**Stack**: Quasar 2 + Vue 3 + Pinia + TypeScript
