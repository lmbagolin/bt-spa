<template>
  <div class="page-header q-mb-lg">
    <!-- Breadcrumbs -->
    <div v-if="breadcrumbs?.length" class="breadcrumb-row q-mb-sm">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <span
          class="breadcrumb-item"
          :class="i === breadcrumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-link'"
          @click="crumb.action && crumb.action()"
        >
          {{ crumb.label }}
        </span>
        <q-icon
          v-if="i < breadcrumbs.length - 1"
          name="chevron_right"
          size="13px"
          class="breadcrumb-sep"
        />
      </template>
    </div>

    <!-- Main row: back + title + actions -->
    <div class="header-main-row">
      <div class="header-left">
        <q-btn
          v-if="back"
          flat
          round
          dense
          icon="arrow_back"
          class="header-back-btn"
          @click="back"
        />
        <div class="header-text">
          <h1 class="header-title">{{ title }}</h1>
          <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div v-if="$slots.default" class="header-actions">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:       { type: String, required: true },
  subtitle:    { type: String, default: null },
  breadcrumbs: { type: Array,  default: null },
  back:        { type: Function, default: null },
});
</script>

<style scoped>
.page-header {
  width: 100%;
}

/* ── Breadcrumbs ── */
.breadcrumb-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.breadcrumb-item {
  font-size: 0.75rem;
  font-weight: 500;
}

.breadcrumb-link {
  color: var(--surface-400);
  cursor: pointer;
  transition: color 0.15s;
}
.breadcrumb-link:hover {
  color: var(--q-primary);
}

.breadcrumb-current {
  color: var(--q-primary);
  font-weight: 700;
  cursor: default;
}

.breadcrumb-sep {
  color: var(--surface-300);
  margin: 0 1px;
}

/* ── Main row ── */
.header-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.header-back-btn {
  flex-shrink: 0;
  margin-top: 2px;
}

.header-text {
  min-width: 0;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--surface-900);
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-subtitle {
  font-size: 0.875rem;
  color: var(--surface-500);
  margin: 4px 0 0;
}

/* ── Actions ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
