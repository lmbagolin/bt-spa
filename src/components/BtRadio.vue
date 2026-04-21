<template>
  <q-radio
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="radioAttrs"
    class="bt-radio"
    :class="radioClasses"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </q-radio>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: null,
  value: null,
  label: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
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

const radioAttrs = computed(() => ({
  val: props.value,
  label: props.label,
  disabled: props.disabled,
  readonly: props.readonly,
  color: props.color,
  dense: props.size === 'sm',
}))

const radioClasses = computed(() => ({
  'bt-radio--small': props.size === 'sm',
  'bt-radio--large': props.size === 'lg',
}))
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-radio {
  :deep(.q-radio__native) {
    border: 2px solid $color-primary;
    border-radius: 50%;
    transition: all $transition-fast;

    &:checked {
      background-color: $color-primary;
      border-color: $color-primary;
    }

    &::after {
      background-color: white;
    }
  }

  :deep(.q-radio__label) {
    font-size: $font-size-base;
    color: $color-text-primary;
    margin-left: $spacing-sm;
  }

  &:deep(.q-radio:hover .q-radio__native) {
    border-color: $color-primary-dark;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Size variants
  &.bt-radio--small {
    :deep(.q-radio__label) {
      font-size: $font-size-sm;
    }
  }

  &.bt-radio--large {
    :deep(.q-radio__label) {
      font-size: $font-size-lg;
    }
  }
}
</style>
