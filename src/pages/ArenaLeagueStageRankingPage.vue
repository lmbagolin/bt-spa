<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else>
      <PageHeader
        :title="`${$t('stage_ranking.title_prefix')} — ${stageName}`"
        :subtitle="`${leagueStore.currentLeague?.nome ?? ''} · ${$t('stage_ranking.subtitle_suffix')}`"
        :breadcrumbs="[
          { label: leagueStore.currentLeague?.nome || 'Liga', action: () => $router.back() },
          { label: stageName, action: goToStage },
          { label: $t('stage_ranking.breadcrumb') },
        ]"
        :back="goToStage"
      >
        <q-chip color="positive" text-color="white" icon="check_circle" class="text-bold">
          {{ $t('stage_ranking.chip_closed') }}
        </q-chip>
      </PageHeader>

      <!-- Podium — ordered: 2nd | 1st | 3rd -->
      <div v-if="podiumPairs.length" class="podium-row q-mb-xl">
        <template
          v-for="pair in [podiumPairs[1], podiumPairs[0], podiumPairs[2]]"
          :key="pair?.position"
        >
          <div
            v-if="pair"
            class="podium-card"
            :class="{
              'podium-1': pair.position === 1,
              'podium-2': pair.position === 2,
              'podium-3': pair.position === 3,
            }"
          >
            <q-icon
              v-if="pair.position === 1"
              name="emoji_events"
              color="orange"
              size="28px"
              class="q-mb-xs"
            />
            <div
              class="podium-medal"
              :class="{
                'medal-gold':   pair.position === 1,
                'medal-silver': pair.position === 2,
                'medal-bronze': pair.position === 3,
              }"
            >
              {{ pair.position }}°
            </div>

            <!-- Both players of the pair -->
            <div class="podium-avatars">
              <div
                v-for="p in pair.players"
                :key="p.registration_id"
                class="player-mini-av"
                :class="{ 'player-mini-av--lg': pair.position === 1 }"
                :style="{ background: p.player?.color || '#64748b' }"
                :title="p.player?.name"
              >
                {{ getInitial(p.player?.name) }}
              </div>
            </div>

            <div class="podium-names">
              <div
                v-for="p in pair.players"
                :key="p.registration_id"
                class="podium-name"
                :class="{ 'podium-name--bold': pair.position === 1 }"
              >
                {{ p.player?.name || '—' }}
              </div>
            </div>

            <div
              class="podium-pts"
              :class="{ 'podium-pts--gold': pair.position === 1 }"
            >
              {{ pair.points }} pts
            </div>
          </div>
        </template>
      </div>

      <!-- Full Ranking Table -->
      <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
        {{ $t('stage_ranking.table_title') }}
      </div>
      <q-card class="border-surface-100 shadow-card overflow-hidden">
        <!-- Header -->
        <div class="ranking-header">
          <span class="rh rh-pos">{{ $t('stage_ranking.col_pos') }}</span>
          <span class="rh rh-left">{{ $t('stage_ranking.col_player') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_pts') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_wins') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_matches') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_sg') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_gp') }}</span>
          <span class="rh">{{ $t('stage_ranking.col_gc') }}</span>
        </div>

        <div
          v-for="entry in leagueStore.stageRanking"
          :key="entry.id"
          class="ranking-row"
          :class="{
            'ranking-row--gold': entry.position === 1,
            'ranking-row--silver': entry.position === 2,
            'ranking-row--bronze': entry.position === 3,
          }"
        >
          <!-- Position -->
          <div class="rr-pos">
            <span class="pos-badge" :class="posBadgeClass(entry.position)">
              {{ entry.position }}°
            </span>
          </div>

          <!-- Player -->
          <div class="rr-player">
            <div class="player-mini-av" :style="{ background: entry.player?.color || '#64748b' }">
              {{ getInitial(entry.player?.name) }}
            </div>
            <span class="rr-name">{{ entry.player?.name || '—' }}</span>
          </div>

          <!-- Stats -->
          <span class="rr-cell rr-cell--pts">{{ entry.points }}</span>
          <span class="rr-cell">{{ entry.wins }}</span>
          <span class="rr-cell">{{ entry.matches_played }}</span>
          <span class="rr-cell" :class="entry.saldo_games > 0 ? 'rr-pos-val' : entry.saldo_games < 0 ? 'rr-neg-val' : ''">
            {{ entry.saldo_games > 0 ? '+' : '' }}{{ entry.saldo_games }}
          </span>
          <span class="rr-cell">{{ entry.games_pro }}</span>
          <span class="rr-cell">{{ entry.games_against }}</span>
        </div>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { tipoLabel } from 'src/composables/useStageTypes';

const route = useRoute();
const router = useRouter();
const leagueStore = useLeagueStore();

const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const stageId = route.params.stageId;

const loading = ref(false);

const stage = computed(
  () => leagueStore.stages.find((s) => String(s.id) === String(stageId)) || null,
);
const stageName = computed(() => {
  if (!stage.value) return 'Etapa';
  const d = stage.value.data_etapa;
  const dt = new Date(d.replace(' ', 'T'));
  const timePart = d.split(' ')[1];
  const dateStr = dt.toLocaleDateString('pt-BR');
  return `${tipoLabel(stage.value.tipo)} — ${timePart && timePart !== '00:00' ? `${dateStr} ${timePart}` : dateStr}`;
});

// Group ranking entries by position to form pairs for the podium
const podiumPairs = computed(() => {
  const byPos = {};
  for (const entry of leagueStore.stageRanking) {
    if (!byPos[entry.position]) byPos[entry.position] = [];
    byPos[entry.position].push(entry);
  }
  return [1, 2, 3]
    .map((pos) => ({ position: pos, players: byPos[pos] ?? [], points: byPos[pos]?.[0]?.points ?? 0 }))
    .filter((p) => p.players.length > 0);
});

onMounted(async () => {
  loading.value = true;
  try {
    await leagueStore.fetchLeague(arenaId, leagueId);
    await leagueStore.fetchStageRanking(arenaId, leagueId, stageId);
  } finally {
    loading.value = false;
  }
});

function getInitial(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return (parts[parts.length - 1]?.charAt(0) || name.charAt(0)).toUpperCase();
}

function posBadgeClass(pos) {
  if (pos === 1) return 'pos-gold';
  if (pos === 2) return 'pos-silver';
  if (pos === 3) return 'pos-bronze';
  return 'pos-default';
}

function goToStage() {
  router.push({ name: 'stage-detail', params: { id: arenaId, leagueId, stageId } });
}
</script>

<style scoped>
.tracking-widest { letter-spacing: 0.08em; }
.text-2xl { font-size: 1.5rem; }

/* ── Podium ── */
.podium-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
}

.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px 20px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--surface-100);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  min-width: 150px;
  max-width: 200px;
  flex: 1;
}

.podium-avatars {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 8px;
}

.podium-names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.podium-1 {
  border-color: #f37021;
  box-shadow: 0 0 24px rgba(243,112,33,0.15);
  padding-top: 24px;
}

.podium-medal {
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 99px;
  padding: 2px 10px;
  margin-bottom: 10px;
}
.medal-gold   { background: rgba(243,112,33,0.12); color: #f37021; }
.medal-silver { background: rgba(100,116,139,0.12); color: #64748b; }
.medal-bronze { background: rgba(180,120,60,0.12); color: #b4783c; }

.podium-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--surface-700);
  text-align: center;
  margin-bottom: 4px;
}
.podium-name--bold { font-weight: 800; color: var(--surface-900); }

.podium-pts {
  font-size: 0.72rem;
  color: var(--surface-400);
  font-weight: 600;
}
.podium-pts--gold { color: #f37021; font-weight: 800; }

.player-mini-av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.player-mini-av--lg {
  width: 38px;
  height: 38px;
  font-size: 13px;
}

/* ── Ranking table ── */
.ranking-header,
.ranking-row {
  display: grid;
  grid-template-columns: 52px 1fr 56px 40px 40px 48px 40px 40px;
  align-items: center;
  padding: 7px 16px;
  gap: 4px;
}

.ranking-header {
  background: #1b2e6e;
}

.ranking-row {
  border-bottom: 1px solid var(--surface-100);
  transition: background 0.12s;
}
.ranking-row:last-child { border-bottom: none; }
.ranking-row:hover { background: var(--surface-50); }

.ranking-row--gold   { background: rgba(243,112,33,0.04); }
.ranking-row--silver { background: rgba(100,116,139,0.04); }
.ranking-row--bronze { background: rgba(180,120,60,0.04); }

.rh {
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  text-align: center;
}
.rh-pos { text-align: center; }
.rh-left { text-align: left; }

.rr-pos {
  display: flex;
  justify-content: center;
}

.pos-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}
.pos-gold    { background: rgba(243,112,33,0.12); color: #f37021; }
.pos-silver  { background: rgba(100,116,139,0.12); color: #64748b; }
.pos-bronze  { background: rgba(180,120,60,0.12); color: #b4783c; }
.pos-default { background: var(--surface-100); color: var(--surface-500); }

.rr-player {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.rr-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--surface-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rr-cell {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--surface-700);
  text-align: center;
}
.rr-cell--pts {
  color: #1b2e6e;
  font-size: 0.8rem;
  font-weight: 800;
}
.rr-pos-val { color: var(--q-positive); }
.rr-neg-val { color: var(--q-negative); }
</style>
