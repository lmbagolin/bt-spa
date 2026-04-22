<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-bold q-my-none text-primary">Torneios</h1>
        <div class="text-subtitle1 text-grey-7">Gerencie as competições da sua arena</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Novo Torneio"
        unelevated
        class="q-px-md shadow-2"
        @click="openForm()"
      />
    </div>

    <!-- Tournaments Table -->
    <BtTable
      :rows="tournamentStore.tournaments"
      :columns="columns"
      row-key="id"
      :loading="tournamentStore.loading"
      no-data-label="Nenhum torneio encontrado"
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
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(row)">
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </div>
      </template>
    </BtTable>

    <!-- Form Dialog -->
    <BtDialog v-model="showDialog" :title="editingId ? 'Editar Torneio' : 'Novo Torneio'" closable>
      <form @submit.prevent="onSubmit" class="q-gutter-md">
        <BtInput
          v-model="form.name"
          label="Nome do Torneio"
          placeholder="Digite o nome do torneio"
        />

        <BtSelect v-model="form.type" :options="typeOptions" label="Tipo de Torneio" clearable />

        <BtSelect v-model="form.status" :options="statusOptions" label="Status" clearable />
      </form>

      <template #actions>
        <BtButton label="Cancelar" variant="flat" @click="showDialog = false" />
        <BtButton
          label="Salvar Torneio"
          variant="primary"
          :loading="submitting"
          @click="onSubmit"
        />
      </template>
    </BtDialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTournamentStore } from 'src/stores/tournament';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const tournamentStore = useTournamentStore();
const arenaId = route.params.id;

const showDialog = ref(false);
const submitting = ref(false);
const editingId = ref(null);

const form = reactive({
  name: '',
  type: 'group_knockout',
  status: 'draft',
});

const columns = [
  { name: 'name', label: 'Nome', align: 'left', field: 'name', sortable: true },
  { name: 'type', label: 'Tipo', align: 'center', field: 'type', sortable: true },
  { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
  { name: 'actions', label: 'Ações', align: 'right', field: 'actions' },
];

const typeOptions = [
  { label: 'Grupos + Mata-mata', value: 'group_knockout' },
  { label: 'Mata-mata Simples', value: 'knockout' },
  { label: 'Liga / Pontos Corridos', value: 'league' },
];

const statusOptions = [
  { label: 'Rascunho', value: 'draft' },
  { label: 'Inscrições Abertas', value: 'open' },
  { label: 'Em Andamento', value: 'ongoing' },
  { label: 'Encerrado', value: 'finished' },
];

onMounted(() => {
  tournamentStore.fetchTournaments(arenaId);
});

function getTypeLabel(type) {
  return typeOptions.find((o) => o.value === type)?.label || type;
}

function getStatusLabel(status) {
  return statusOptions.find((o) => o.value === status)?.label || status;
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
      message: editingId.value ? 'Torneio atualizado!' : 'Torneio criado com sucesso!',
      position: 'top',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar torneio. Verifique se o backend está pronto.',
      position: 'top',
    });
  } finally {
    submitting.value = false;
  }
}

function confirmDelete(tournament) {
  $q.dialog({
    title: 'Excluir Torneio',
    message: `Deseja realmente excluir o torneio "${tournament.name}"?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Excluir', unelevated: true },
  }).onOk(async () => {
    try {
      await tournamentStore.deleteTournament(arenaId, tournament.id);
      $q.notify({ type: 'info', message: 'Torneio excluído.' });
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir.' });
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
