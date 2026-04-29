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
          <div class="col-12 col-sm-2">
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
            <q-select
              v-model="filters.gender"
              :options="generoOptions"
              label="Gênero"
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
        <PlayerLeagueCard
          :league="item.league"
          :stage="item.stage"
          :is-next-of-league="item.isNextOfLeague"
          @click="goToLeague(item.league.id)"
          @register="goToLeague(item.league.id)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import PlayerLeagueCard from 'src/components/others/PlayerLeagueCard.vue';

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

const generoOptions = [
  { label: 'Masculino', value: 'male'   },
  { label: 'Feminino',  value: 'female' },
  { label: 'Misto',     value: 'mixed'  },
];

const filters = reactive({
  search: '',
  nivel: null,
  gender: null,
});

const upcomingStages = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = [];

  for (const league of leagueStore.publicLeagues) {
    if (!league.stages?.length) continue;
    const futureStages = league.stages
      .filter((s) => new Date(s.data_etapa.replace(' ', 'T')) >= today)
      .sort((a, b) => new Date(a.data_etapa.replace(' ', 'T')) - new Date(b.data_etapa.replace(' ', 'T')));

    futureStages.forEach((stage, idx) => {
      items.push({ league, stage, isNextOfLeague: idx === 0 });
    });
  }

  return items.sort(
    (a, b) =>
      new Date(a.stage.data_etapa.replace(' ', 'T')) -
      new Date(b.stage.data_etapa.replace(' ', 'T')),
  );
});

onMounted(() => {
  loadLeagues();
});

async function loadLeagues() {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.nivel)  params.nivel  = filters.nivel;
  if (filters.gender) params.gender = filters.gender;
  await leagueStore.fetchPublicLeagues(params);
}

function goToLeague(leagueId) {
  router.push({ name: 'player-league-detail', params: { leagueId } });
}
</script>

