<template>
  <q-chip dense :color="config.color" text-color="white" class="text-sm text-bold q-px-xs">
    <q-icon v-if="showIcon" :name="config.icon" size="18px" class="q-mr-sm" />
    <span v-if="showLabel">
      {{ config.label }}
    </span>
  </q-chip>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  gender: { type: String, default: null },
  showIcon: { type: Boolean, default: true },
  showLabel: { type: Boolean, default: true },
});

const { t } = useI18n();

const MAP = {
  male: () => ({
    label: t('common.gender_male'),
    color: 'blue',
    icon: 'male',
  }),
  female: () => ({
    label: t('common.gender_female'),
    color: 'pink',
    icon: 'female',
  }),
  mixed: () => ({
    label: t('common.gender_mixed'),
    color: 'purple',
    icon: 'fa-solid fa-mars-and-venus',
  }),
};

const config = computed(() => MAP[props.gender]?.() ?? { label: '—', color: 'grey' });
</script>
