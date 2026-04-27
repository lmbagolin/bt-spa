<template>
  <q-page class="q-pa-lg">
    <PageHeader :title="$t('players.title')" :subtitle="$t('players.subtitle')">
      <q-btn
        color="primary"
        icon="person_add"
        :label="$t('players.new_player')"
        unelevated
        no-caps
        class="text-bold"
        @click="openPlayerDialog"
      />
    </PageHeader>

    <!-- Filtros e Busca -->
    <q-card class="q-mb-md border-surface-100 shadow-card">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6">
            <bt-input
              v-model="search"
              :placeholder="$t('players.search_placeholder')"
              outlined
              dense
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="surface-400" />
              </template>
            </bt-input>
          </div>
          <div class="col-12 col-sm-3">
            <BtSelect
              v-model="filterLevel"
              :options="levelOptions"
              :label="$t('players.filter_level')"
              outlined
              dense
              clearable
              emit-value
              map-options
              bg-color="white"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de Jogadores -->
    <q-card class="border-surface-100 shadow-card overflow-hidden">
      <q-table
        :rows="filteredPlayers"
        :columns="columns"
        row-key="id"
        flat
        :loading="playerStore.loading"
        :pagination="pagination"
        class="sakai-table"
        :no-data-label="$t('players.no_data')"
        :no-results-label="$t('players.no_results')"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" color="blue-50" text-color="primary" class="text-bold">
                {{ props.row.name.charAt(0).toUpperCase() }}
              </q-avatar>
              <div class="column q-ml-sm">
                <div class="text-bold text-surface-900">{{ props.row.name }}</div>
                <div class="text-xs text-surface-400">{{ props.row.nickname || '-' }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-level="props">
          <q-td :props="props">
            <q-chip
              :color="getLevelBadge(props.row.level).color"
              :text-color="getLevelBadge(props.row.level).textColor"
              dense
              class="text-bold text-xs"
            >
              {{ props.row.level || 'N/A' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-gender="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.gender === 'male' ? 'male' : 'female'"
              :color="props.row.gender === 'male' ? 'blue' : 'pink'"
              size="20px"
            />
            <span class="q-ml-xs text-surface-600">{{
              props.row.gender === 'male' ? $t('common.gender_masc') : $t('common.gender_fem')
            }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat round dense icon="edit" color="surface-400" @click="editPlayer(props.row)">
              <q-tooltip>{{ $t('players.tooltip_edit') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ $t('players.tooltip_delete') }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo de Jogador -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 480px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="person" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ form.id ? $t('players.dialog_edit') : $t('players.dialog_new') }}
            </div>
            <div class="text-xs text-surface-400">
              {{ $t('players.arena_label', { name: arenaStore.currentArena?.name }) }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-form @submit="onSubmit">
          <q-card-section class="q-pa-xl q-gutter-y-lg">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('players.field_full_name') }}
              </label>
              <q-input
                v-model="form.name"
                :placeholder="$t('players.field_full_name_placeholder')"
                outlined
                dense
                bg-color="white"
                lazy-rules
                :rules="[(val) => !!val || $t('players.validation_name_required')]"
              />
            </div>

            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('players.field_nickname') }}
              </label>
              <q-input
                v-model="form.nickname"
                :placeholder="$t('players.field_nickname_placeholder')"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6">
                <label
                  class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                >
                  {{ $t('players.field_gender') }}
                </label>
                <q-select
                  v-model="form.gender"
                  :options="genderOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                />
              </div>
              <div class="col-12 col-sm-6">
                <label
                  class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                >
                  {{ $t('players.field_level') }}
                </label>
                <q-select
                  v-model="form.level"
                  :options="levelOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                />
              </div>
            </div>

            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('players.field_city') }}
              </label>
              <q-input
                v-model="form.city"
                :placeholder="$t('players.field_city_placeholder')"
                outlined
                dense
                bg-color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="surface-300" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
            <q-btn
              flat
              :label="$t('common.cancel')"
              v-close-popup
              color="surface-500"
              no-caps
              class="text-bold"
            />
            <q-btn
              :label="$t('players.save')"
              type="submit"
              color="primary"
              unelevated
              class="q-px-xl text-bold no-caps shadow-md"
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePlayerStore } from 'src/stores/player';
import { useArenaStore } from 'src/stores/arena';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const playerStore = usePlayerStore();
const arenaStore = useArenaStore();
const route = useRoute();
const { t } = useI18n();
const arenaId = route.params.id;

const search = ref('');
const filterLevel = ref(null);
const showDialog = ref(false);
const saving = ref(false);

const pagination = {
  rowsPerPage: 10,
};

const form = reactive({
  id: null,
  name: '',
  nickname: '',
  gender: 'male',
  level: 'Iniciante',
  city: '',
});

const columns = computed(() => [
  { name: 'name', align: 'left', label: t('players.col_player'), field: 'name', sortable: true },
  { name: 'level', align: 'left', label: t('players.col_level'), field: 'level', sortable: true },
  {
    name: 'gender',
    align: 'left',
    label: t('players.col_gender'),
    field: 'gender',
    sortable: true,
  },
  { name: 'city', align: 'left', label: t('players.col_city'), field: 'city', sortable: true },
  { name: 'actions', align: 'center', label: t('players.col_actions') },
]);

const genderOptions = computed(() => [
  { label: t('common.gender_male'), value: 'male' },
  { label: t('common.gender_female'), value: 'female' },
  { label: t('common.gender_other'), value: 'other' },
]);

const levelOptions = ['Iniciante', 'Intermediário', 'Avançado', 'Pro', 'A', 'B', 'C', 'D'];

const filteredPlayers = computed(() => {
  let result = playerStore.players;

  if (search.value) {
    const s = search.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(s) || (p.nickname && p.nickname.toLowerCase().includes(s)),
    );
  }

  if (filterLevel.value) {
    result = result.filter((p) => p.level === filterLevel.value);
  }

  return result;
});

onMounted(async () => {
  await playerStore.fetchPlayers(arenaId);
});

function openPlayerDialog() {
  resetForm();
  showDialog.value = true;
}

function resetForm() {
  form.id = null;
  form.name = '';
  form.nickname = '';
  form.gender = 'male';
  form.level = 'Iniciante';
  form.city = '';
}

function editPlayer(player) {
  form.id = player.id;
  form.name = player.name;
  form.nickname = player.nickname;
  form.gender = player.gender;
  form.level = player.level;
  form.city = player.city;
  showDialog.value = true;
}

async function onSubmit() {
  saving.value = true;
  try {
    await playerStore.savePlayer(arenaId, { ...form });
    $q.notify({
      type: 'positive',
      message: form.id ? t('players.notify_updated') : t('players.notify_created'),
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: t('players.notify_error_save'),
      position: 'top',
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(player) {
  $q.dialog({
    title: t('players.confirm_delete_title'),
    message: t('players.confirm_delete_message', { name: player.name }),
    persistent: true,
    ok: {
      label: t('players.confirm_delete_ok'),
      color: 'negative',
      unelevated: true,
      noCaps: true,
    },
    cancel: { label: t('common.cancel'), flat: true, color: 'surface-500', noCaps: true },
  }).onOk(async () => {
    try {
      await playerStore.deletePlayer(arenaId, player.id);
      $q.notify({
        type: 'positive',
        message: t('players.notify_deleted'),
        position: 'top',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: t('players.notify_error_delete'),
        position: 'top',
      });
    }
  });
}

function getLevelBadge(level) {
  const map = {
    Iniciante: { color: 'blue-1', textColor: 'blue-10' },
    Intermediário: { color: 'orange-1', textColor: 'orange-10' },
    Avançado: { color: 'purple-1', textColor: 'purple-10' },
    Pro: { color: 'red-1', textColor: 'red-10' },
    A: { color: 'indigo-1', textColor: 'indigo-10' },
    B: { color: 'cyan-1', textColor: 'cyan-10' },
    C: { color: 'teal-1', textColor: 'teal-10' },
    D: { color: 'grey-2', textColor: 'grey-8' },
  };
  return map[level] || { color: 'surface-100', textColor: 'surface-500' };
}
</script>

<style lang="scss">
@import '../css/bt-variables.scss';

.sakai-table :deep(thead tr th) {
  font-weight: 700;
  color: var(--surface-700);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background-color: var(--surface-50);
}

.sakai-table :deep(.q-table__card) {
  border-radius: var(--radius-lg);
}

.bg-surface-50 {
  background-color: var(--surface-50);
}

.block {
  display: block;
}
</style>
