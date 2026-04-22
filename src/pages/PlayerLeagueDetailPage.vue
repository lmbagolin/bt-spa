<template>
  <q-page class="q-pa-lg">
    <!-- Loading state -->
    <div v-if="leagueStore.loadingPublic" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else-if="league">
      <!-- Breadcrumb -->
      <div class="row items-center q-gutter-xs q-mb-lg">
        <q-btn
          flat
          dense
          no-caps
          label="Ligas & Torneios"
          color="primary"
          class="text-sm q-pa-xs"
          @click="router.push({ name: 'player-leagues' })"
        />
        <q-icon name="chevron_right" color="surface-300" size="18px" />
        <span class="text-sm text-surface-500">{{ league.nome }}</span>
      </div>

      <!-- Hero da Liga -->
      <q-card class="border-surface-100 shadow-card overflow-hidden q-mb-lg">
        <div class="league-hero q-pa-xl" :style="getHeroStyle(league.nivel)">
          <div class="row items-start justify-between q-col-gutter-lg">
            <div class="col-12 col-sm-8">
              <div class="row items-center q-gutter-sm q-mb-md">
                <q-chip
                  color="white"
                  text-color="primary"
                  dense
                  class="text-bold"
                >
                  {{ league.nivel }}
                </q-chip>
                <q-chip
                  color="rgba(255,255,255,0.15)"
                  text-color="white"
                  dense
                  icon="event"
                >
                  {{ league.numero_etapas }} etapas
                </q-chip>
              </div>
              <h1 class="text-3xl text-bold text-white q-my-none leading-tight">
                {{ league.nome }}
              </h1>
              <div v-if="league.arena" class="row items-center q-gutter-xs q-mt-sm">
                <q-icon name="location_on" color="blue-2" size="16px" />
                <span class="text-sm text-white" style="opacity: 0.85;">
                  {{ league.arena.name }}
                </span>
                <span v-if="league.arena.city" class="text-sm" style="color: rgba(255,255,255,0.55);">
                  · {{ league.arena.city }}
                </span>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="row q-col-gutter-md">
                <div class="col-6 col-sm-12">
                  <div class="text-xs q-mb-xs" style="color: rgba(255,255,255,0.55);">INÍCIO</div>
                  <div class="text-sm text-bold text-white">{{ formatDate(league.data_inicio) }}</div>
                </div>
                <div class="col-6 col-sm-12">
                  <div class="text-xs q-mb-xs" style="color: rgba(255,255,255,0.55);">TÉRMINO PREVISTO</div>
                  <div class="text-sm text-bold text-white">{{ formatDate(league.data_prevista_termino) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Descrição e Premiação -->
        <div v-if="league.descricao || league.premiacao" class="q-pa-lg">
          <div class="row q-col-gutter-lg">
            <div v-if="league.descricao" class="col-12 col-md-7">
              <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">Sobre</div>
              <p class="text-sm text-surface-700 q-my-none" style="line-height: 1.6;">
                {{ league.descricao }}
              </p>
            </div>
            <div v-if="league.premiacao" class="col-12 col-md-5">
              <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">Premiação</div>
              <div class="row items-start q-gutter-sm">
                <q-icon name="workspace_premium" color="amber-6" size="20px" class="q-mt-xs" />
                <p class="text-sm text-surface-700 q-my-none col" style="line-height: 1.6;">
                  {{ league.premiacao }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </q-card>

      <!-- Próxima Etapa em Destaque -->
      <div v-if="nextStage" class="q-mb-lg">
        <div class="text-sm text-bold text-surface-500 uppercase tracking-widest q-mb-md">
          Próxima Etapa
        </div>
        <q-card class="next-stage-card border-primary overflow-hidden shadow-card">
          <div class="row no-wrap">
            <!-- Coluna de data (lateral colorida) -->
            <div class="next-stage-date-col flex flex-center column q-pa-lg" :style="getHeroStyle(league.nivel)">
              <div class="text-4xl text-bold text-white leading-none">
                {{ formatDay(nextStage.data_etapa) }}
              </div>
              <div class="text-sm text-white q-mt-xs" style="opacity: 0.8;">
                {{ formatMonth(nextStage.data_etapa) }}
              </div>
              <div class="text-xs q-mt-xs text-white" style="opacity: 0.6;">
                {{ formatYear(nextStage.data_etapa) }}
              </div>
            </div>

            <!-- Conteúdo principal -->
            <div class="col q-pa-lg">
              <div class="row items-center q-gutter-sm q-mb-sm">
                <q-chip color="primary" text-color="white" dense class="text-bold text-xs">
                  {{ nextStage.tipo }}
                </q-chip>
                <q-chip color="green-1" text-color="green-9" dense class="text-bold text-xs">
                  {{ getDaysUntil(nextStage.data_etapa) }}
                </q-chip>
              </div>

              <div class="text-lg text-bold text-surface-900 q-mb-xs">
                {{ getDayOfWeek(nextStage.data_etapa) }},
                {{ formatDateFull(nextStage.data_etapa) }}
              </div>

              <div class="row q-col-gutter-xl q-mt-md q-mb-lg">
                <div class="col-auto">
                  <div class="text-xs text-surface-400 q-mb-xs">Inscrição</div>
                  <div class="text-xl text-bold text-positive">
                    {{ formatCurrency(nextStage.valor_inscricao) }}
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-xs text-surface-400 q-mb-xs">Jogadores por grupo</div>
                  <div class="text-xl text-bold text-surface-800">
                    {{ nextStage.jogadores_por_grupo }}
                  </div>
                </div>
                <div v-if="nextStage.classificam_total" class="col-auto">
                  <div class="text-xs text-surface-400 q-mb-xs">Avançam</div>
                  <div class="text-xl text-bold text-surface-800">
                    Top {{ nextStage.classificam_total }}
                  </div>
                </div>
                <div v-if="nextStage.disputa_3_lugar" class="col-auto">
                  <div class="text-xs text-surface-400 q-mb-xs">3º Lugar</div>
                  <q-icon name="check_circle" color="positive" size="24px" />
                </div>
              </div>

              <!-- Botão de inscrição ou status atual -->
              <template v-if="myRegistrationForStage(nextStage.id)">
                <div class="row items-center q-gutter-sm">
                  <q-chip
                    :color="statusConfig[myRegistrationForStage(nextStage.id).status]?.color"
                    :text-color="statusConfig[myRegistrationForStage(nextStage.id).status]?.textColor"
                    :icon="statusConfig[myRegistrationForStage(nextStage.id).status]?.icon"
                    class="text-bold"
                    size="md"
                  >
                    {{ statusConfig[myRegistrationForStage(nextStage.id).status]?.label }}
                  </q-chip>
                  <span class="text-xs text-surface-400">Você já está inscrito nesta etapa</span>
                </div>
              </template>
              <q-btn
                v-else
                label="Quero me inscrever"
                color="primary"
                unelevated
                no-caps
                size="lg"
                icon="how_to_reg"
                class="text-bold q-px-xl"
                @click="openRegistrationDialog(nextStage)"
              />
            </div>
          </div>
        </q-card>

        <!-- Lista de Jogadores Inscritos -->
        <div
          v-if="getStageRegistrations(nextStage.id).length"
          class="q-mt-md"
        >
          <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
            Jogadores inscritos ({{ getStageRegistrations(nextStage.id).length }})
          </div>
          <q-card class="border-surface-100 shadow-card">
            <q-list separator>
              <q-item
                v-for="reg in getStageRegistrations(nextStage.id)"
                :key="reg.id"
                class="q-py-sm"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="36px"
                    :color="reg.player?.id === playerStore.currentPlayer?.id ? 'primary' : 'surface-100'"
                    :text-color="reg.player?.id === playerStore.currentPlayer?.id ? 'white' : 'surface-500'"
                    class="text-bold text-sm"
                  >
                    {{ reg.player?.name?.charAt(0)?.toUpperCase() || '?' }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm text-bold text-surface-900 row items-center q-gutter-xs">
                    <span>{{ reg.player?.name }}</span>
                    <span
                      v-if="reg.player?.id === playerStore.currentPlayer?.id"
                      class="text-xs text-primary"
                    >(você)</span>
                  </q-item-label>
                  <q-item-label caption class="row items-center q-gutter-sm">
                    <span v-if="reg.player?.nickname" class="text-surface-400">"{{ reg.player.nickname }}"</span>
                    <span v-if="reg.player?.level" class="text-surface-400">· {{ reg.player.level }}</span>
                    <span v-if="reg.player?.gender" class="text-surface-300">
                      · {{ reg.player.gender === 'male' ? 'Masculino' : reg.player.gender === 'female' ? 'Feminino' : reg.player.gender }}
                    </span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    :color="statusConfig[reg.status]?.color"
                    :text-color="statusConfig[reg.status]?.textColor"
                    dense
                    class="text-bold text-xs"
                  >
                    {{ statusConfig[reg.status]?.label }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div
          v-else-if="!leagueStore.loadingPublicRegistrations"
          class="q-mt-sm text-xs text-surface-300 text-center q-pa-md"
        >
          Nenhum jogador inscrito ainda. Seja o primeiro!
        </div>
      </div>

      <!-- Demais Etapas Futuras -->
      <div v-if="otherFutureStages.length" class="q-mb-lg">
        <div class="text-sm text-bold text-surface-500 uppercase tracking-widest q-mb-md">
          Outras Etapas
        </div>
        <div class="row q-col-gutter-md">
          <div
            v-for="stage in otherFutureStages"
            :key="stage.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="border-surface-100 shadow-card overflow-hidden">
              <q-card-section class="q-pa-md">
                <div class="row items-center q-gutter-sm q-mb-sm">
                  <q-chip color="blue-1" text-color="primary" dense class="text-bold text-xs">
                    {{ stage.tipo }}
                  </q-chip>
                </div>
                <div class="text-base text-bold text-surface-900">
                  {{ formatDateFull(stage.data_etapa) }}
                </div>
                <div class="text-xs text-surface-500 q-mt-xs q-mb-md">
                  {{ getDayOfWeek(stage.data_etapa) }} · {{ getDaysUntil(stage.data_etapa) }}
                </div>
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-xs text-surface-400">Inscrição</div>
                    <div class="text-sm text-bold text-positive">
                      {{ formatCurrency(stage.valor_inscricao) }}
                    </div>
                  </div>
                  <q-chip
                    v-if="myRegistrationForStage(stage.id)"
                    :color="statusConfig[myRegistrationForStage(stage.id).status]?.color"
                    :text-color="statusConfig[myRegistrationForStage(stage.id).status]?.textColor"
                    dense
                    class="text-bold text-xs"
                  >
                    {{ statusConfig[myRegistrationForStage(stage.id).status]?.label }}
                  </q-chip>
                  <q-btn
                    v-else
                    label="Inscrever"
                    color="primary"
                    outline
                    no-caps
                    dense
                    class="text-bold q-px-md"
                    @click="openRegistrationDialog(stage)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Etapas Encerradas -->
      <div v-if="pastStages.length">
        <q-expansion-item
          :label="`${pastStages.length} etapa(s) já realizadas`"
          header-class="text-sm text-surface-400 q-px-none"
          expand-icon-class="text-surface-300"
        >
          <div class="row q-col-gutter-md q-mt-sm">
            <div
              v-for="stage in pastStages"
              :key="stage.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <div class="past-stage-card q-pa-md radius-lg">
                <div class="row items-center justify-between no-wrap">
                  <div>
                    <div class="text-sm text-bold text-surface-400">
                      {{ formatDateFull(stage.data_etapa) }}
                    </div>
                    <div class="text-xs text-surface-300 q-mt-xs">{{ stage.tipo }}</div>
                  </div>
                  <q-chip color="surface-100" text-color="surface-400" dense class="text-xs text-bold">
                    Encerrada
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>

      <!-- Estado vazio: sem etapas -->
      <div v-if="!nextStage && !otherFutureStages.length && !pastStages.length" class="text-center q-pa-xl">
        <q-icon name="event_busy" size="64px" color="surface-200" class="q-mb-md" />
        <div class="text-base text-bold text-surface-400">Nenhuma etapa cadastrada ainda</div>
      </div>
    </template>

    <!-- Erro / não encontrado -->
    <div v-else-if="!leagueStore.loadingPublic" class="row justify-center q-pa-xl text-center">
      <div class="col-12">
        <q-icon name="error_outline" size="72px" color="surface-200" class="q-mb-md" />
        <div class="text-lg text-bold text-surface-400 q-mb-sm">Liga não encontrada</div>
        <q-btn label="Voltar" color="primary" flat no-caps @click="router.push({ name: 'player-leagues' })" />
      </div>
    </div>

    <!-- Dialog de Confirmação de Inscrição -->
    <q-dialog v-model="showRegistrationDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 420px; max-width: 95vw;">
        <!-- Header -->
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="how_to_reg" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">Confirmar Inscrição</div>
            <div class="text-xs text-surface-400">{{ league?.nome }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-card-section class="q-pa-xl q-gutter-y-md">
          <!-- Resumo da Etapa -->
          <div class="confirm-block q-pa-md radius-lg q-mb-xs">
            <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">Etapa</div>
            <div class="row items-center q-gutter-sm q-mb-xs">
              <q-chip color="blue-1" text-color="primary" dense class="text-bold text-xs">
                {{ selectedStage?.tipo }}
              </q-chip>
            </div>
            <div class="text-base text-bold text-surface-900">
              {{ getDayOfWeek(selectedStage?.data_etapa) }}, {{ formatDateFull(selectedStage?.data_etapa) }}
            </div>
            <div class="row items-center justify-between q-mt-sm">
              <span class="text-sm text-surface-500">Valor da inscrição</span>
              <span class="text-base text-bold text-positive">
                {{ formatCurrency(selectedStage?.valor_inscricao) }}
              </span>
            </div>
          </div>

          <!-- Dados do Jogador -->
          <div class="confirm-block q-pa-md radius-lg">
            <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-md">Seus dados</div>
            <div class="row items-center no-wrap q-gutter-md">
              <q-avatar size="44px" color="primary" text-color="white" class="text-bold text-lg">
                {{ playerStore.currentPlayer?.name?.charAt(0)?.toUpperCase() || '?' }}
              </q-avatar>
              <div class="col">
                <div class="text-base text-bold text-surface-900">
                  {{ playerStore.currentPlayer?.name || '—' }}
                </div>
                <div v-if="playerStore.currentPlayer?.nickname" class="text-xs text-surface-400">
                  {{ playerStore.currentPlayer.nickname }}
                </div>
                <div class="row items-center q-gutter-md q-mt-xs">
                  <div v-if="playerStore.currentPlayer?.level" class="row items-center q-gutter-xs">
                    <q-icon name="sports_tennis" size="13px" color="surface-400" />
                    <span class="text-xs text-surface-500">{{ playerStore.currentPlayer.level }}</span>
                  </div>
                  <div v-if="playerStore.currentPlayer?.whatsapp" class="row items-center q-gutter-xs">
                    <q-icon name="phone" size="13px" color="surface-400" />
                    <span class="text-xs text-surface-500">{{ playerStore.currentPlayer.whatsapp }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aviso se perfil incompleto -->
            <q-banner
              v-if="!playerStore.currentPlayer?.name"
              class="q-mt-md text-xs"
              rounded
              dense
            >
              <template v-slot:avatar>
                <q-icon name="warning" color="warning" />
              </template>
              Perfil incompleto. Acesse
              <router-link to="/profile" class="text-primary text-bold">Meu Perfil</router-link>
              antes de se inscrever.
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn flat label="Cancelar" v-close-popup color="surface-500" no-caps class="text-bold" />
          <q-btn
            label="Confirmar Inscrição"
            color="primary"
            unelevated
            icon="check"
            class="q-px-xl text-bold no-caps shadow-md"
            :loading="registering"
            :disable="!playerStore.currentPlayer?.name"
            @click="onSubmitRegistration"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { usePlayerStore } from 'src/stores/player';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const leagueStore = useLeagueStore();
const playerStore = usePlayerStore();

const leagueId = route.params.leagueId;
const showRegistrationDialog = ref(false);
const selectedStage = ref(null);
const registering = ref(false);

const statusConfig = {
  pending: { label: 'Aguardando', color: 'amber-2', textColor: 'amber-9', icon: 'schedule' },
  confirmed: { label: 'Confirmado', color: 'green-2', textColor: 'green-9', icon: 'check_circle' },
  waitlist: { label: 'Lista de Espera', color: 'blue-2', textColor: 'blue-9', icon: 'hourglass_top' },
  cancelled: { label: 'Cancelado', color: 'red-2', textColor: 'red-9', icon: 'cancel' },
};

const league = computed(() => leagueStore.currentPublicLeague);

const allStagesSorted = computed(() => {
  if (!league.value?.stages?.length) return [];
  return [...league.value.stages].sort(
    (a, b) => new Date(a.data_etapa) - new Date(b.data_etapa),
  );
});

const nextStage = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allStagesSorted.value.find((s) => new Date(s.data_etapa) >= today) || null;
});

const otherFutureStages = computed(() => {
  if (!nextStage.value) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allStagesSorted.value.filter(
    (s) => new Date(s.data_etapa) >= today && s.id !== nextStage.value.id,
  );
});

const pastStages = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allStagesSorted.value
    .filter((s) => new Date(s.data_etapa) < today)
    .reverse();
});

onMounted(async () => {
  await Promise.all([
    leagueStore.fetchPublicLeague(leagueId),
    playerStore.currentPlayer ? Promise.resolve() : playerStore.fetchProfile(),
  ]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureStages = (leagueStore.currentPublicLeague?.stages || []).filter(
    (s) => new Date(s.data_etapa) >= today,
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

function openRegistrationDialog(stage) {
  selectedStage.value = stage;
  showRegistrationDialog.value = true;
}

async function onSubmitRegistration() {
  registering.value = true;
  try {
    await leagueStore.registerForStage(leagueId, selectedStage.value.id);
    $q.notify({
      type: 'positive',
      message: 'Inscrição realizada com sucesso! Aguarde a confirmação.',
      position: 'top',
      icon: 'check_circle',
      timeout: 4000,
    });
    showRegistrationDialog.value = false;
    await leagueStore.fetchPublicStageRegistrations(leagueId, selectedStage.value.id);
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao realizar inscrição. Tente novamente.',
      position: 'top',
    });
  } finally {
    registering.value = false;
  }
}

const nivelGradients = {
  Iniciante: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
  Intermediário: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
  Avançado: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)',
  Pro: 'linear-gradient(135deg, #b71c1c 0%, #7f0000 100%)',
  A: 'linear-gradient(135deg, #283593 0%, #1a237e 100%)',
  B: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
  C: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
  D: 'linear-gradient(135deg, #546e7a 0%, #37474f 100%)',
};

function getHeroStyle(nivel) {
  const gradient = nivelGradients[nivel] || 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)';
  return { background: gradient };
}

function formatDay(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit' });
}

function formatMonth(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}

function formatYear(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getDayOfWeek(dateStr) {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[new Date(dateStr).getDay()];
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje!';
  if (diff === 1) return 'Amanhã';
  if (diff < 0) return `Encerrada`;
  return `Em ${diff} dias`;
}

function formatCurrency(value) {
  if (value == null) return '—';
  if (value === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<style scoped lang="scss">
.league-hero {
  min-height: 180px;
}

.leading-tight {
  line-height: 1.2;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-4xl {
  font-size: 2.5rem;
}

.text-base {
  font-size: 0.9375rem;
}

.leading-none {
  line-height: 1;
}

.tracking-widest {
  letter-spacing: 0.08em;
}

.next-stage-card {
  border: 2px solid var(--q-primary) !important;
}

.next-stage-date-col {
  min-width: 110px;
  text-align: center;
}

.past-stage-card {
  border: 1px solid var(--surface-100);
  background-color: var(--surface-50);
  border-radius: var(--radius-lg);
  opacity: 0.7;
}

.confirm-block {
  background-color: var(--surface-50);
  border: 1px solid var(--surface-100);
}

.radius-lg {
  border-radius: var(--radius-lg);
}

.block {
  display: block;
}
</style>
