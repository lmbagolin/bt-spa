<template>
  <q-page class="q-pa-lg">
    <PageHeader
      :title="$t('leagues.title')"
      :subtitle="$t('leagues.subtitle')"
    >
      <q-btn color="primary" icon="add" :label="$t('leagues.new_league')" unelevated no-caps class="text-bold"
        @click="openLeagueDialog" />
    </PageHeader>

    <!-- Cards de Ligas -->
    <div class="row q-col-gutter-lg">
      <div v-if="leagueStore.loading && leagueStore.leagues.length === 0" class="col-12">
        <q-skeleton type="rect" class="radius-lg" height="200px" />
      </div>
      <template v-else-if="leagueStore.leagues.length > 0">
        <div v-for="league in leagueStore.leagues" :key="league.id" class="col-12 col-sm-6 col-md-4">
          <LeagueCard
            :league="league"
            :on-edit="() => editLeague(league)"
            :on-delete="() => confirmDelete(league)"
            @click="$router.push(`/admin/arena/${arenaId}/leagues/${league.id}`)"
            @stages="$router.push(`/admin/arena/${arenaId}/leagues/${league.id}`)"
            @ranking="$router.push({ name: 'league-ranking', params: { id: arenaId, leagueId: league.id } })"
            @active-stage="league.active_stage && $router.push({ name: 'stage-detail', params: { id: arenaId, leagueId: league.id, stageId: league.active_stage.id } })"
          />
        </div>
      </template>
      <div v-else class="col-12">
        <q-card class="bg-surface-50 border-surface-100">
          <q-card-section class="text-center q-py-xl">
            <q-icon name="league" size="48px" color="surface-300" class="q-mb-md" />
            <p class="text-surface-500 q-my-none">{{ $t('leagues.no_leagues') }}</p>
            <q-btn
              color="primary"
              :label="$t('leagues.create_first')"
              flat
              class="text-bold q-mt-md"
              @click="openLeagueDialog"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Liga -->
    <BtDialog v-model="showDialog" :title="form.id ? $t('leagues.dialog_edit') : $t('leagues.dialog_new')" closable>
      <div class="q-gutter-y-lg">
        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('leagues.field_name') }}
          </label>
          <BtInput v-model="form.nome" :placeholder="$t('leagues.field_name_placeholder')" />
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6">
            <div class="q-gutter-y-xs">
              <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                {{ $t('leagues.field_start_date') }}
              </label>
              <BtDatePicker v-model="form.data_inicio" />
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="q-gutter-y-xs">
              <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                {{ $t('leagues.field_end_date') }}
              </label>
              <BtDatePicker v-model="form.data_prevista_termino" />
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                {{ $t('leagues.field_stages_count') }}
              </label>
              <BtInput v-model.number="form.numero_etapas" type="number" :placeholder="$t('leagues.field_stages_placeholder')" />
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                {{ $t('leagues.field_level') }}
              </label>
              <BtInput v-model="form.nivel" :placeholder="$t('leagues.field_level_placeholder')" />
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                {{ $t('leagues.field_gender') }}
              </label>
              <BtSelect
                v-model="form.genero"
                :options="generoOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>

        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('leagues.field_description') }}
          </label>
          <BtTextarea v-model="form.descricao" :placeholder="$t('leagues.field_description_placeholder')" :rows="3" />
        </div>

        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('leagues.field_award') }}
          </label>
          <BtTextarea v-model="form.premiacao" :placeholder="$t('leagues.field_award_placeholder')" :rows="3" />
        </div>
      </div>

      <template #actions>
        <BtButton :label="$t('common.cancel')" variant="flat" @click="showDialog = false" />
        <BtButton :label="$t('leagues.save')" variant="primary" :loading="saving" @click="onSubmit" />
      </template>
    </BtDialog>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import LeagueCard from 'src/components/others/LeagueCard.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const route = useRoute();
const leagueStore = useLeagueStore();
const { t } = useI18n();
const arenaId = route.params.id;

const showDialog = ref(false);
const saving = ref(false);

const generoOptions = computed(() => [
  { label: t('common.gender_male'), value: 'masculino' },
  { label: t('common.gender_female'), value: 'feminino' },
  { label: t('common.gender_mixed'), value: 'misto' },
]);

const form = reactive({
  id: null,
  nome: '',
  data_inicio: '',
  data_prevista_termino: '',
  numero_etapas: 1,
  nivel: '',
  genero: 'misto',
  descricao: '',
  premiacao: '',
});

onMounted(async () => {
  await leagueStore.fetchLeagues(arenaId);
});

function openLeagueDialog() {
  resetForm();
  showDialog.value = true;
}

function resetForm() {
  form.id = null;
  form.nome = '';
  form.data_inicio = '';
  form.data_prevista_termino = '';
  form.numero_etapas = 1;
  form.nivel = '';
  form.genero = 'misto';
  form.descricao = '';
  form.premiacao = '';
}

function editLeague(league) {
  form.id = league.id;
  form.nome = league.nome;
  form.data_inicio = league.data_inicio;
  form.data_prevista_termino = league.data_prevista_termino;
  form.numero_etapas = league.numero_etapas;
  form.nivel = league.nivel;
  form.genero = league.genero ?? 'misto';
  form.descricao = league.descricao;
  form.premiacao = league.premiacao;
  showDialog.value = true;
}

async function onSubmit() {
  saving.value = true;
  try {
    await leagueStore.saveLeague(arenaId, { ...form });
    $q.notify({
      type: 'positive',
      message: form.id ? t('leagues.notify_updated') : t('leagues.notify_created'),
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: t('leagues.notify_error_save'),
      position: 'top',
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(league) {
  $q.dialog({
    title: t('leagues.confirm_delete_title'),
    message: t('leagues.confirm_delete_message', { name: league.nome }),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await leagueStore.deleteLeague(arenaId, league.id);
      $q.notify({
        type: 'positive',
        message: t('leagues.notify_deleted'),
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: t('leagues.notify_error_delete'),
        position: 'top',
      });
    }
  });
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
