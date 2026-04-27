<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else>
      <PageHeader
        :title="`Ranking Geral — ${leagueStore.currentPublicLeague?.nome ?? ''}`"
        :subtitle="`${stages.length} etapa${stages.length !== 1 ? 's' : ''} encerrada${stages.length !== 1 ? 's' : ''} · ${rankings.length} jogadores`"
        :back="() => router.push({ name: 'player-league-detail', params: { leagueId } })"
      />

      <div v-if="!stages.length" class="text-center q-pa-xl">
        <q-icon name="bar_chart" size="72px" color="surface-200" class="q-mb-md" />
        <div class="text-lg text-bold text-surface-400 q-mb-sm">Nenhuma etapa encerrada ainda</div>
        <div class="text-sm text-surface-300">O ranking será gerado ao encerrar cada etapa.</div>
      </div>

      <template v-else>
        <!-- Pódio -->
        <div v-if="podiumTop3.length" class="podium-row q-mb-xl">
          <template v-for="entry in [podiumTop3[1], podiumTop3[0], podiumTop3[2]]" :key="entry?.player?.id">
            <div
              v-if="entry"
              class="podium-card"
              :class="{ 'podium-1': entry.position === 1, 'podium-2': entry.position === 2, 'podium-3': entry.position === 3 }"
            >
              <q-icon v-if="entry.position === 1" name="emoji_events" color="orange" size="28px" class="q-mb-xs" />
              <div class="podium-medal" :class="{ 'medal-gold': entry.position === 1, 'medal-silver': entry.position === 2, 'medal-bronze': entry.position === 3 }">
                {{ entry.position }}°
              </div>
              <div class="player-mini-av q-mb-sm" :class="{ 'player-mini-av--lg': entry.position === 1 }" :style="{ background: entry.player?.color || '#64748b' }">
                {{ getInitial(entry.player?.name) }}
              </div>
              <div class="podium-name" :class="{ 'podium-name--bold': entry.position === 1 }">{{ entry.player?.name || '—' }}</div>
              <div class="podium-pts" :class="{ 'podium-pts--gold': entry.position === 1 }">{{ entry.total_points }} pts</div>
            </div>
          </template>
        </div>

        <!-- Tabela de ranking -->
        <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">Classificação Geral</div>
        <q-card class="border-surface-100 shadow-card overflow-hidden">
          <div class="ranking-header" :style="gridStyle">
            <span class="rh rh-center">Pos</span>
            <span class="rh rh-left">Jogador</span>
            <span class="rh rh-center">Total</span>
            <span class="rh rh-center">V</span>
            <span class="rh rh-center">SG</span>
            <span class="rh rh-center">GP</span>
            <span class="rh rh-center">GC</span>
            <span v-for="s in stages" :key="s.id" class="rh rh-center" :title="`${tipoLabel(s.tipo)} — ${formatDate(s.data_etapa)}`">
              {{ formatStageLabel(s) }}
            </span>
          </div>

          <div
            v-for="entry in rankings"
            :key="entry.player?.id"
            class="ranking-row"
            :class="{ 'ranking-row--gold': entry.position === 1, 'ranking-row--silver': entry.position === 2, 'ranking-row--bronze': entry.position === 3 }"
            :style="gridStyle"
          >
            <div class="rr-center">
              <span class="pos-badge" :class="posBadgeClass(entry.position)">{{ entry.position }}°</span>
            </div>
            <div class="rr-player">
              <div class="player-mini-av" :style="{ background: entry.player?.color || '#64748b' }">{{ getInitial(entry.player?.name) }}</div>
              <span class="rr-name">{{ entry.player?.name || '—' }}</span>
            </div>
            <span class="rr-center rr-cell rr-cell--total">{{ entry.total_points }}</span>
            <span class="rr-center rr-cell">{{ entry.total_wins }}</span>
            <span class="rr-center rr-cell" :class="entry.total_gp - entry.total_gc > 0 ? 'rr-pos-val' : entry.total_gp - entry.total_gc < 0 ? 'rr-neg-val' : ''">
              {{ entry.total_gp - entry.total_gc > 0 ? '+' : '' }}{{ entry.total_gp - entry.total_gc }}
            </span>
            <span class="rr-center rr-cell">{{ entry.total_gp }}</span>
            <span class="rr-center rr-cell">{{ entry.total_gc }}</span>
            <span
              v-for="s in stages"
              :key="s.id"
              class="rr-center rr-cell"
              :class="entry.stage_scores[s.id] !== undefined ? 'rr-cell--scored' : 'rr-cell--empty'"
            >
              {{ entry.stage_scores[s.id] !== undefined ? entry.stage_scores[s.id] : '—' }}
            </span>
          </div>
        </q-card>
      </template>
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
const leagueId = route.params.leagueId;
const loading = ref(false);

const stages   = computed(() => leagueStore.leagueRanking.stages   ?? []);
const rankings = computed(() => leagueStore.leagueRanking.rankings ?? []);

const gridStyle = computed(() => {
  const stageCols = stages.value.map(() => '60px').join(' ');
  return { gridTemplateColumns: `52px 1fr 64px 40px 52px 40px 40px ${stageCols}` };
});

const podiumTop3 = computed(() => rankings.value.filter((e) => e.position <= 3).slice(0, 3));

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      leagueStore.fetchPublicLeague(leagueId),
      leagueStore.fetchPublicLeagueRanking(leagueId),
    ]);
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

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d.replace(' ', 'T'));
  const dateStr = dt.toLocaleDateString('pt-BR');
  const timePart = d.split(' ')[1];
  return timePart && timePart !== '00:00' ? `${dateStr} ${timePart}` : dateStr;
}

function formatStageLabel(s) {
  if (!s.data_etapa) return '';
  return new Date(s.data_etapa.replace(' ', 'T')).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
</script>

<style scoped>
.tracking-widest { letter-spacing: 0.08em; }
.podium-row { display: flex; align-items: flex-end; justify-content: center; gap: 12px; }
.podium-card { display: flex; flex-direction: column; align-items: center; padding: 16px 20px 20px; border-radius: 14px; background: #fff; border: 1px solid var(--surface-100); box-shadow: 0 2px 12px rgba(0,0,0,.06); min-width: 140px; max-width: 180px; flex: 1; }
.podium-1 { border-color: #f37021; box-shadow: 0 0 24px rgba(243,112,33,.15); padding-top: 24px; }
.podium-medal { font-size: .75rem; font-weight: 800; border-radius: 99px; padding: 2px 10px; margin-bottom: 10px; }
.medal-gold   { background: rgba(243,112,33,.12); color: #f37021; }
.medal-silver { background: rgba(100,116,139,.12); color: #64748b; }
.medal-bronze { background: rgba(180,120,60,.12); color: #b4783c; }
.player-mini-av { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.player-mini-av--lg { width: 42px; height: 42px; font-size: 14px; }
.podium-name { font-size: .78rem; font-weight: 600; color: var(--surface-700); text-align: center; margin-top: 6px; margin-bottom: 4px; }
.podium-name--bold { font-weight: 800; color: var(--surface-900); }
.podium-pts { font-size: .72rem; color: var(--surface-400); font-weight: 600; }
.podium-pts--gold { color: #f37021; font-weight: 800; }
.ranking-header, .ranking-row { display: grid; align-items: center; padding: 7px 16px; gap: 4px; }
.ranking-header { background: #1b2e6e; }
.ranking-row { border-bottom: 1px solid var(--surface-100); transition: background .12s; }
.ranking-row:last-child { border-bottom: none; }
.ranking-row:hover { background: var(--surface-50); }
.ranking-row--gold   { background: rgba(243,112,33,.04); }
.ranking-row--silver { background: rgba(100,116,139,.04); }
.ranking-row--bronze { background: rgba(180,120,60,.04); }
.rh { font-size: .58rem; font-weight: 700; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: .07em; }
.rh-center { text-align: center; } .rh-left { text-align: left; }
.rr-center { display: flex; justify-content: center; align-items: center; }
.pos-badge { font-size: .65rem; font-weight: 800; padding: 2px 7px; border-radius: 99px; }
.pos-gold    { background: rgba(243,112,33,.12); color: #f37021; }
.pos-silver  { background: rgba(100,116,139,.12); color: #64748b; }
.pos-bronze  { background: rgba(180,120,60,.12); color: #b4783c; }
.pos-default { background: var(--surface-100); color: var(--surface-500); }
.rr-player { display: flex; align-items: center; gap: 6px; min-width: 0; }
.rr-name { font-size: .78rem; font-weight: 600; color: var(--surface-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rr-cell { font-size: .75rem; font-weight: 600; text-align: center; color: var(--surface-600); }
.rr-cell--total  { font-size: .82rem; font-weight: 800; color: #1b2e6e; }
.rr-cell--scored { color: var(--surface-700); }
.rr-cell--empty  { color: var(--surface-300); font-weight: 500; }
.rr-pos-val { color: var(--q-positive); }
.rr-neg-val { color: var(--q-negative); }
</style>
