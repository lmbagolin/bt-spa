<template>
  <q-checkbox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="checkboxAttrs"
    class="bt-checkbox"
    :class="checkboxClasses"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </q-checkbox>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [Boolean, Array, String, null],
  label: String,
  value: [String, Number, Boolean],
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  color: {
    type: String,
    default: 'primary',
  },
})

defineEmits(['update:modelValue'])

const checkboxAttrs = computed(() => ({
  label: props.label,
  val: props.value,
  disabled: props.disabled,
  readonly: props.readonly,
  indeterminate: props.indeterminate,
  color: props.color,
  dense: props.size === 'sm',
}))

const checkboxClasses = computed(() => ({
  'bt-checkbox--small': props.size === 'sm',
  'bt-checkbox--large': props.size === 'lg',
}))
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-checkbox {
  :deep(.q-checkbox__native) {
    border-radius: $border-radius-sm;
    border: 2px solid $color-primary;
    transition: all $transition-fast;

    &:checked {
      background-color: $color-primary;
      border-color: $color-primary;
    }

    &:indeterminate {
      background-color: $color-primary;
      border-color: $color-primary;
    }
  }

  :deep(.q-checkbox__label) {
    font-size: $font-size-base;
    color: $color-text-primary;
    margin-left: $spacing-sm;
  }

  &:deep(.q-checkbox:hover .q-checkbox__native) {
    border-color: $color-primary-dark;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Size variants
  &.bt-checkbox--small {
    :deep(.q-checkbox__label) {
      font-size: $font-size-sm;
    }
  }

  &.bt-checkbox--large {
    :deep(.q-checkbox__label) {
      font-size: $font-size-lg;
    }
  }
}
</style>
