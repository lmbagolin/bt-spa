<template>
  <q-page class="q-pa-lg">
    <div v-if="leagueStore.loadingPublic" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else-if="league">
      <!-- Cabeçalho -->
      <PageHeader
        :title="league.nome"
        :subtitle="league.arena?.name ?? ''"
        :back="() => router.push({ name: 'player-leagues' })"
      >
        <q-btn
          v-if="hasRanking"
          outline
          color="primary"
          icon="bar_chart"
          label="Ranking Geral"
          no-caps
          class="text-bold"
          @click="router.push({ name: 'player-league-ranking', params: { leagueId } })"
        />
      </PageHeader>

      <!-- Cards de informação -->
      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12 col-sm-6 col-md">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
                Data de Início
              </div>
              <div class="text-lg text-bold text-primary">{{ formatDate(league.data_inicio) }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
                Data de Término
              </div>
              <div class="text-lg text-bold text-primary">
                {{ formatDate(league.data_prevista_termino) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
                Nível
              </div>
              <div class="text-lg text-bold text-primary">{{ league.nivel || '—' }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
                Gênero
              </div>
              <q-chip
                dense
                :color="generoChip(league.gender).color"
                text-color="white"
                class="text-sm text-bold q-px-md"
              >
                {{ generoChip(league.gender).label }}
              </q-chip>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
                Etapas Concluídas
              </div>
              <div class="text-lg text-bold text-primary">
                {{ closedStages
                }}<span class="text-sm text-surface-400 q-ml-xs" style="font-weight: 500"
                  >/ {{ league.numero_etapas }}</span
                >
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Descrição e Premiação -->
      <div class="row q-col-gutter-lg q-mb-lg">
        <div v-if="league.descricao" class="col-12 col-md-6">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-sm text-bold text-surface-900 q-mb-md">Descrição</div>
              <p class="text-sm text-surface-600 q-my-none">{{ league.descricao }}</p>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="league.premiacao" class="col-12 col-md-6">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section>
              <div class="text-sm text-bold text-surface-900 q-mb-md">Premiação</div>
              <p class="text-sm text-surface-600 q-my-none">{{ league.premiacao }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- CTA: Etapa com inscrições abertas -->
      <div v-if="nextOpenStage" class="q-mb-lg">
        <StageRegistrationCard
          :stage="nextOpenStage"
          :league="league"
          :league-id="leagueId"
          :my-registration="myRegistrationForStage(nextOpenStage.id)"
          @registered="onRegistered"
        />
      </div>

      <!-- Dialog de inscrição via tabela -->
      <StageRegistrationCard
        v-if="selectedTableStage"
        :stage="selectedTableStage"
        :league="league"
        :league-id="leagueId"
        :my-registration="myRegistrationForStage(selectedTableStage.id)"
        v-model:open="showTableDialog"
        dialog-only
        @registered="onRegistered"
      />

      <!-- Tabela de Etapas -->
      <q-card class="border-surface-100 shadow-card overflow-hidden">
        <q-card-section class="q-pa-lg bg-surface-50 border-surface-100">
          <div class="text-lg text-bold text-surface-900">Etapas</div>
        </q-card-section>
        <q-table
          :rows="allStagesSorted"
          :columns="columns"
          row-key="id"
          flat
          :pagination="{ rowsPerPage: 15 }"
          no-data-label="Nenhuma etapa cadastrada."
        >
          <template v-slot:body-cell-data_etapa="props">
            <q-td :props="props">{{ formatDate(props.row.data_etapa) }}</q-td>
          </template>

          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <q-chip color="blue-50" text-color="primary" dense class="text-bold text-xs">
                {{ tipoLabel(props.row.tipo) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-stage_status="props">
            <q-td :props="props">
              <q-chip
                :color="stageStatusColor(props.row.stage_status).bg"
                :text-color="stageStatusColor(props.row.stage_status).text"
                dense
                class="text-bold text-xs"
              >
                {{ stageStatusLabel(props.row.stage_status) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-valor_inscricao="props">
            <q-td :props="props">{{ formatCurrency(props.row.valor_inscricao) }}</q-td>
          </template>

          <template v-slot:body-cell-jogadores_por_grupo="props">
            <q-td :props="props">
              <span class="text-bold">{{ props.row.jogadores_por_grupo }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-disputa_3_lugar="props">
            <q-td :props="props">
              <q-icon
                :name="props.row.disputa_3_lugar ? 'check_circle' : 'cancel'"
                :color="props.row.disputa_3_lugar ? 'positive' : 'negative'"
                size="20px"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <template v-if="props.row.stage_status === 'registrations_open'">
                <q-chip
                  v-if="myRegistrationForStage(props.row.id)"
                  :color="statusConfig[myRegistrationForStage(props.row.id).status]?.color"
                  :text-color="statusConfig[myRegistrationForStage(props.row.id).status]?.textColor"
                  dense
                  class="text-bold text-xs"
                >
                  {{ statusConfig[myRegistrationForStage(props.row.id).status]?.label }}
                </q-chip>
                <q-btn
                  v-else
                  flat
                  dense
                  no-caps
                  size="sm"
                  icon="how_to_reg"
                  label="Inscrever"
                  color="primary"
                  class="text-bold"
                  @click="
                    selectedTableStage = props.row;
                    showTableDialog = true;
                  "
                />
              </template>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </template>

    <!-- Não encontrado -->
    <div v-else-if="!leagueStore.loadingPublic" class="row justify-center q-pa-xl text-center">
      <div class="col-12">
        <q-icon name="error_outline" size="72px" color="surface-200" class="q-mb-md" />
        <div class="text-lg text-bold text-surface-400 q-mb-sm">Liga não encontrada.</div>
        <q-btn
          label="Voltar"
          color="primary"
          flat
          no-caps
          @click="router.push({ name: 'player-leagues' })"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import StageRegistrationCard from 'src/components/others/StageRegistrationCard.vue';
import { tipoLabel } from 'src/composables/useStageTypes';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { usePlayerStore } from 'src/stores/player';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const leagueStore = useLeagueStore();
const playerStore = usePlayerStore();
const { t } = useI18n();

const leagueId = route.params.leagueId;
const selectedTableStage = ref(null);
const showTableDialog = ref(false);

const league = computed(() => leagueStore.currentPublicLeague);

const allStagesSorted = computed(() => {
  if (!league.value?.stages?.length) return [];
  return [...league.value.stages].sort(
    (a, b) => new Date(a.data_etapa.replace(' ', 'T')) - new Date(b.data_etapa.replace(' ', 'T')),
  );
});

const closedStages = computed(
  () => (league.value?.stages ?? []).filter((s) => s.stage_status === 'closed').length,
);

const hasRanking = computed(() => closedStages.value > 0);

const nextOpenStage = computed(
  () => allStagesSorted.value.find((s) => s.stage_status === 'registrations_open') ?? null,
);

const statusConfig = computed(() => ({
  pending: {
    label: t('player_league_detail.status_waiting'),
    color: 'amber-2',
    textColor: 'amber-9',
  },
  confirmed: {
    label: t('player_league_detail.status_confirmed'),
    color: 'green-2',
    textColor: 'green-9',
  },
  waitlist: {
    label: t('player_league_detail.status_waitlist'),
    color: 'blue-2',
    textColor: 'blue-9',
  },
  cancelled: {
    label: t('player_league_detail.status_cancelled'),
    color: 'red-2',
    textColor: 'red-9',
  },
}));

const STAGE_STATUS = {
  created: { label: 'Criada', bg: 'surface-100', text: 'surface-600' },
  registrations_open: { label: 'Inscrições abertas', bg: 'blue-1', text: 'blue-9' },
  group_draw: { label: 'Sorteio grupos', bg: 'purple-1', text: 'purple-9' },
  group_stage: { label: 'Fase de grupos', bg: 'orange-1', text: 'orange-9' },
  playoffs: { label: 'Playoffs', bg: 'green-1', text: 'green-9' },
  closed: { label: 'Encerrada', bg: 'grey-2', text: 'grey-8' },
};
const stageStatusLabel = (s) => STAGE_STATUS[s]?.label ?? s;
const stageStatusColor = (s) => STAGE_STATUS[s] ?? { bg: 'surface-100', text: 'surface-600' };

const GENERO_MAP = {
  male: { label: 'Masculino', color: 'blue' },
  female: { label: 'Feminino', color: 'pink' },
  mixed: { label: 'Misto', color: 'purple' },
};
function generoChip(g) {
  return GENERO_MAP[g] ?? { label: '—', color: 'grey' };
}

const columns = [
  { name: 'data_etapa', align: 'left', label: 'Data', field: 'data_etapa', sortable: true },
  { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo', sortable: true },
  { name: 'stage_status', align: 'left', label: 'Status', field: 'stage_status' },
  {
    name: 'valor_inscricao',
    align: 'left',
    label: 'Inscrição',
    field: 'valor_inscricao',
    sortable: true,
  },
  { name: 'jogadores_por_grupo', align: 'left', label: 'Jog./Grupo', field: 'jogadores_por_grupo' },
  { name: 'disputa_3_lugar', align: 'left', label: '3º Lugar?', field: 'disputa_3_lugar' },
  { name: 'actions', align: 'center', label: '' },
];

onMounted(async () => {
  await Promise.all([
    leagueStore.fetchPublicLeague(leagueId),
    playerStore.currentPlayer ? Promise.resolve() : playerStore.fetchProfile(),
  ]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureStages = (leagueStore.currentPublicLeague?.stages ?? []).filter(
    (s) => new Date(s.data_etapa.replace(' ', 'T')) >= today,
  );
  await Promise.all(
    futureStages.map((s) => leagueStore.fetchPublicStageRegistrations(leagueId, s.id)),
  );
});

function getStageRegistrations(stageId) {
  return leagueStore.publicStageRegistrations[stageId] || [];
}

function myRegistrationForStage(stageId) {
  const regs = getStageRegistrations(stageId);
  const myId = playerStore.currentPlayer?.id;
  if (!myId) return null;
  return regs.find((r) => r.player?.id === myId) || null;
}

async function onRegistered(stageId) {
  await leagueStore.fetchPublicStageRegistrations(leagueId, stageId);
  showTableDialog.value = false;
  selectedTableStage.value = null;
}

function parseDate(str) {
  if (!str) return new Date(NaN);
  return new Date(str.replace(' ', 'T'));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  if (isNaN(d)) return '—';
  const dateFormatted = d.toLocaleDateString('pt-BR');
  const timePart = dateStr.includes(' ') ? dateStr.split(' ')[1] : null;
  return timePart && timePart !== '00:00' ? `${dateFormatted} ${timePart}` : dateFormatted;
}

function formatCurrency(value) {
  if (value == null) return '—';
  if (value === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>
