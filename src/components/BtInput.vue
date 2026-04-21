<template>
  <q-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="inputAttrs"
    outlined
    dense
    class="bt-input"
    :class="inputClasses"
  >
    <!-- Slot for prefix -->
    <template v-if="$slots.prefix" #prepend>
      <slot name="prefix" />
    </template>

    <!-- Slot for suffix -->
    <template v-if="$slots.suffix" #append>
      <slot name="suffix" />
    </template>

    <!-- Hint text -->
    <template v-if="hint" #hint>
      {{ hint }}
    </template>
  </q-input>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  hint: String,
  type: {
    type: String,
    default: 'text',
  },
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
  required: Boolean,
  clearable: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])

const inputAttrs = computed(() => ({
  type: props.type,
  label: props.label,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  'error-message': props.errorMessage,
  error: props.error,
  icon: props.icon,
  clearable: props.clearable,
  autofocus: props.autofocus,
}))

const inputClasses = computed(() => ({
  'bt-input--small': props.size === 'sm',
  'bt-input--large': props.size === 'lg',
  'bt-input--error': props.error,
}))
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-input {
  :deep(.q-field__label) {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  :deep(.q-field__control) {
    font-size: $font-size-base;
    color: $color-text-primary;
    padding: 0;

    input {
      padding: 10px 14px;

      &::placeholder {
        color: $color-text-secondary;
      }
    }
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
}

.bt-input--small {
  :deep(.q-field__control input) {
    font-size: $font-size-sm;
    padding: 6px 10px;
  }
}

.bt-input--large {
  :deep(.q-field__control input) {
    font-size: $font-size-lg;
    padding: 12px 16px;
  }
}
</style>
