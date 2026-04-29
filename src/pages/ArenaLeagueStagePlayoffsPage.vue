<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else>
      <PageHeader
        :title="`${$t('stage_playoffs.title_prefix')} — ${stageName}`"
        :subtitle="`${leagueStore.currentLeague?.nome ?? ''} · ${leagueStore.stageFinalists.length} finalistas`"
        :breadcrumbs="[
          { label: leagueStore.currentLeague?.nome || 'Liga', action: () => $router.back() },
          { label: stageName, action: goToStage },
          { label: $t('stage_playoffs.breadcrumb') },
        ]"
        :back="goToStage"
      >
        <q-btn v-if="!hasPairs" color="primary" unelevated no-caps icon="shuffle"
          :label="isDupla ? $t('stage_playoffs.btn_seed_duplas') : $t('stage_playoffs.btn_draw_pairs')"
          class="text-bold" @click="openPairsDialog" />
        <template v-else>
          <q-btn outline color="surface-700" no-caps icon="refresh"
            :label="isDupla ? $t('stage_playoffs.btn_redo_seed_duplas') : $t('stage_playoffs.btn_redo_pairs')"
            class="text-bold" @click="openPairsDialog" />
          <q-btn v-if="!hasBracket" color="orange" unelevated no-caps icon="account_tree"
            :label="$t('stage_playoffs.btn_draw_bracket')" class="text-bold" @click="openBracketDialog" />
          <q-btn v-else outline color="orange" no-caps icon="refresh" :label="$t('stage_playoffs.btn_redo_bracket')"
            class="text-bold" @click="openBracketDialog" />
        </template>
      </PageHeader>

      <!-- Finalists Table -->
      <div class="q-mb-xl">
        <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
          {{ $t('stage_playoffs.finalists_title') }}
        </div>
        <q-card class="border-surface-100 shadow-card overflow-hidden">
          <div class="finalist-table-header">
            <span class="fth">{{ $t('stage_playoffs.col_group') }}</span>
            <span class="fth fth-left">{{ $t('stage_playoffs.col_player') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_pos') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_pts') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_sg') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_gp') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_gc') }}</span>
          </div>
          <div v-for="f in sortedFinalists" :key="f.registration_id" class="finalist-table-row">
            <div class="ft-center">
              <div class="finalist-group-badge" :style="{ background: groupColor(f.group_letter) }">
                {{ f.group_letter }}
              </div>
            </div>
            <div class="rr-name-cell">
              <div class="player-mini-av" :style="{ background: f.player?.color || '#64748b' }">
                {{ getInitial(f.player?.name || '') }}
              </div>
              <span class="rr-name">
                {{ f.player?.name || '—' }}
                <span v-if="f.player?.partner_name" class="rr-partner"> / {{ f.player.partner_name }}</span>
              </span>
            </div>
            <div class="ft-center">
              <span class="finalist-pos-chip" :class="f.group_position === 1 ? 'pos-gold' : 'pos-silver'">
                {{ f.group_position }}°
              </span>
            </div>
            <span class="ft-center finalist-pts">{{ f.pts }}</span>
            <span class="ft-center rr-cell" :class="f.saldo_games > 0 ? 'rr-pos-val' : f.saldo_games < 0 ? 'rr-neg-val' : ''">
              {{ f.saldo_games > 0 ? '+' : '' }}{{ f.saldo_games }}
            </span>
            <span class="ft-center rr-cell">{{ f.gp }}</span>
            <span class="ft-center rr-cell">{{ f.gc }}</span>
          </div>
        </q-card>
      </div>

      <!-- Pairs Section -->
      <div v-if="hasPairs" class="q-mb-xl">
        <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
          {{ $t('stage_playoffs.pairs_title', { count: leagueStore.playoffPairs.length }) }}
        </div>
        <q-card class="border-surface-100 shadow-card overflow-hidden">
          <div class="pair-table-header">
            <span class="fth">{{ $t('stage_playoffs.col_pair') }}</span>
            <span class="fth fth-left">{{ $t('stage_playoffs.col_pair_label') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_pts') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_sg') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_gp') }}</span>
            <span class="fth">{{ $t('stage_playoffs.col_gc') }}</span>
          </div>
          <div v-for="pair in leagueStore.playoffPairs" :key="pair.id" class="pair-table-row">
            <span class="ft-center text-sm text-bold text-surface-400">{{ pair.pair_rank }}</span>
            <div class="pair-players">
              <!-- Dupla fixa: exibe apenas a dupla do finalist1 (player + parceiro) -->
              <template v-if="isDupla">
                <div class="row items-center no-wrap q-gutter-xs">
                  <div class="player-mini-av" :style="{ background: pair.finalist1?.color || '#64748b' }">
                    {{ getInitial(pair.finalist1?.player?.name || '') }}
                  </div>
                  <div>
                    <div class="text-sm text-bold text-surface-900">{{ pair.finalist1?.player?.name || '—' }}</div>
                    <div v-if="pair.finalist1?.player?.partner_name" class="text-xs text-surface-400">
                      / {{ pair.finalist1.player.partner_name }}
                    </div>
                  </div>
                </div>
              </template>
              <!-- Simples: exibe os dois finalistas que formam o par -->
              <template v-else>
                <div class="row items-center no-wrap q-gutter-xs">
                  <div class="player-mini-av" :style="{ background: pair.finalist1?.color || '#64748b' }">
                    {{ getInitial(pair.finalist1?.player?.name || '') }}
                  </div>
                  <span class="text-sm text-bold text-surface-900 ellipsis">{{ pair.finalist1?.player?.name || '—' }}</span>
                </div>
                <div class="row items-center no-wrap q-gutter-xs q-mt-xs">
                  <div class="player-mini-av" :style="{ background: pair.finalist2?.color || '#64748b' }">
                    {{ getInitial(pair.finalist2?.player?.name || '') }}
                  </div>
                  <span class="text-sm text-bold text-surface-700 ellipsis">{{ pair.finalist2?.player?.name || '—' }}</span>
                </div>
              </template>
            </div>
            <span class="ft-center text-sm text-bold text-primary">{{ pair.pts_total }}</span>
            <span class="ft-center rr-cell" :class="pair.sg_total > 0 ? 'rr-pos-val' : pair.sg_total < 0 ? 'rr-neg-val' : ''">
              {{ pair.sg_total > 0 ? '+' : '' }}{{ pair.sg_total }}
            </span>
            <span class="ft-center rr-cell">{{ pair.gp_total }}</span>
            <span class="ft-center rr-cell">{{ pair.gc_total }}</span>
          </div>
        </q-card>
      </div>

      <!-- Bracket -->
      <div v-if="hasBracket">
        <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-md">
          {{ $t('stage_playoffs.bracket_title') }}
        </div>
        <div class="bracket-grid">
          <div
            v-for="round in bracketRounds"
            :key="round.name"
            class="bracket-round"
            :class="{
              'bracket-final-round': round.name === 'final',
              'bracket-terceiro-round': round.name === 'terceiro',
            }"
          >
            <div class="bracket-round-label">
              <q-icon v-if="round.name === 'final'" name="emoji_events" size="14px" class="q-mr-xs" />
              {{ round.label }}
            </div>
            <div class="bracket-matches">
              <q-card
                v-for="match in round.matches"
                :key="match.id"
                class="border-surface-100 shadow-card bracket-match-card overflow-hidden"
                :class="{ 'bracket-match-final': round.name === 'final' }"
              >
                <BtMatch
                  :players-p="pairToPlayers(match.pair1)"
                  :players-q="pairToPlayers(match.pair2)"
                  :score-p="match.score_p"
                  :score-q="match.score_q"
                  :is-bye="match.is_bye"
                  @score-input="onBtMatchScore(match, $event)"
                />
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Ranking -->
      <div v-if="allResultsDefined" class="row justify-center q-mt-xl">
        <q-card class="border-surface-100 shadow-card q-pa-xl text-center" style="max-width: 480px; width: 100%">
          <q-icon name="emoji_events" color="orange" size="40px" class="q-mb-sm" />
          <div class="text-lg text-bold text-surface-900 q-mb-xs">{{ $t('stage_playoffs.all_results_title') }}</div>
          <div class="text-sm text-surface-500 q-mb-lg">{{ $t('stage_playoffs.all_results_subtitle') }}</div>
          <q-btn
            color="orange"
            unelevated
            no-caps
            size="lg"
            icon="bar_chart"
            :label="$t('stage_playoffs.btn_generate_ranking')"
            class="text-bold q-px-xl"
            :loading="generatingRanking"
            @click="onGenerateRanking"
          />
        </q-card>
      </div>
    </template>
  </q-page>

  <!-- ── Draw Pairs Dialog ── -->
  <q-dialog v-model="pairsDialog" persistent backdrop-filter="blur(8px)">
    <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 480px; max-width: 95vw">
      <q-card-section class="row items-center q-pa-xl bg-surface-50">
        <q-avatar icon="shuffle" color="primary" text-color="white" class="shadow-md" />
        <div class="column q-ml-md">
          <div class="text-xl text-bold text-surface-900">
            {{ isDupla ? $t('stage_playoffs.dialog_seed_duplas_title') : $t('stage_playoffs.dialog_pairs_title') }}
          </div>
          <div class="text-xs text-surface-400">
            {{ isDupla
              ? $t('stage_playoffs.dialog_seed_duplas_subtitle', { duplas: leagueStore.stageFinalists.length })
              : $t('stage_playoffs.dialog_pairs_subtitle', { finalists: leagueStore.stageFinalists.length, pairs: leagueStore.stageFinalists.length / 2 })
            }}
          </div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
      </q-card-section>
      <q-separator color="surface-100" />
      <q-card-section class="q-pa-xl q-gutter-y-md">
        <div class="text-sm text-surface-700 q-mb-sm">{{ $t('stage_playoffs.pairs_method_label') }}</div>
        <div class="q-gutter-y-sm">
          <div
            v-for="m in pairMethods"
            :key="m.value"
            class="pair-method-card q-pa-md radius-md cursor-pointer"
            :class="{ 'method-selected': pairMethod === m.value }"
            @click="pairMethod = m.value"
          >
            <div class="row items-center q-gutter-sm">
              <q-icon :name="m.icon" size="20px" :color="pairMethod === m.value ? 'primary' : 'surface-400'" />
              <div>
                <div class="text-sm text-bold" :class="pairMethod === m.value ? 'text-primary' : 'text-surface-900'">{{ m.label }}</div>
                <div class="text-xs text-surface-400">{{ m.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
        <q-btn flat :label="$t('common.cancel')" v-close-popup color="surface-500" no-caps class="text-bold" />
        <q-btn :label="$t('stage_playoffs.btn_form_pairs')" color="primary" unelevated no-caps class="q-px-xl text-bold" :loading="savingPairs" @click="onDrawPairs" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ── Draw Bracket Dialog ── -->
  <q-dialog v-model="bracketDialog" persistent backdrop-filter="blur(8px)">
    <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 440px; max-width: 95vw">
      <q-card-section class="row items-center q-pa-xl bg-surface-50">
        <q-avatar icon="account_tree" color="orange" text-color="white" class="shadow-md" />
        <div class="column q-ml-md">
          <div class="text-xl text-bold text-surface-900">{{ $t('stage_playoffs.dialog_bracket_title') }}</div>
          <div class="text-xs text-surface-400">
            {{ $t('stage_playoffs.dialog_bracket_subtitle', { pairs: leagueStore.playoffPairs.length, rounds: bracketRoundNames.join(' → ') }) }}
          </div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
      </q-card-section>
      <q-separator color="surface-100" />
      <q-card-section class="q-pa-xl">
        <div class="text-sm text-surface-700 q-mb-lg">{{ $t('stage_playoffs.bracket_description') }}</div>
        <q-toggle v-model="hasThirdPlace" :label="$t('stage_playoffs.toggle_third_place')" color="primary" />
        <div class="text-xs text-surface-400 q-mt-xs q-ml-lg">{{ $t('stage_playoffs.third_place_hint') }}</div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
        <q-btn flat :label="$t('common.cancel')" v-close-popup color="surface-500" no-caps class="text-bold" />
        <q-btn :label="$t('stage_playoffs.btn_generate_bracket')" color="orange" unelevated no-caps class="q-px-xl text-bold" :loading="savingBracket" @click="onDrawBracket" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import BtMatch from 'src/components/others/BtMatch.vue';
import PageHeader from 'src/components/others/PageHeader.vue';
import { tipoLabel } from 'src/composables/useStageTypes';

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const leagueStore = useLeagueStore();
const { t } = useI18n();

const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const stageId = route.params.stageId;

const loading = ref(false);
const pairsDialog = ref(false);
const bracketDialog = ref(false);
const pairMethod = ref('order');
const hasThirdPlace = ref(false);
const savingPairs = ref(false);
const savingBracket = ref(false);
const generatingRanking = ref(false);

const GROUP_COLORS = ['#F37021', '#1B2E6E', '#3AAA35', '#FAB818'];
const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const pairMethods = computed(() => [
  { value: 'order', label: t('stage_playoffs.method_order_label'), icon: 'format_list_numbered', desc: t('stage_playoffs.method_order_desc') },
  { value: 'split', label: t('stage_playoffs.method_split_label'), icon: 'tune', desc: t('stage_playoffs.method_split_desc') },
  { value: 'random', label: t('stage_playoffs.method_random_label'), icon: 'casino', desc: t('stage_playoffs.method_random_desc') },
]);

const stage = computed(() => leagueStore.stages.find((s) => String(s.id) === String(stageId)) || null);
const isDupla = computed(() => stage.value?.tipo === 'dupla-fixa');
const stageName = computed(() => {
  if (!stage.value) return 'Etapa';
  const d = stage.value.data_etapa;
  const dt = new Date(d.replace(' ', 'T'));
  const timePart = d.split(' ')[1];
  const dateStr = dt.toLocaleDateString('pt-BR');
  return `${tipoLabel(stage.value.tipo)} — ${timePart && timePart !== '00:00' ? `${dateStr} ${timePart}` : dateStr}`;
});

const hasPairs = computed(() => leagueStore.playoffPairs.length > 0);
const hasBracket = computed(() => leagueStore.playoffMatches.length > 0);

const sortedFinalists = computed(() =>
  [...leagueStore.stageFinalists].sort((a, b) => a.group_position - b.group_position || b.pts - a.pts || b.saldo_games - a.saldo_games),
);

const ROUND_ORDER = ['oitavas', 'quartas', 'semi', 'terceiro', 'final'];
const ROUND_LABELS = computed(() => ({
  oitavas: t('stage_playoffs.round_oitavas'),
  quartas: t('stage_playoffs.round_quartas'),
  semi: t('stage_playoffs.round_semi'),
  terceiro: t('stage_playoffs.round_terceiro'),
  final: t('stage_playoffs.round_final'),
}));

const bracketRounds = computed(() => {
  if (!hasBracket.value) return [];
  const rounds = [];
  for (const name of ROUND_ORDER) {
    const matches = leagueStore.playoffMatches.filter((m) => m.round_name === name);
    if (matches.length) rounds.push({ name, label: ROUND_LABELS.value[name], matches });
  }
  return rounds;
});

const bracketRoundNames = computed(() => {
  const n = leagueStore.playoffPairs.length;
  const slots = nextPowerOf2(n);
  const names = { 2: [t('stage_playoffs.round_final')], 4: [t('stage_playoffs.round_semi'), t('stage_playoffs.round_final')], 8: [t('stage_playoffs.round_quartas'), t('stage_playoffs.round_semi'), t('stage_playoffs.round_final')], 16: [t('stage_playoffs.round_oitavas'), t('stage_playoffs.round_quartas'), t('stage_playoffs.round_semi'), t('stage_playoffs.round_final')] };
  return (names[slots] || [t('stage_playoffs.round_final')]).concat(hasThirdPlace.value ? [t('stage_playoffs.round_terceiro')] : []);
});

onMounted(async () => {
  loading.value = true;
  try {
    await leagueStore.fetchLeague(arenaId, leagueId);
    await Promise.all([
      leagueStore.fetchStageFinalists(arenaId, leagueId, stageId),
      leagueStore.fetchPlayoffPairs(arenaId, leagueId, stageId),
      leagueStore.fetchPlayoffMatches(arenaId, leagueId, stageId),
    ]);
  } finally {
    loading.value = false;
  }
});

function openPairsDialog() { pairMethod.value = 'order'; pairsDialog.value = true; }

function buildPairs(finalists, method) {
  let ordered = [...finalists];
  if (method === 'random') { ordered = ordered.sort(() => Math.random() - 0.5); }
  else if (method === 'split') {
    const n = ordered.length;
    const half = Math.floor(n / 2);
    const bestCount = half % 2 !== 0 ? half - 1 : half;
    const best = ordered.slice(0, bestCount).sort(() => Math.random() - 0.5);
    const worst = ordered.slice(bestCount).sort(() => Math.random() - 0.5);
    ordered = [...best, ...worst];
  }
  // Para dupla-fixa: cada finalista JÁ é uma dupla → 1 slot por finalista
  if (isDupla.value) return ordered.map((f) => [f]);
  // Para simples: 2 finalistas formam 1 par de chave
  const pairs = [];
  for (let i = 0; i < ordered.length - 1; i += 2) pairs.push([ordered[i], ordered[i + 1]]);
  return pairs;
}

function rankPairs(pairs) {
  if (isDupla.value) {
    return pairs
      .map(([f1]) => ({
        finalist1_id: f1.id,
        finalist2_id: null,
        pts_total:     f1.pts || 0,
        gp_total:      f1.gp  || 0,
        gc_total:      f1.gc  || 0,
        position_sum:  f1.group_position || 0,
      }))
      .sort((a, b) => a.position_sum - b.position_sum || b.pts_total - a.pts_total)
      .map((p, i) => ({ ...p, pair_rank: i + 1 }));
  }
  return pairs
    .map(([f1, f2]) => ({ finalist1_id: f1.id, finalist2_id: f2.id, pts_total: (f1.pts || 0) + (f2.pts || 0), gp_total: (f1.gp || 0) + (f2.gp || 0), gc_total: (f1.gc || 0) + (f2.gc || 0), position_sum: (f1.group_position || 0) + (f2.group_position || 0) }))
    .sort((a, b) => a.position_sum - b.position_sum || b.pts_total - a.pts_total || b.gp_total - b.gc_total - (a.gp_total - a.gc_total))
    .map((p, i) => ({ ...p, pair_rank: i + 1 }));
}

async function onDrawPairs() {
  savingPairs.value = true;
  try {
    const pairs = buildPairs(sortedFinalists.value, pairMethod.value);
    const payload = rankPairs(pairs);
    await leagueStore.savePlayoffPairs(arenaId, leagueId, stageId, payload);
    leagueStore.playoffMatches = [];
    pairsDialog.value = false;
    $q.notify({ type: 'positive', message: t('stage_playoffs.notify_pairs_created'), position: 'top', icon: 'check_circle' });
  } catch {
    $q.notify({ type: 'negative', message: t('stage_playoffs.notify_pairs_error'), position: 'top' });
  } finally {
    savingPairs.value = false;
  }
}

function openBracketDialog() { bracketDialog.value = true; }

function nextPowerOf2(n) { let p = 1; while (p < n) p *= 2; return p; }

function getRounds(slots) {
  const r = { 2: ['final'], 4: ['semi', 'final'], 8: ['quartas', 'semi', 'final'], 16: ['oitavas', 'quartas', 'semi', 'final'] };
  return r[slots] || ['final'];
}

function generateBracket(pairs, thirdPlace) {
  const n = pairs.length;
  const slots = nextPowerOf2(n);
  const byes = slots - n;
  const rounds = getRounds(slots);
  const firstCount = slots / 2;
  const matches = [];
  for (let m = 1; m <= firstCount; m++) {
    const topIdx = m - 1;
    const botIdx = slots - m;
    const isBye = topIdx < byes;
    const pair1 = topIdx < n ? pairs[topIdx] : null;
    const pair2 = !isBye && botIdx < n ? pairs[botIdx] : null;
    matches.push({ round_name: rounds[0], match_number: m, pair1_id: pair1?.id ?? null, pair2_id: pair2?.id ?? null, is_bye: isBye, winner_pair_id: isBye ? (pair1?.id ?? null) : null });
  }
  for (let r = 1; r < rounds.length; r++) {
    const cnt = firstCount / Math.pow(2, r);
    for (let m = 1; m <= cnt; m++) matches.push({ round_name: rounds[r], match_number: m, pair1_id: null, pair2_id: null, is_bye: false, winner_pair_id: null });
  }
  propagateByes(matches, rounds);
  if (thirdPlace) matches.push({ round_name: 'terceiro', match_number: 1, pair1_id: null, pair2_id: null, is_bye: false, winner_pair_id: null });
  return matches;
}

function propagateByes(matches, rounds) {
  for (let r = 0; r < rounds.length - 1; r++) {
    const cur = matches.filter((m) => m.round_name === rounds[r]);
    const half = cur.length / 2;
    cur.forEach((match, i) => {
      if (!match.winner_pair_id) return;
      const nextNum = (i % half) + 1;
      const slot = Math.floor(i / half) + 1;
      const next = matches.find((m) => m.round_name === rounds[r + 1] && m.match_number === nextNum);
      if (next) { if (slot === 1) next.pair1_id = match.winner_pair_id; else next.pair2_id = match.winner_pair_id; }
    });
  }
}

async function onDrawBracket() {
  savingBracket.value = true;
  try {
    const pairs = leagueStore.playoffPairs;
    const matchPayload = generateBracket(pairs, hasThirdPlace.value);
    await leagueStore.savePlayoffMatches(arenaId, leagueId, stageId, matchPayload);
    bracketDialog.value = false;
    $q.notify({ type: 'positive', message: t('stage_playoffs.notify_bracket_created'), position: 'top', icon: 'check_circle' });
  } catch {
    $q.notify({ type: 'negative', message: t('stage_playoffs.notify_bracket_error'), position: 'top' });
  } finally {
    savingBracket.value = false;
  }
}

function getNextMainRound(presentRounds, currentRound) {
  const mainRounds = presentRounds.filter((r) => r !== 'terceiro');
  const idx = mainRounds.indexOf(currentRound);
  if (idx === -1 || idx === mainRounds.length - 1) return null;
  return mainRounds[idx + 1];
}

async function propagateWinner(match, winnerId, loserId) {
  const presentRounds = ROUND_ORDER.filter((r) => leagueStore.playoffMatches.some((m) => m.round_name === r));
  const nextRound = getNextMainRound(presentRounds, match.round_name);
  if (nextRound) {
    const curMatches = leagueStore.playoffMatches.filter((m) => m.round_name === match.round_name).sort((a, b) => a.match_number - b.match_number);
    const idx = curMatches.findIndex((m) => m.id === match.id);
    if (idx !== -1) {
      const half = curMatches.length / 2;
      const nextNum = (idx % half) + 1;
      const slot = Math.floor(idx / half) + 1;
      const nextMatch = leagueStore.playoffMatches.find((m) => m.round_name === nextRound && m.match_number === nextNum);
      if (nextMatch) {
        const update = slot === 1 ? { pair1_id: winnerId } : { pair2_id: winnerId };
        await leagueStore.updatePlayoffMatch(arenaId, leagueId, stageId, nextMatch.id, update);
        const winnerPair = leagueStore.playoffPairs.find((p) => p.id === winnerId);
        if (slot === 1) nextMatch.pair1 = winnerPair ?? null;
        else nextMatch.pair2 = winnerPair ?? null;
      }
    }
  }
  if (match.round_name === 'semi' && loserId !== null) {
    const terceiro = leagueStore.playoffMatches.find((m) => m.round_name === 'terceiro');
    if (terceiro) {
      const update = match.match_number === 1 ? { pair1_id: loserId } : { pair2_id: loserId };
      await leagueStore.updatePlayoffMatch(arenaId, leagueId, stageId, terceiro.id, update);
      const loserPair = leagueStore.playoffPairs.find((p) => p.id === loserId);
      if (match.match_number === 1) terceiro.pair1 = loserPair ?? null;
      else terceiro.pair2 = loserPair ?? null;
    }
  }
}

const debouncedScore = debounce(async (match, data) => {
  try {
    const sp = data.score_p !== undefined ? data.score_p : match.score_p;
    const sq = data.score_q !== undefined ? data.score_q : match.score_q;
    let winnerId = null;
    let loserId = null;
    if (sp !== null && sq !== null) {
      if (sp > sq) { winnerId = match.pair1_id; loserId = match.pair2_id; }
      else if (sq > sp) { winnerId = match.pair2_id; loserId = match.pair1_id; }
    }
    await leagueStore.updatePlayoffMatch(arenaId, leagueId, stageId, match.id, { ...data, winner_pair_id: winnerId });
    if (winnerId !== null) await propagateWinner(match, winnerId, loserId);
  } catch {
    $q.notify({ type: 'negative', message: t('stage_playoffs.notify_score_error'), position: 'top' });
  }
}, 600);

function onBtMatchScore(match, { side, value }) {
  match[side] = value;
  debouncedScore(match, { [side]: value });
}

const allResultsDefined = computed(() => {
  if (!hasBracket.value) return false;
  return leagueStore.playoffMatches.filter((m) => !m.is_bye).every((m) => m.winner_pair_id !== null);
});

async function onGenerateRanking() {
  generatingRanking.value = true;
  try {
    await leagueStore.generateStageRanking(arenaId, leagueId, stageId);
    router.push({ name: 'stage-ranking', params: { id: arenaId, leagueId, stageId } });
  } catch {
    $q.notify({ type: 'negative', message: t('stage_playoffs.notify_ranking_error'), position: 'top' });
  } finally {
    generatingRanking.value = false;
  }
}

function pairToPlayers(pair) {
  if (!pair) return [];
  if (isDupla.value) {
    // Cada pair = 1 dupla fixa: mostrar jogador + parceiro do finalist1
    const f = pair.finalist1;
    if (!f?.player?.name) return [];
    const players = [{ name: f.player.name, partner_name: null, color: f.color || '#64748b' }];
    if (f.player.partner_name) players.push({ name: f.player.partner_name, partner_name: null, color: f.color || '#64748b' });
    return players;
  }
  // Simples: 2 finalistas formam 1 lado do jogo
  return [
    { name: pair.finalist1?.player?.name || '—', partner_name: pair.finalist1?.player?.partner_name || null, color: pair.finalist1?.color || '#64748b' },
    { name: pair.finalist2?.player?.name || '—', partner_name: pair.finalist2?.player?.partner_name || null, color: pair.finalist2?.color || '#64748b' },
  ].filter((p) => p.name && p.name !== '—');
}

function groupColor(letter) {
  const idx = GROUP_LETTERS.indexOf(letter);
  return GROUP_COLORS[idx % GROUP_COLORS.length] || '#64748b';
}

function getInitial(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return (parts[parts.length - 1]?.charAt(0) || name.charAt(0)).toUpperCase();
}

function goToStage() {
  router.push({ name: 'stage-detail', params: { id: arenaId, leagueId, stageId } });
}
</script>

<style scoped>
.tracking-widest { letter-spacing: 0.08em; }
.text-2xl { font-size: 1.5rem; }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.finalist-table-header, .finalist-table-row, .pair-table-header, .pair-table-row { display: grid; align-items: center; gap: 4px; padding: 7px 16px; }
.finalist-table-header, .pair-table-header { background: #1b2e6e; }
.finalist-table-header { grid-template-columns: 44px 1fr 44px 48px 40px 40px 40px; }
.finalist-table-row { grid-template-columns: 44px 1fr 44px 48px 40px 40px 40px; border-bottom: 1px solid var(--surface-100); transition: background 0.12s; }
.finalist-table-row:last-child { border-bottom: none; }
.finalist-table-row:hover { background: var(--surface-50); }
.pair-table-header { grid-template-columns: 36px 1fr 48px 44px 40px 40px; }
.pair-table-row { grid-template-columns: 36px 1fr 48px 44px 40px 40px; border-bottom: 1px solid var(--surface-100); transition: background 0.12s; padding-top: 10px; padding-bottom: 10px; }
.pair-table-row:last-child { border-bottom: none; }
.pair-table-row:hover { background: var(--surface-50); }
.fth { font-size: 0.58rem; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.07em; text-align: center; }
.fth-left { text-align: left; }
.ft-center { display: flex; justify-content: center; align-items: center; }
.finalist-pts { font-size: 0.8rem; font-weight: 800; color: #1b2e6e; }
.finalist-pos-chip { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 99px; }
.pos-gold { color: #f37021; }
.pos-silver { color: var(--surface-500); }
.finalist-group-badge { width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: #fff; flex-shrink: 0; }
.rr-name-cell { display: flex; align-items: center; gap: 5px; min-width: 0; }
.player-mini-av { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 8px; font-weight: 700; flex-shrink: 0; }
.rr-name { font-size: 0.75rem; font-weight: 500; color: var(--surface-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rr-partner { color: var(--surface-400); font-weight: 400; font-size: 0.7rem; }
.rr-cell { font-size: 0.75rem; font-weight: 700; color: var(--surface-700); text-align: center; }
.rr-pos-val { color: var(--q-positive); }
.rr-neg-val { color: var(--q-negative); }
.pair-players { min-width: 0; }
.pair-method-card { border: 1.5px solid var(--surface-200); transition: all 0.15s; }
.pair-method-card:hover { border-color: var(--q-primary); background: rgba(27, 46, 110, 0.03); }
.method-selected { border-color: var(--q-primary); background: rgba(27, 46, 110, 0.05); }
.radius-md { border-radius: 10px; }
.bracket-grid { display: flex; flex-direction: column; gap: 28px; padding-bottom: 16px; }
.bracket-round { width: 100%; }
.bracket-round-label { font-size: 0.65rem; font-weight: 700; color: var(--surface-400); text-transform: uppercase; letter-spacing: 0.07em; text-align: center; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 4px; }
.bracket-final-round .bracket-round-label { color: #f37021; font-size: 0.75rem; }
.bracket-terceiro-round .bracket-round-label { color: var(--surface-500); }
.bracket-matches { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.bracket-match-card { border-radius: 10px !important; width: 100%; max-width: 600px; }
.bracket-match-final { border: 2px solid #f37021 !important; box-shadow: 0 0 20px rgba(243, 112, 33, 0.15) !important; }
</style>
