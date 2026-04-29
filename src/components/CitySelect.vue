<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :options="cityOptions"
    option-label="label"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :loading="loading"
    :label="resolvedLabel"
    :placeholder="resolvedPlaceholder"
    :error="error"
    :error-message="errorMessage"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :readonly="readonly"
    outlined
    class="bt-select city-select"
    @filter="filterCities"
  >
    <template #prepend>
      <q-icon name="location_on" color="surface-300" />
    </template>

    <template #no-option>
      <q-item>
        <q-item-section class="text-surface-400 text-sm q-pa-sm">
          {{ noOptionText }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from 'vue';
import { api } from 'boot/axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: { default: null },
  label: { type: String, default: null },
  placeholder: { type: String, default: null },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
  dense: { type: Boolean, default: true },
  disable: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);

const cityOptions = ref([]);
const loading = ref(false);
const hasSearched = ref(false);

const resolvedLabel = computed(() => props.label ?? t('common.city'));
const resolvedPlaceholder = computed(
  () => props.placeholder ?? t('common.city_select_placeholder'),
);
const noOptionText = computed(() =>
  hasSearched.value ? t('common.city_select_no_results') : t('common.city_select_hint'),
);

async function filterCities(val, update, abort) {
  if (!val || val.length < 2) {
    hasSearched.value = false;
    abort();
    return;
  }

  loading.value = true;
  try {
    const { data } = await api.get('/cities', { params: { search: val } });
    update(() => {
      hasSearched.value = true;
      cityOptions.value = data.map((c) => ({
        label: `${c.name} - ${c.state_code}`,
        id: c.id,
        name: c.name,
        state_code: c.state_code,
      }));
    });
  } catch {
    abort();
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.city-select {
  :deep(.q-field__label) {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  :deep(.q-field__control) {
    font-size: $font-size-base;
    color: $color-text-primary;
    padding: 0px 14px !important;
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
}
</style>
