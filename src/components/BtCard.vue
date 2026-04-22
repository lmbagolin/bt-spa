<template>
  <q-card class="bt-card" :class="cardClasses">
    <!-- Header Section -->
    <div v-if="title || $slots.header" class="bt-card-header">
      <slot name="header">
        <div class="row items-center justify-between full-width">
          <div class="column">
            <h3 v-if="title" class="bt-card-title">{{ title }}</h3>
            <p v-if="subtitle" class="bt-card-subtitle">{{ subtitle }}</p>
          </div>
          <div v-if="$slots['header-action']" class="header-actions">
            <slot name="header-action" />
          </div>
        </div>
      </slot>
    </div>

    <!-- Body Section -->
    <q-card-section class="bt-card-body">
      <slot />
    </q-card-section>

    <!-- Footer Section -->
    <div v-if="$slots.footer" class="bt-card-footer">
      <slot name="footer" />
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  subtitle: String,
  padding: {
    type: String,
    default: 'md',
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default',
  },
});

const cardClasses = computed(() => ({
  'bt-card--hoverable': props.hoverable,
  'bt-card--border': props.border,
  'bt-card--flat': props.variant === 'flat',
  'bt-card--elevated': props.variant === 'elevated',
  'bt-card--sm': props.padding === 'sm',
  'bt-card--lg': props.padding === 'lg',
}));
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-card {
  background-color: $color-card-bg;
  border-radius: $border-radius-lg;
  border: none;
  @include sakai-shadow('md');
  margin-bottom: $spacing-lg;
  overflow: hidden;
  transition: all $transition-normal;

  .bt-card-header {
    background-color: $color-bg-light;
    border-bottom: $border-width solid $color-card-border;
    padding: $spacing-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;

    .bt-card-title {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin: 0;
      padding: 0;
    }

    .bt-card-subtitle {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin: 4px 0 0 0;
      padding: 0;
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .bt-card-body {
    padding: $spacing-md;

    :deep(> *:last-child) {
      margin-bottom: 0;
    }
  }

  .bt-card-footer {
    border-top: $border-width solid $color-card-border;
    padding: $spacing-md;
    background-color: $color-bg-light;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
  }

  // Hoverable variant
  &.bt-card--hoverable {
    @include hover-lift();
  }

  // Border variant
  &.bt-card--border {
    border: $border-width solid $color-card-border;
  }

  // Flat variant
  &.bt-card--flat {
    box-shadow: none;
    background-color: $color-bg-light;
  }

  // Elevated variant
  &.bt-card--elevated {
    @include sakai-shadow('lg');
  }

  // Size variants
  &.bt-card--sm {
    .bt-card-header,
    .bt-card-body,
    .bt-card-footer {
      padding: $spacing-sm;
    }
  }

  &.bt-card--lg {
    .bt-card-header,
    .bt-card-body,
    .bt-card-footer {
      padding: $spacing-lg;
    }
  }
}
</style>
