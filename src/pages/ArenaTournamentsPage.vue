<template>
  <q-page class="q-pa-lg">
    <PageHeader
      :title="$t('tournaments.title')"
      :subtitle="$t('tournaments.subtitle')"
    >
      <q-btn color="primary" icon="add" :label="$t('tournaments.new_tournament')" unelevated no-caps class="text-bold"
        @click="openForm()" />
    </PageHeader>

    <!-- Tournaments Table -->
    <BtTable
      :rows="tournamentStore.tournaments"
      :columns="columns"
      row-key="id"
      :loading="tournamentStore.loading"
      :no-data-label="$t('tournaments.no_data')"
    >
      <template #cell-type="{ row }">
        <q-chip outline color="primary" size="sm" class="text-bold">
          {{ getTypeLabel(row.type) }}
        </q-chip>
      </template>

      <template #cell-status="{ row }">
        <q-chip :color="getStatusColor(row.status)" text-color="white" size="sm" class="text-bold">
          {{ getStatusLabel(row.status) }}
        </q-chip>
      </template>

      <template #cell-actions="{ row }">
        <div class="q-gutter-xs">
          <q-btn flat round dense color="grey-7" icon="edit" @click="openForm(row)">
            <q-tooltip>{{ $t('common.edit') }}</q-tooltip>
          </q-btn>
          <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(row)">
            <q-tooltip>{{ $t('common.delete') }}</q-tooltip>
          </q-btn>
        </div>
      </template>
    </BtTable>

    <!-- Form Dialog -->
    <BtDialog v-model="showDialog" :title="editingId ? $t('tournaments.dialog_edit') : $t('tournaments.dialog_new')" closable>
      <form @submit.prevent="onSubmit" class="q-gutter-md">
        <BtInput
          v-model="form.name"
          :label="$t('tournaments.field_name')"
          :placeholder="$t('tournaments.field_name_placeholder')"
        />

        <BtSelect v-model="form.type" :options="typeOptions" :label="$t('tournaments.field_type')" clearable />

        <BtSelect v-model="form.status" :options="statusOptions" :label="$t('tournaments.field_status')" clearable />
      </form>

      <template #actions>
        <BtButton :label="$t('common.cancel')" variant="flat" @click="showDialog = false" />
        <BtButton
          :label="$t('tournaments.save')"
          variant="primary"
          :loading="submitting"
          @click="onSubmit"
        />
      </template>
    </BtDialog>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTournamentStore } from 'src/stores/tournament';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const route = useRoute();
const tournamentStore = useTournamentStore();
const { t } = useI18n();
const arenaId = route.params.id;

const showDialog = ref(false);
const submitting = ref(false);
const editingId = ref(null);

const form = reactive({
  name: '',
  type: 'group_knockout',
  status: 'draft',
});

const columns = computed(() => [
  { name: 'name', label: t('tournaments.col_name'), align: 'left', field: 'name', sortable: true },
  { name: 'type', label: t('tournaments.col_type'), align: 'center', field: 'type', sortable: true },
  { name: 'status', label: t('tournaments.col_status'), align: 'center', field: 'status', sortable: true },
  { name: 'actions', label: t('tournaments.col_actions'), align: 'right', field: 'actions' },
]);

const typeOptions = computed(() => [
  { label: t('tournaments.type_group_knockout'), value: 'group_knockout' },
  { label: t('tournaments.type_knockout'), value: 'knockout' },
  { label: t('tournaments.type_league'), value: 'league' },
]);

const statusOptions = computed(() => [
  { label: t('tournaments.status_draft'), value: 'draft' },
  { label: t('tournaments.status_open'), value: 'open' },
  { label: t('tournaments.status_ongoing'), value: 'ongoing' },
  { label: t('tournaments.status_finished'), value: 'finished' },
]);

onMounted(() => {
  tournamentStore.fetchTournaments(arenaId);
});

function getTypeLabel(type) {
  return typeOptions.value.find((o) => o.value === type)?.label || type;
}

function getStatusLabel(status) {
  return statusOptions.value.find((o) => o.value === status)?.label || status;
}

function getStatusColor(status) {
  switch (status) {
    case 'open':
      return 'positive';
    case 'ongoing':
      return 'blue';
    case 'finished':
      return 'grey-7';
    default:
      return 'orange';
  }
}

function openForm(tournament = null) {
  if (tournament) {
    editingId.value = tournament.id;
    form.name = tournament.name;
    form.type = tournament.type;
    form.status = tournament.status;
  } else {
    editingId.value = null;
    form.name = '';
    form.type = 'group_knockout';
    form.status = 'draft';
  }
  showDialog.value = true;
}

async function onSubmit() {
  submitting.value = true;
  try {
    await tournamentStore.saveTournament(arenaId, { id: editingId.value, ...form });
    $q.notify({
      type: 'positive',
      message: editingId.value ? t('tournaments.notify_updated') : t('tournaments.notify_created'),
      position: 'top',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: t('tournaments.notify_error_save'),
      position: 'top',
    });
  } finally {
    submitting.value = false;
  }
}

function confirmDelete(tournament) {
  $q.dialog({
    title: t('tournaments.confirm_delete_title'),
    message: t('tournaments.confirm_delete_message', { name: tournament.name }),
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: t('tournaments.confirm_delete_ok'), unelevated: true },
  }).onOk(async () => {
    try {
      await tournamentStore.deleteTournament(arenaId, tournament.id);
      $q.notify({ type: 'info', message: t('tournaments.notify_deleted') });
    } catch {
      $q.notify({ type: 'negative', message: t('tournaments.notify_error_delete') });
    }
  });
}
</script>

<style scoped>
.rounded-borders-15 {
  border-radius: 15px;
}
.arena-table :deep(.q-table__card) {
  border-radius: 15px;
}
</style>
