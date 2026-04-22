<template>
  <q-banner v-if="modelValue" :class="bannerClasses" class="bt-banner">
    <template #avatar>
      <q-icon :name="icon" :color="iconColor" size="24px" />
    </template>

    <template #default>
      <div class="column gap-xs">
        <div v-if="title" class="text-bold">{{ title }}</div>
        <div v-if="message">{{ message }}</div>
      </div>
    </template>

    <template v-if="closable" #action>
      <q-btn flat dense round icon="close" :color="iconColor" size="sm" @click="onClose" />
    </template>
  </q-banner>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  variant: {
    type: String,
    default: 'info',
  },
  title: String,
  message: String,
  closable: {
    type: Boolean,
    default: true,
  },
  icon: String,
});

const emit = defineEmits(['update:modelValue']);

const variantConfig = {
  success: {
    bg: 'rgba(39, 174, 96, 0.1)',
    border: '#27ae60',
    icon: 'check_circle',
    color: '#27ae60',
  },
  warning: {
    bg: 'rgba(243, 156, 18, 0.1)',
    border: '#f39c12',
    icon: 'warning',
    color: '#f39c12',
  },
  danger: {
    bg: 'rgba(231, 76, 60, 0.1)',
    border: '#e74c3c',
    icon: 'error',
    color: '#e74c3c',
  },
  info: {
    bg: 'rgba(52, 152, 219, 0.1)',
    border: '#3498db',
    icon: 'info',
    color: '#3498db',
  },
};

const config = computed(() => variantConfig[props.variant] || variantConfig.info);

const icon = computed(() => props.icon || config.value.icon);

const iconColor = computed(() => config.value.color);

const bannerClasses = computed(() => ({
  backgroundColor: config.value.bg,
  borderLeft: `4px solid ${config.value.border}`,
  color: config.value.color,
}));

function onClose() {
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.bt-banner {
  border-radius: $border-radius-md;
  padding: $spacing-md $spacing-lg;
  margin-bottom: $spacing-lg;
  font-size: $font-size-base;

  :deep(.q-banner__content) {
    align-items: flex-start;
  }

  :deep(.q-banner__avatar) {
    padding: 0 $spacing-md 0 0;
  }

  :deep(.q-banner__actions) {
    padding: 0;
    margin-left: auto;
  }
}

.gap-xs {
  gap: 4px;
}
</style>
