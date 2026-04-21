<template>
  <q-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="dateAttrs"
    outlined
    dense
    class="bt-date-picker"
    :class="dateClasses"
  >
    <template #append>
      <q-icon
        name="close"
        @click.stop="clearDate"
        class="cursor-pointer"
        v-if="modelValue && clearable"
      />
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            mask="DD/MM/YYYY"
            v-bind="datePickerAttrs"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, null],
  label: String,
  placeholder: {
    type: String,
    default: 'DD/MM/YYYY',
  },
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
  clearable: {
    type: Boolean,
    default: true,
  },
  minDate: String,
  maxDate: String,
  mask: {
    type: String,
    default: '##/##/####',
  },
})

const emit = defineEmits(['update:modelValue'])

const dateAttrs = computed(() => ({
  type: 'text',
  label: props.label,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  'error-message': props.errorMessage,
  error: props.error,
  mask: props.mask,
}))

const datePickerAttrs = computed(() => ({
  'min-date': props.minDate,
  'max-date': props.maxDate,
  minimal: false,
}))

const dateClasses = computed(() => ({
  'bt-date-picker--error': props.error,
}))

function clearDate() {
  if (props.clearable) {
    emit('update:modelValue', null)
  }
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-date-picker {
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

  // Date picker popup styles
  :deep(.q-date__card) {
    border-radius: $border-radius-md;
    box-shadow: $shadow-lg;
    border: none;
    background-color: $color-card-bg;
  }

  :deep(.q-date__navigation button) {
    color: $color-primary;

    &:hover {
      background-color: $color-bg-light;
    }
  }

  :deep(.q-date__today) {
    color: $color-primary;
  }

  :deep(.q-date__day.q-selected) {
    background-color: $color-primary;
    color: white;
  }

  :deep(.q-date__day.q-hoverable:hover) {
    background-color: $color-bg-light;
  }
}
</style>
