<template>
  <q-card class="bt-table-card">
    <!-- Table Header with Actions -->
    <q-card-section v-if="title || $slots.header" class="bt-table-header">
      <div class="row items-center justify-between">
        <div v-if="title" class="column">
          <h3 class="bt-table-title">{{ title }}</h3>
          <p v-if="subtitle" class="bt-table-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.header" class="header-actions">
          <slot name="header" />
        </div>
      </div>
    </q-card-section>

    <!-- Table -->
    <q-table
      v-bind="tableAttrs"
      class="bt-table"
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      :rows-per-page-options="rowsPerPageOptions"
      v-model:pagination="pagination"
    >
      <!-- Custom slots for columns -->
      <template v-for="col in columns" :key="col.name" #[`body-cell-${col.name}`]="props">
        <q-td :props="props">
          <slot :name="`cell-${col.name}`" :row="props.row" :value="props.row[col.field]">
            {{ props.row[col.field] }}
          </slot>
        </q-td>
      </template>

      <!-- Actions column -->
      <template v-if="$slots['cell-actions']" #body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <slot name="cell-actions" :row="props.row" />
        </q-td>
      </template>

      <!-- No data state -->
      <template #no-data>
        <div class="text-center q-pa-lg text-secondary">
          <q-icon name="inbox" size="48px" class="opacity-50" />
          <div class="text-base q-mt-md">{{ noDataLabel }}</div>
        </div>
      </template>

      <!-- Loading state -->
      <template v-if="loading" #loading>
        <q-linear-progress indeterminate color="primary" />
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  title: String,
  subtitle: String,
  loading: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  striped: {
    type: Boolean,
    default: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  noDataLabel: {
    type: String,
    default: 'Nenhum dado encontrado',
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50],
  },
  separator: {
    type: String,
    default: 'horizontal',
  },
});

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: props.rowsPerPage,
  rowsNumber: props.rows.length,
});

const tableAttrs = computed(() => ({
  selection: false,
  'card-class': 'bt-table',
  'table-class': 'bt-table__body',
  'table-header-style': 'background-color: var(--main-bg);',
  bordered: props.bordered,
  striped: props.striped,
  dense: props.dense,
  flat: props.flat,
  separator: props.separator,
  pagination: pagination.value,
  'onUpdate:pagination': (newPagination) => {
    pagination.value = newPagination;
  },
}));
</script>

<style lang="scss">
@import '../css/bt-variables.scss';

.bt-table-card {
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  border: none;

  .bt-table-header {
    background-color: $color-bg-light;
    border-bottom: $border-width solid $color-card-border;
    padding: $spacing-lg;

    .bt-table-title {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin: 0 0 $spacing-sm 0;
    }

    .bt-table-subtitle {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: $spacing-md;
      align-items: center;
    }
  }
}

.bt-table {
  :deep(.q-table__card) {
    background-color: $color-card-bg;
    border-radius: 0;
    box-shadow: none;
  }

  :deep(.q-table__head tr) {
    background-color: $color-bg-light;
    border-bottom: $border-width solid $color-card-border;
  }

  :deep(.q-table__head th) {
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    padding: $spacing-md;
    text-transform: none;
  }

  :deep(.q-table__row) {
    border-bottom: $border-width solid $color-card-border;
    transition: background-color $transition-fast;

    &:hover {
      background-color: $color-bg-light;
    }

    td {
      padding: $spacing-md;
      color: $color-text-primary;
      font-size: $font-size-base;
    }
  }

  :deep(.q-table__body-nodata) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    color: $color-text-secondary;
    height: 300px;
  }

  // Pagination
  .q-table__bottom {
    background-color: $color-bg-light;
    border: 1px solid red;
    padding: $spacing-md;
    color: $color-text-secondary;

    label.q-field {
      margin: 0px !important;
    }
  }

  :deep(.q-table__card.q-table__container--bordered) {
    border: $border-width solid $color-card-border;
  }
}
</style>
