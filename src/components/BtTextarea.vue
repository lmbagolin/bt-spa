<template>
  <q-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="textareaAttrs"
    type="textarea"
    outlined
    class="bt-textarea"
    :class="textareaClasses"
  >
    <!-- Hint text -->
    <template v-if="hint" #hint>
      {{ hint }}
    </template>

    <!-- Counter -->
    <template v-if="showCounter && maxLength" #after>
      <span class="text-xs text-secondary">
        {{ (modelValue?.toString() || '').length }} / {{ maxLength }}
      </span>
    </template>
  </q-input>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, null],
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
  rows: {
    type: Number,
    default: 4,
  },
  maxLength: Number,
  showCounter: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['update:modelValue'])

const textareaAttrs = computed(() => ({
  label: props.label,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  'error-message': props.errorMessage,
  error: props.error,
  rows: props.rows,
  maxlength: props.maxLength,
  counter: props.showCounter && props.maxLength,
}))

const textareaClasses = computed(() => ({
  'bt-textarea--error': props.error,
}))
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-textarea {
  :deep(.q-field__label) {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  :deep(.q-field__control) {
    font-size: $font-size-base;
    color: $color-text-primary;
    padding: 12px 14px;
    min-height: auto;

    textarea {
      font-family: inherit;
      resize: vertical;
      min-height: 100px;

      &::placeholder {
        color: $color-text-secondary;
      }
    }
  }

  :deep(.q-field--outlined .q-field__control) {
    border-radius: $border-radius-md;
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

  :deep(.q-field__after) {
    padding-top: 8px;
  }
}
</style>
