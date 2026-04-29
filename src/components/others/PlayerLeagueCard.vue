<template>
  <q-card
    class="player-league-card shadow-card cursor-pointer full-height"
    :class="{ 'player-league-card--featured': isNextOfLeague }"
    @click="$emit('click')"
  >
    <!-- Cabeçalho da Arena -->
    <div class="arena-header q-pa-md row items-center no-wrap q-gutter-sm">
      <q-avatar size="40px" color="surface-100" class="arena-avatar">
        <img v-if="league.arena?.logo_url" :src="league.arena.logo_url" />
        <q-icon v-else name="sports_tennis" size="20px" color="surface-400" />
      </q-avatar>
      <div class="col ellipsis">
        <div class="text-sm text-bold text-surface-900 ellipsis">
          {{ league.arena?.name ?? '—' }}
        </div>
        <div class="text-xs text-surface-400">
          {{ league.arena?.city ?? '' }}
        </div>
      </div>
      <q-chip
        v-if="isNextOfLeague"
        dense
        color="primary"
        text-color="white"
        class="text-bold q-ma-none"
        style="font-size: 0.6rem; height: 18px"
      >
        {{ t('player_league_card.next_stage') }}
      </q-chip>
    </div>

    <q-separator color="surface-100" />

    <!-- Corpo -->
    <q-card-section class="q-pa-lg">
      <!-- Nome da liga + chips -->
      <div class="row items-start justify-between no-wrap q-mb-sm">
        <div class="col ellipsis">
          <div class="text-base text-bold text-surface-900 ellipsis">{{ league.nome }}</div>
          <div class="row items-center q-mt-xs">
            <q-chip
              v-if="league.gender"
              dense
              :color="generoColor(league.gender)"
              text-color="white"
              class="text-bold q-ma-none q-mr-xs"
              style="font-size: 0.6rem; height: 18px"
            >
              {{ generoLabel(league.gender) }}
            </q-chip>
            <q-chip
              v-if="league.nivel"
              dense
              color="surface-100"
              text-color="surface-700"
              class="text-bold q-ma-none"
              style="font-size: 0.6rem; height: 18px"
            >
              {{ league.nivel }}
            </q-chip>
          </div>
        </div>
        <q-icon name="chevron_right" color="surface-300" size="20px" />
      </div>

      <!-- Caixa da etapa -->
      <div class="stage-box q-pa-md q-mt-md">
        <div class="row items-center justify-between no-wrap q-mb-xs">
          <span class="text-xs text-bold text-surface-700">{{ tipoLabel(stage.tipo) }}</span>
          <q-chip
            dense
            color="blue-1"
            text-color="blue-9"
            class="text-bold q-ma-none"
            style="font-size: 0.6rem; height: 18px"
          >
            {{ t('player_league_card.registrations_open') }}
          </q-chip>
        </div>
        <div class="text-sm text-bold text-surface-900">
          {{ getDayOfWeek(stage.data_etapa) }}, {{ formatDay(stage.data_etapa) }} de
          {{ formatMonthYear(stage.data_etapa) }}
          <span v-if="formatTime(stage.data_etapa)" class="text-surface-500 text-normal">
            · {{ formatTime(stage.data_etapa) }}
          </span>
        </div>
        <div class="text-xs text-surface-400 q-mt-xs">
          {{ getDaysUntil(stage.data_etapa) }}
        </div>

        <q-separator color="surface-100" class="q-my-sm" />

        <div class="row items-center q-gutter-lg">
          <div>
            <div class="text-xs text-surface-400">
              {{ t('player_league_card.label_registration') }}
            </div>
            <div class="text-sm text-bold text-positive">
              {{ formatCurrency(stage.valor_inscricao) }}
            </div>
          </div>
          <div>
            <div class="text-xs text-surface-400">
              {{ t('player_league_card.label_per_group') }}
            </div>
            <div class="text-sm text-bold text-surface-700">
              {{ stage.jogadores_por_grupo }}
              {{ t('player_league_card.label_players', stage.jogadores_por_grupo) }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Ações -->
    <q-separator color="surface-100" />
    <q-card-actions class="q-px-lg q-py-sm">
      <q-btn
        flat
        dense
        no-caps
        size="sm"
        icon="info"
        :label="t('player_league_card.btn_view_league')"
        color="primary"
        class="text-bold"
        @click.stop="$emit('click')"
      />
      <q-space />
      <q-btn
        flat
        dense
        no-caps
        size="sm"
        icon="app_registration"
        :label="t('player_league_card.btn_register')"
        color="positive"
        class="text-bold"
        @click.stop="$emit('register')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { tipoLabel } from 'src/composables/useStageTypes';

const { t } = useI18n();

defineProps({
  league: { type: Object, required: true },
  stage: { type: Object, required: true },
  isNextOfLeague: { type: Boolean, default: false },
});

defineEmits(['click', 'register']);

const GENERO_MAP = {
  male:   { label: () => t('player_league_card.gender_male'),   color: 'blue-8'  },
  female: { label: () => t('player_league_card.gender_female'), color: 'pink-8'  },
  mixed:  { label: () => t('player_league_card.gender_mixed'),  color: 'green-8' },
};
function generoLabel(g) {
  return GENERO_MAP[g]?.label() ?? g;
}
function generoColor(g) {
  return GENERO_MAP[g]?.color ?? 'rgba(255,255,255,0.15)';
}

function parseDate(str) {
  if (!str) return new Date(NaN);
  return new Date(str.replace(' ', 'T'));
}

function formatDay(dateStr) {
  if (!dateStr) return '--';
  return parseDate(dateStr).toLocaleDateString('pt-BR', { day: '2-digit' });
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const timePart = dateStr.split(' ')[1];
  return timePart && timePart !== '00:00' ? timePart : '';
}

function getDayOfWeek(dateStr) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[parseDate(dateStr).getDay()];
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
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

<style scoped>
.player-league-card {
  transition:
    box-shadow 0.15s,
    transform 0.15s;
}
.player-league-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}
.player-league-card--featured {
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.12) !important;
}

.arena-header {
}
.arena-avatar {
  border: 2px solid var(--surface-100);
  flex-shrink: 0;
}
.stage-box {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
  border-radius: 8px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-base {
  font-size: 0.9375rem;
}
</style>
