<template>
  <q-btn-dropdown
    flat
    dense
    no-caps
    :label="`${current.flag} ${current.short}`"
    class="lang-selector"
    dropdown-icon="expand_more"
    content-class="lang-menu"
  >
    <q-list dense>
      <q-item
        v-for="lang in locales"
        :key="lang.value"
        clickable
        v-close-popup
        :active="lang.value === locale"
        active-class="lang-active"
        @click="setLocale(lang.value)"
      >
        <q-item-section avatar class="lang-flag">{{ lang.flag }}</q-item-section>
        <q-item-section>
          <q-item-label class="text-sm text-bold">{{ lang.label }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="lang.value === locale" side>
          <q-icon name="check" size="14px" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useLocale } from 'src/composables/useLocale';

const { locale, locales, setLocale } = useLocale();

const current = computed(
  () => locales.find((l) => l.value === locale.value) ?? locales[0],
);
</script>

<style scoped>
.lang-selector {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.lang-selector:hover {
  background: rgba(0, 0, 0, 0.06);
}
</style>

<style>
.lang-menu {
  min-width: 160px;
  border-radius: 10px !important;
}

.lang-active {
  background: rgba(25, 118, 210, 0.08) !important;
}

.lang-flag {
  min-width: 28px !important;
  font-size: 1.1rem;
}
</style>
