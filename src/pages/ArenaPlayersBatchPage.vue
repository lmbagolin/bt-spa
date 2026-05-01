<template>
  <q-page class="q-pa-lg">
    <PageHeader title="Cadastro em Lote" subtitle="Adicione múltiplos jogadores de uma vez">
      <q-btn
        flat
        color="surface-500"
        icon="arrow_back"
        label="Voltar"
        no-caps
        class="text-bold"
        @click="router.back()"
      />
    </PageHeader>

    <q-card class="border-surface-100 shadow-card overflow-hidden">
      <q-card-section class="q-pa-xl bg-surface-50 border-bottom-surface-100">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-avatar icon="group_add" color="primary" text-color="white" class="shadow-md" />
            <div class="column q-ml-md">
              <div class="text-xl text-bold text-surface-900">Tabela de Jogadores</div>
              <div class="text-xs text-surface-400">Preencha os dados abaixo para cadastrar</div>
            </div>
          </div>
          <q-btn
            outline
            color="primary"
            label="Importar Lista"
            icon="content_paste"
            class="text-bold q-mr-sm no-caps"
            @click="showImportDialog = true"
          />
          <q-btn
            color="primary"
            unelevated
            label="Cadastrar Todos"
            icon="check"
            class="text-bold q-px-xl no-caps shadow-md"
            :loading="savingBatch"
            @click="onSubmitBatch"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md overflow-auto">
        <q-table
          :rows="batchRows"
          :columns="batchColumns"
          row-key="key"
          flat
          bordered
          dense
          :pagination="{ rowsPerPage: 0 }"
          hide-bottom
          class="batch-table"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                <bt-input
                  v-model="props.row.name"
                  dense
                  outlined
                  bg-color="white"
                  placeholder="Nome Completo"
                />
              </q-td>
              <q-td key="gender" :props="props">
                <bt-select
                  v-model="props.row.gender"
                  :options="genderOptions"
                  dense
                  outlined
                  emit-value
                  map-options
                  bg-color="white"
                />

                <bt-select
                  v-model="props.row.level"
                  :options="levelOptions"
                  dense
                  outlined
                  bg-color="white"
                />
              </q-td>
              <q-td key="nationality" :props="props">
                <bt-select
                  v-model="props.row.nationality"
                  :options="filteredCountries"
                  outlined
                  dense
                  emit-value
                  map-options
                  use-input
                  bg-color="white"
                  @filter="filterCountries"
                />
                <CitySelect v-model="props.row.city" dense hide-label emit-value />
              </q-td>
              <q-td key="whatsapp" :props="props">
                <q-input
                  v-model="props.row.whatsapp"
                  dense
                  outlined
                  bg-color="white"
                  placeholder="Whatsapp"
                  mask="(##) #####-####"
                  unmasked-value
                />

                <q-input
                  v-model="props.row.instagram"
                  dense
                  outlined
                  bg-color="white"
                  placeholder="@instagram"
                />
              </q-td>
              <q-td key="actions" :props="props" align="center">
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="removeBatchRow(props.rowIndex)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row q-mt-lg justify-center">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Adicionar Nova Linha"
            no-caps
            class="text-bold q-px-lg"
            @click="addBatchRow"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Diálogo de Importação -->
    <q-dialog v-model="showImportDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 600px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="content_paste" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">Importar Lista de Nomes</div>
            <div class="text-xs text-surface-400">Cole uma lista de nomes, um por linha</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-card-section class="q-pa-xl">
          <bt-textarea
            v-model="importText"
            type="textarea"
            label="Lista de Jogadores"
            placeholder="Ex:João Silva
Maria Oliveira
Pedro Santos"
            rows="10"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn
            flat
            label="Cancelar"
            v-close-popup
            color="surface-500"
            no-caps
            class="text-bold"
          />
          <q-btn
            label="Processar Lista"
            color="primary"
            unelevated
            class="q-px-xl text-bold no-caps shadow-md"
            @click="processImport"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <pre>{{ batchRows }}</pre>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import CitySelect from 'src/components/CitySelect.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from 'src/stores/player';
import { useArenaStore } from 'src/stores/arena';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'boot/axios';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore();
const arenaStore = useArenaStore();
const { t } = useI18n();
const arenaId = route.params.id;

const savingBatch = ref(false);
const showImportDialog = ref(false);
const importText = ref('');
const batchRows = ref([]);

const batchColumns = computed(() => [
  { name: 'name', label: t('players.col_player'), align: 'left', style: 'min-width: 300px' },
  { name: 'gender', label: t('players.col_gender'), align: 'left', style: 'max-width: 150px' },
  {
    name: 'nationality',
    label: t('players.field_nationality'),
    align: 'left',
    style: 'max-width: 250px',
  },
  { name: 'whatsapp', label: t('players.field_whatsapp'), align: 'left' },
  { name: 'actions', label: '', align: 'center' },
]);

const genderOptions = computed(() => [
  { label: t('common.gender_male'), value: 'male' },
  { label: t('common.gender_female'), value: 'female' },
  { label: t('common.gender_other'), value: 'other' },
]);

const levelOptions = ['Iniciante', 'Intermediário', 'Avançado', 'Pro', 'A', 'B', 'C', 'D'];

const countries = ref([]);
const filteredCountries = ref([]);

async function fetchCountries() {
  try {
    const response = await api.get('/countries');
    countries.value = response.data.map((c) => ({
      label: c.name,
      value: c.iso3,
    }));
    filteredCountries.value = countries.value;
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function filterCountries(val, update) {
  if (val === '') {
    update(() => {
      filteredCountries.value = countries.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredCountries.value = countries.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1,
    );
  });
}

onMounted(async () => {
  fetchCountries();
  await arenaStore.fetchArena(arenaId);
  // Add 10 initial rows
  for (let i = 0; i < 3; i++) {
    addBatchRow();
  }
});

function addBatchRow(name = '') {
  const arenaCity = arenaStore.currentArena?.city_id;
  batchRows.value.push({
    key: Date.now() + Math.random(),
    name: name,
    nickname: name,
    gender: 'male',
    level: 'Iniciante',
    nationality: 'BRA',
    city: arenaCity,
    whatsapp: '',
    instagram: '',
  });
}

function processImport() {
  if (!importText.value.trim()) {
    showImportDialog.value = false;
    return;
  }

  const names = importText.value
    .split('\n')
    .map((n) => n.trim())
    .filter((n) => n !== '');

  if (names.length > 0) {
    names.forEach((name) => {
      // Busca a primeira linha que ainda não tem nome preenchido
      const emptyRow = batchRows.value.find((r) => r.name.trim() === '');

      if (emptyRow) {
        emptyRow.name = name;
        emptyRow.nickname = name;
      } else {
        addBatchRow(name);
      }
    });

    $q.notify({
      type: 'positive',
      message: `${names.length} jogadores processados!`,
      position: 'top',
    });
  }

  importText.value = '';
  showImportDialog.value = false;
}

function removeBatchRow(index) {
  batchRows.value.splice(index, 1);
  if (batchRows.value.length === 0) {
    addBatchRow();
  }
}

async function onSubmitBatch() {
  const playersToSave = batchRows.value
    .filter((r) => r.name.trim() !== '')
    .map((r) => ({
      name: r.name,
      nickname: r.name,
      gender: r.gender,
      level: r.level,
      nationality: r.nationality,
      city_id: r.city,
      whatsapp: r.whatsapp,
      instagram: r.instagram,
    }));

  if (playersToSave.length === 0) {
    $q.notify({ type: 'warning', message: 'Preencha ao menos o nome de um jogador.' });
    return;
  }

  savingBatch.value = true;
  try {
    await playerStore.savePlayersBatch(arenaId, playersToSave);
    $q.notify({
      type: 'positive',
      message: 'Jogadores cadastrados com sucesso!',
      position: 'top',
      icon: 'check_circle',
    });
    router.push({ path: `/admin/arena/${arenaId}/players` });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao cadastrar jogadores. Verifique os dados.',
      position: 'top',
    });
  } finally {
    savingBatch.value = false;
  }
}
</script>

<style lang="scss">
.batch-table :deep(thead tr th) {
  font-weight: 700;
  color: var(--surface-700);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  background-color: var(--surface-50);
}

.border-bottom-surface-100 {
  border-bottom: 1px solid var(--surface-100);
}
</style>
