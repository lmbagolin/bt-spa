<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="selectAttrs"
    outlined
    dense
    emit-value
    map-options
    class="bt-select"
    :class="selectClasses"
    option-value="value"
    option-label="label"
  >
    <!-- Custom option slot -->
    <template v-if="$slots['option']" #no-option>
      <q-item>
        <q-item-section>
          <div class="text-secondary">Nenhuma opção encontrada</div>
        </q-item-section>
      </q-item>
    </template>

    <!-- Selected slot -->
    <template v-if="$slots.selected" #selected>
      <slot name="selected" />
    </template>

    <!-- Prepend slot -->
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </q-select>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: null,
  options: {
    type: Array,
    required: true,
  },
  label: String,
  placeholder: String,
  hint: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: String,
  icon: String,
  size: {
    type: String,
    default: 'md',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['update:modelValue']);

const selectAttrs = computed(() => ({
  options: props.options,
  label: props.label,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  'error-message': props.errorMessage,
  error: props.error,
  icon: props.icon,
  clearable: props.clearable,
  'use-input': props.filterable,
  'hide-selected': false,
  multiple: props.multiple,
  'virtual-scroll-item-size': 48,
}));

const selectClasses = computed(() => ({
  'bt-select--small': props.size === 'sm',
  'bt-select--large': props.size === 'lg',
  'bt-select--error': props.error,
}));
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-select {
  :deep(.q-field__label) {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  :deep(.q-field__control) {
    font-size: $font-size-base;
    color: $color-text-primary;
    padding: 10px 14px;
  }

  :deep(.q-field--outlined .q-field__control) {
    border-radius: $border-radius-sm;
    border: $border-width solid $color-card-border;
    transition:
      border-color $transition-fast,
      box-shadow $transition-fast;

    &:hover {
      border-color: $color-text-light;
    }

    &:focus-within {
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }
  }

  :deep(.q-field--error .q-field__control) {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
  }

  :deep(.q-field__hint) {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    margin-top: 4px;
  }

  // Dropdown menu styles
  :deep(.q-menu__paper) {
    border-radius: $border-radius-md;
    box-shadow: $shadow-lg;
    border: none;
  }

  :deep(.q-item) {
    padding: 10px 16px;
    border-radius: 0;
    color: $color-text-primary;

    &:hover {
      background-color: $color-bg-light;
    }

    &.q-item--active {
      background-color: rgba(25, 118, 210, 0.1);
      color: $color-primary;
    }
  }
}

.bt-select--small {
  :deep(.q-field__control) {
    font-size: $font-size-sm;
    padding: 6px 10px;
  }
}

.bt-select--large {
  :deep(.q-field__control) {
    font-size: $font-size-lg;
    padding: 12px 16px;
  }
}
</style>
