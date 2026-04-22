<template>
  <q-btn v-bind="buttonAttrs" :class="buttonClasses" class="bt-btn">
    <template v-if="$slots.default" #default>
      <slot />
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  icon: String,
  iconRight: String,
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  unelevated: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  noCaps: {
    type: Boolean,
    default: true,
  },
  to: String,
  href: String,
  target: String,
  type: {
    type: String,
    default: 'button',
  },
});

const buttonAttrs = computed(() => ({
  label: props.label,
  icon: props.icon,
  'icon-right': props.iconRight,
  disabled: props.disabled || props.loading,
  loading: props.loading,
  to: props.to,
  href: props.href,
  target: props.target,
  type: props.type,
  color: getColor(),
  flat: props.flat || props.variant === 'flat',
  outline: props.outline || props.variant === 'outline',
  unelevated: props.unelevated || props.variant === 'flat',
  dense: props.dense,
  'no-caps': props.noCaps,
  class: 'text-weight-medium',
}));

const buttonClasses = computed(() => ({
  'bt-btn--primary': props.variant === 'primary',
  'bt-btn--secondary': props.variant === 'secondary',
  'bt-btn--danger': props.variant === 'danger',
  'bt-btn--success': props.variant === 'success',
  'bt-btn--warning': props.variant === 'warning',
  'bt-btn--info': props.variant === 'info',
  'bt-btn--outline': props.variant === 'outline',
  'bt-btn--flat': props.variant === 'flat',
  'bt-btn--small': props.size === 'sm',
  'bt-btn--large': props.size === 'lg',
  'bt-btn--full-width': props.fullWidth,
  'bt-btn--rounded': props.rounded,
  'bt-btn--loading': props.loading,
}));

function getColor() {
  const variantColors = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'negative',
    success: 'positive',
    warning: 'warning',
    info: 'info',
    outline: 'primary',
    flat: 'primary',
  };
  return variantColors[props.variant] || 'primary';
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-btn {
  border-radius: $border-radius-sm;
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
  padding: 8px 16px;
  text-transform: none;
  transition: all $transition-fast;
  letter-spacing: 0.3px;

  // Primary variant
  &.bt-btn--primary {
    background-color: $color-primary;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: darken($color-primary, 5%);
      box-shadow: $shadow-md;
    }

    &:active:not(.bt-btn--loading) {
      box-shadow: $shadow-sm;
    }
  }

  // Secondary variant
  &.bt-btn--secondary {
    background-color: $color-sidebar-bg;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: lighten($color-sidebar-bg, 5%);
    }
  }

  // Danger variant
  &.bt-btn--danger {
    background-color: $color-danger;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: darken($color-danger, 5%);
    }
  }

  // Success variant
  &.bt-btn--success {
    background-color: $color-success;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: darken($color-success, 5%);
    }
  }

  // Warning variant
  &.bt-btn--warning {
    background-color: $color-warning;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: darken($color-warning, 5%);
    }
  }

  // Info variant
  &.bt-btn--info {
    background-color: $color-info;
    color: white;

    &:hover:not(.bt-btn--loading) {
      background-color: darken($color-info, 5%);
    }
  }

  // Outline variant
  &.bt-btn--outline {
    border: 2px solid $color-primary;
    color: $color-primary;
    background-color: transparent;

    &:hover:not(.bt-btn--loading) {
      background-color: rgba(25, 118, 210, 0.05);
    }
  }

  // Flat variant
  &.bt-btn--flat {
    background-color: transparent;
    color: $color-primary;

    &:hover:not(.bt-btn--loading) {
      background-color: $color-bg-light;
    }
  }

  // Size variants
  &.bt-btn--small {
    padding: 6px 12px;
    font-size: $font-size-xs;
  }

  &.bt-btn--large {
    padding: 12px 24px;
    font-size: $font-size-base;
  }

  // Full width
  &.bt-btn--full-width {
    width: 100%;
  }

  // Rounded
  &.bt-btn--rounded {
    border-radius: 24px;
  }

  // Loading state
  &.bt-btn--loading {
    opacity: 0.7;
  }

  // Disabled state
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
