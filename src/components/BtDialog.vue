<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="dialogAttrs"
  >
    <q-card class="bt-dialog-card">
      <!-- Header -->
      <q-card-section class="bt-dialog-header row items-center justify-between">
        <h3 v-if="title" class="text-h6 text-bold q-ma-none">{{ title }}</h3>
        <q-btn
          v-if="closable"
          icon="close"
          flat
          round
          dense
          color="text-secondary"
          @click="onClose"
        />
      </q-card-section>

      <!-- Body -->
      <q-separator />
      <q-card-section class="bt-dialog-body">
        <slot />
      </q-card-section>

      <!-- Footer with Actions -->
      <q-separator v-if="$slots.actions" />
      <q-card-section
        v-if="$slots.actions"
        class="bt-dialog-footer row items-center justify-end gap-md"
      >
        <slot name="actions" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: String,
  closable: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  maximized: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'standard',
  },
  transitionShow: {
    type: String,
    default: 'slide-up',
  },
  transitionHide: {
    type: String,
    default: 'slide-down',
  },
})

const emit = defineEmits(['update:modelValue'])

const dialogAttrs = computed(() => ({
  persistent: props.persistent,
  maximized: props.maximized,
  'full-width': props.fullWidth,
  'full-height': props.fullHeight,
  position: props.position,
  'transition-show': props.transitionShow,
  'transition-hide': props.transitionHide,
}))

function onClose() {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-dialog-card {
  min-width: 400px;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-xl;

  @media (max-width: $breakpoint-sm) {
    min-width: 90vw;
  }

  .bt-dialog-header {
    background-color: $color-bg-light;
    border-bottom: $border-width solid $color-card-border;
    padding: $spacing-lg;
    gap: $spacing-md;

    h3 {
      color: $color-text-primary;
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      margin: 0;
    }
  }

  .bt-dialog-body {
    padding: $spacing-lg;
    color: $color-text-primary;
    max-height: 60vh;
    overflow-y: auto;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $color-bg-light;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-card-border;
      border-radius: 4px;

      &:hover {
        background: $color-text-secondary;
      }
    }
  }

  .bt-dialog-footer {
    background-color: $color-bg-light;
    border-top: $border-width solid $color-card-border;
    padding: $spacing-lg;
    gap: $spacing-md;
  }
}

:deep(.q-dialog__backdrop) {
  background-color: $color-bg-overlay;
}
</style>
