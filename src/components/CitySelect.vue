<template>
  <bt-select
    v-model="vModel"
    :options="cityOptions"
    option-label="label"
    map-options
    use-input
    hide-selected
    fill-input
    input-debounce="10"
    :loading="loading"
    :label="resolvedLabel"
    :placeholder="resolvedPlaceholder"
    :error="error"
    :error-message="errorMessage"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :readonly="readonly"
    emit-value
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
  </bt-select>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const emits = defineEmits(['update:modelValue']);

const cityOptions = ref([]);
const loading = ref(false);
const hasSearched = ref(false);

onMounted(() => {
  preloadCities();
});

async function preloadCities() {
  if (sessionStorage.getItem('all_cities')) return;

  try {
    const { data } = await api.get('/cities');
    const results = data.map((c) => ({
      label: `${c.name} - ${c.state_code}`,
      id: c.id,
      value: c.id,
      name: c.name,
      state_code: c.state_code,
    }));
    sessionStorage.setItem('all_cities', JSON.stringify(results));
    updateSelectedOption();
  } catch (error) {
    console.error('Error preloading cities:', error);
  }
}

function updateSelectedOption() {
  if (!props.modelValue) return;

  const allCitiesStr = sessionStorage.getItem('all_cities');
  if (allCitiesStr) {
    const allCities = JSON.parse(allCitiesStr);
    const selected = allCities.find((c) => c.id === props.modelValue);
    if (selected) {
      // Ensure the selected option is in cityOptions so map-options can find it
      if (!cityOptions.value.find((o) => o.id === selected.id)) {
        cityOptions.value = [selected, ...cityOptions.value];
      }
    }
  }
}

watch(
  () => props.modelValue,
  () => {
    updateSelectedOption();
  },
  { immediate: true },
);

const vModel = computed({
  get() {
    console.log('GET', cityOptions.value);
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

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

  // Tenta busca local primeiro
  const allCitiesStr = sessionStorage.getItem('all_cities');
  if (allCitiesStr) {
    const allCities = JSON.parse(allCitiesStr);
    const needle = val.toLowerCase();
    const filtered = allCities.filter((c) => c.label.toLowerCase().includes(needle)).slice(0, 50);

    // Sempre incluir o selecionado se ele não estiver no filtro
    if (props.modelValue) {
      const selected = allCities.find((c) => c.id === props.modelValue);
      if (selected && !filtered.find((f) => f.id === selected.id)) {
        filtered.push(selected);
      }
    }

    update(() => {
      hasSearched.value = true;
      cityOptions.value = filtered;
    });
    return;
  }

  // Fallback para API (ou cache de busca específica)
  loading.value = true;
  try {
    const cacheKey = `cities_search_${val.toLowerCase()}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      update(() => {
        hasSearched.value = true;
        cityOptions.value = JSON.parse(cached);
      });
      return;
    }

    const { data } = await api.get('/cities', { params: { search: val } });
    const results = data.map((c) => ({
      label: `${c.name} - ${c.state_code}`,
      id: c.id,
      value: c.id,
      name: c.name,
      state_code: c.state_code,
    }));

    sessionStorage.setItem(cacheKey, JSON.stringify(results));

    update(() => {
      hasSearched.value = true;
      cityOptions.value = results;
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
