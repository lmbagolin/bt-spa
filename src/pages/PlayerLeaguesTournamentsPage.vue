<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h1 class="text-2xl text-bold text-surface-900 q-my-none">Ligas & Torneios</h1>
        <p class="text-sm text-surface-500 q-mt-xs q-mb-none font-medium">
          Próximas etapas abertas para inscrição
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-lg border-surface-100 shadow-card">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-5">
            <q-input
              v-model="filters.search"
              placeholder="Buscar liga ou arena..."
              outlined
              dense
              bg-color="white"
              @keyup.enter="loadLeagues"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="surface-400" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="filters.search"
                  name="close"
                  class="cursor-pointer"
                  color="surface-400"
                  @click="
                    filters.search = '';
                    loadLeagues();
                  "
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filters.nivel"
              :options="nivelOptions"
              label="Nível"
              outlined
              dense
              clearable
              emit-value
              map-options
              bg-color="white"
              @update:model-value="loadLeagues"
            />
          </div>
          <div class="col-12 col-sm-2">
            <q-btn
              label="Buscar"
              color="primary"
              unelevated
              class="full-width text-bold no-caps"
              :loading="leagueStore.loadingPublic"
              @click="loadLeagues"
            />
          </div>
          <div class="col-12 col-sm-2 text-right">
            <span class="text-sm text-surface-400">
              {{ upcomingStages.length }} etapa(s) encontrada(s)
            </span>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="leagueStore.loadingPublic" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <!-- Sem resultados -->
    <div
      v-else-if="upcomingStages.length === 0"
      class="row justify-center q-pa-xl text-center"
    >
      <div class="col-12">
        <q-icon name="event_busy" size="72px" color="surface-200" class="q-mb-md" />
        <div class="text-lg text-bold text-surface-400 q-mb-sm">Nenhuma etapa encontrada</div>
        <div class="text-sm text-surface-400">Tente ajustar os filtros ou volte em breve.</div>
      </div>
    </div>

    <!-- Grid de Cards de Etapas -->
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="item in upcomingStages"
        :key="`${item.league.id}-${item.stage.id}`"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card
          class="stage-card border-surface-100 shadow-card overflow-hidden full-height cursor-pointer"
          :class="{ 'stage-card--featured': item.isNextOfLeague }"
          @click="goToLeague(item.league.id)"
        >
          <!-- Topo colorido com data -->
          <div class="stage-card-header q-pa-lg" :style="getHeaderStyle(item.league.nivel)">
            <div class="row items-start justify-between no-wrap">
              <div>
                <div v-if="item.isNextOfLeague" class="q-mb-sm">
                  <q-chip color="white" text-color="primary" dense class="text-bold" style="font-size: 10px;">
                    Próxima Etapa
                  </q-chip>
                </div>
                <div class="text-3xl text-bold text-white leading-none">
                  {{ formatDay(item.stage.data_etapa) }}
                </div>
                <div class="text-sm text-white q-mt-xs" style="opacity: 0.85;">
                  {{ formatMonthYear(item.stage.data_etapa) }}
                </div>
                <div class="text-xs q-mt-xs" style="color: rgba(255,255,255,0.65);">
                  {{ getDayOfWeek(item.stage.data_etapa) }} · {{ getDaysUntil(item.stage.data_etapa) }}
                </div>
              </div>
              <div class="column items-end q-gutter-xs">
                <q-chip
                  color="white"
                  text-color="primary"
                  dense
                  class="text-bold text-xs"
                >
                  {{ item.league.nivel }}
                </q-chip>
                <q-chip
                  color="rgba(255,255,255,0.15)"
                  text-color="white"
                  dense
                  class="text-xs"
                >
                  {{ item.stage.tipo }}
                </q-chip>
              </div>
            </div>
          </div>

          <!-- Corpo do card -->
          <q-card-section class="q-pa-md">
            <!-- Liga e Arena -->
            <div class="text-base text-bold text-surface-900 q-mb-xs ellipsis">
              {{ item.league.nome }}
            </div>
            <div v-if="item.league.arena" class="row items-center q-gutter-xs q-mb-md">
              <q-icon name="location_on" size="14px" color="surface-400" />
              <span class="text-xs text-surface-500">{{ item.league.arena.name }}</span>
              <span v-if="item.league.arena.city" class="text-xs text-surface-400">
                · {{ item.league.arena.city }}
              </span>
            </div>

            <q-separator color="surface-100" class="q-mb-md" />

            <!-- Detalhes da etapa -->
            <div class="row items-center justify-between">
              <div class="column items-start">
                <div class="text-xs text-surface-400 q-mb-xs">Inscrição</div>
                <div class="text-base text-bold text-positive">
                  {{ formatCurrency(item.stage.valor_inscricao) }}
                </div>
              </div>
              <div class="column items-center">
                <div class="text-xs text-surface-400 q-mb-xs">Jogadores/Grupo</div>
                <div class="text-base text-bold text-surface-700">
                  {{ item.stage.jogadores_por_grupo }}
                </div>
              </div>
              <div v-if="item.league.numero_etapas" class="column items-end">
                <div class="text-xs text-surface-400 q-mb-xs">Etapas</div>
                <div class="text-base text-bold text-surface-700">
                  {{ item.league.numero_etapas }}
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Rodapé -->
          <q-card-actions class="q-pa-md q-pt-none">
            <q-btn
              label="Ver Liga"
              color="primary"
              unelevated
              no-caps
              class="full-width text-bold"
              @click.stop="goToLeague(item.league.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';

const leagueStore = useLeagueStore();
const router = useRouter();

const nivelOptions = [
  { label: 'Iniciante', value: 'Iniciante' },
  { label: 'Intermediário', value: 'Intermediário' },
  { label: 'Avançado', value: 'Avançado' },
  { label: 'Pro', value: 'Pro' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

const filters = reactive({
  search: '',
  nivel: null,
});

const upcomingStages = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = [];

  for (const league of leagueStore.publicLeagues) {
    if (!league.stages?.length) continue;
    const futureStages = league.stages
      .filter((s) => new Date(s.data_etapa) >= today)
      .sort((a, b) => new Date(a.data_etapa) - new Date(b.data_etapa));

    futureStages.forEach((stage, idx) => {
      items.push({ league, stage, isNextOfLeague: idx === 0 });
    });
  }

  return items.sort((a, b) => new Date(a.stage.data_etapa) - new Date(b.stage.data_etapa));
});

onMounted(() => {
  loadLeagues();
});

async function loadLeagues() {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.nivel) params.nivel = filters.nivel;
  await leagueStore.fetchPublicLeagues(params);
}

function goToLeague(leagueId) {
  router.push({ name: 'player-league-detail', params: { leagueId } });
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

function getHeaderStyle(nivel) {
  const gradient = nivelGradients[nivel] || 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)';
  return { background: gradient };
}

function formatDay(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit' });
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function getDayOfWeek(dateStr) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
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
  return `Em ${diff} dias`;
}

function formatCurrency(value) {
  if (value == null) return '—';
  if (value === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<style scoped lang="scss">
.stage-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: var(--radius-lg) !important;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  }

  &--featured {
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.18) !important;
  }
}

.stage-card-header {
  min-height: 140px;
}

.leading-none {
  line-height: 1;
}

.text-3xl {
  font-size: 2.25rem;
}

.text-base {
  font-size: 0.9375rem;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
