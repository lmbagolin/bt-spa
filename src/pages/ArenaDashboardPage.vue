<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else>
      <PageHeader
        :title="$t('dashboard.title')"
        :subtitle="arenaStore.currentArena?.name"
      >
        <q-btn color="primary" unelevated icon="add" :label="$t('dashboard.new_league')" no-caps class="text-bold"
          @click="router.push(`/admin/arena/${arenaId}/leagues`)" />
      </PageHeader>

      <!-- Stats cards -->
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card border-surface-100 shadow-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="stat-label">{{ $t('dashboard.stat_total_leagues') }}</div>
                  <div class="stat-value text-primary">{{ dash.total_leagues ?? '—' }}</div>
                </div>
                <q-icon name="sports_soccer" size="36px" color="primary" style="opacity:.18" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card border-surface-100 shadow-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="stat-label">{{ $t('dashboard.stat_players') }}</div>
                  <div class="stat-value" style="color:#7c3a0f">{{ dash.total_players ?? '—' }}</div>
                </div>
                <q-icon name="people" size="36px" style="color:#7c3a0f;opacity:.18" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card border-surface-100 shadow-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="stat-label">{{ $t('dashboard.stat_active_leagues') }}</div>
                  <div class="stat-value text-positive">{{ dash.active_leagues ?? '—' }}</div>
                </div>
                <q-icon name="play_circle" size="36px" color="positive" style="opacity:.18" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card border-surface-100 shadow-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="stat-label">{{ $t('dashboard.stat_matches_played') }}</div>
                  <div class="stat-value text-orange-8">{{ dash.total_matches_played ?? '—' }}</div>
                </div>
                <q-icon name="sports_tennis" size="36px" color="orange" style="opacity:.18" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-xl">
        <!-- Leagues -->
        <div class="col-12 col-lg-8">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-xs text-bold text-surface-400 uppercase tracking-widest">{{ $t('dashboard.section_leagues') }}</div>
            <q-btn flat dense no-caps size="sm" :label="$t('common.view_all')" icon-right="arrow_forward"
              color="primary" class="text-bold" @click="router.push(`/admin/arena/${arenaId}/leagues`)" />
          </div>

          <div v-if="!dash.leagues?.length" class="text-center q-pa-xl">
            <q-icon name="sports_soccer" size="72px" color="surface-200" class="q-mb-md" />
            <div class="text-lg text-bold text-surface-400 q-mb-sm">{{ $t('dashboard.no_leagues') }}</div>
            <q-btn color="primary" unelevated no-caps :label="$t('dashboard.create_first_league')"
              @click="router.push(`/admin/arena/${arenaId}/leagues`)" />
          </div>

          <div v-else class="row q-col-gutter-lg">
            <div v-for="league in dash.leagues" :key="league.id" class="col-12 col-md-6">
              <LeagueCard
                :league="league"
                @click="router.push(`/admin/arena/${arenaId}/leagues/${league.id}`)"
                @stages="router.push(`/admin/arena/${arenaId}/leagues/${league.id}`)"
                @ranking="router.push({ name: 'league-ranking', params: { id: arenaId, leagueId: league.id } })"
                @active-stage="league.active_stage && router.push({ name: 'stage-detail', params: { id: arenaId, leagueId: league.id, stageId: league.active_stage.id } })"
              />
            </div>
          </div>
        </div>

        <!-- Players -->
        <div class="col-12 col-lg-4">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-xs text-bold text-surface-400 uppercase tracking-widest">{{ $t('dashboard.section_players') }}</div>
            <q-btn flat dense no-caps size="sm" :label="$t('common.manage')" icon-right="arrow_forward"
              color="primary" class="text-bold" @click="router.push(`/admin/arena/${arenaId}/players`)" />
          </div>

          <q-card class="border-surface-100 shadow-card">
            <!-- Search -->
            <q-card-section class="q-pa-md q-pb-sm">
              <q-input
                v-model="playerSearch"
                :placeholder="$t('dashboard.search_player')"
                dense
                outlined
                bg-color="white"
              >
                <template #prepend>
                  <q-icon name="search" color="surface-400" size="18px" />
                </template>
              </q-input>
            </q-card-section>

            <q-separator color="surface-100" />

            <div v-if="playerStore.loading" class="text-center q-pa-lg">
              <q-spinner-dots color="primary" size="32px" />
            </div>

            <div v-else-if="!filteredPlayers.length" class="text-center q-pa-xl">
              <q-icon name="person_off" size="40px" color="surface-200" class="q-mb-sm" />
              <div class="text-xs text-surface-400">{{ $t('dashboard.no_players') }}</div>
            </div>

            <q-list v-else separator>
              <q-item
                v-for="player in filteredPlayers"
                :key="player.id"
                class="q-py-sm player-item"
                clickable
                @click="router.push(`/admin/arena/${arenaId}/players`)"
              >
                <q-item-section avatar>
                  <q-avatar size="36px" color="surface-100" text-color="surface-500">
                    <img v-if="player.image_url" :src="player.image_url" />
                    <q-icon v-else name="person" size="20px" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="text-sm text-bold text-surface-900">
                    {{ player.name }}
                    <span v-if="player.nickname" class="text-surface-400 text-xs text-normal">
                      · {{ player.nickname }}
                    </span>
                  </div>
                  <div class="row items-center q-gutter-xs q-mt-xs">
                    <q-chip
                      v-if="player.level"
                      dense
                      color="surface-100"
                      text-color="surface-600"
                      style="height:16px;font-size:0.6rem"
                      class="text-bold q-ma-none"
                    >{{ player.level }}</q-chip>
                    <q-chip
                      v-if="player.gender"
                      dense
                      :color="player.gender === 'M' ? 'blue-1' : player.gender === 'F' ? 'pink-1' : 'purple-1'"
                      :text-color="player.gender === 'M' ? 'blue-9' : player.gender === 'F' ? 'pink-9' : 'purple-9'"
                      style="height:16px;font-size:0.6rem"
                      class="text-bold q-ma-none"
                    >{{ player.gender === 'M' ? $t('common.gender_masc') : player.gender === 'F' ? $t('common.gender_fem') : player.gender }}</q-chip>
                    <span v-if="player.city" class="text-xs text-surface-400">{{ player.city }}</span>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <div class="row q-gutter-xs">
                    <q-btn
                      v-if="player.whatsapp"
                      flat round dense size="xs"
                      icon="chat"
                      color="positive"
                      :href="`https://wa.me/${player.whatsapp.replace(/\D/g,'')}`"
                      target="_blank"
                      @click.stop
                    >
                      <q-tooltip>WhatsApp</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="player.instagram"
                      flat round dense size="xs"
                      icon="photo_camera"
                      color="purple-6"
                      :href="`https://instagram.com/${player.instagram.replace('@','')}`"
                      target="_blank"
                      @click.stop
                    >
                      <q-tooltip>Instagram</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator v-if="filteredPlayers.length" color="surface-100" />
            <q-card-section v-if="filteredPlayers.length" class="q-pa-sm text-center">
              <span class="text-xs text-surface-400">
                {{ $t('dashboard.players_count', { filtered: filteredPlayers.length, total: playerStore.players.length }) }}
              </span>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import LeagueCard from 'src/components/others/LeagueCard.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArenaStore } from 'src/stores/arena';
import { usePlayerStore } from 'src/stores/player';

const arenaStore  = useArenaStore();
const playerStore = usePlayerStore();
const route   = useRoute();
const router  = useRouter();
const arenaId = route.params.id;
const loading = ref(false);
const playerSearch = ref('');

const dash = computed(() => arenaStore.dashboard ?? {});

const filteredPlayers = computed(() => {
  const q = playerSearch.value.trim().toLowerCase();
  if (!q) return playerStore.players;
  return playerStore.players.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.nickname?.toLowerCase().includes(q),
  );
});


onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      arenaStore.fetchArenaDashboard(arenaId),
      playerStore.fetchPlayers(arenaId),
    ]);
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
.tracking-widest { letter-spacing: 0.08em; }
.text-2xl        { font-size: 1.5rem; }
.ellipsis        { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.radius-md       { border-radius: 8px; }

.stat-card {
  transition: box-shadow 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.10) !important;
}
.stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--surface-400);
  margin-bottom: 6px;
}
.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.league-card {
  transition: box-shadow 0.15s, transform 0.15s;
}
.league-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.10) !important;
  transform: translateY(-2px);
}

.active-stage-box {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
}
.player-item {
  transition: background 0.12s;
}
.player-item:hover {
  background: var(--surface-50);
}
</style>
