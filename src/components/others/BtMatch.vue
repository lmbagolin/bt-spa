<template>
  <div class="bt-match-row" :class="{ 'bt-match-row--hover': !readonly }">
    <!-- Side P (left) -->
    <div class="bt-match-team bt-match-team--left">
      <template v-if="playersP && playersP.length">
        <PlayerChip
          v-for="(player, i) in playersP"
          :key="i"
          :name="player.name"
          :partner="player.partner_name || null"
          :color="player.color"
        />
      </template>
      <span v-else class="bt-match-tbd">A definir</span>
    </div>

    <!-- Score P -->
    <div class="bt-match-score">
      <q-chip v-if="isBye" color="green-1" text-color="green-9" dense class="text-xs text-bold">
        BYE
      </q-chip>
      <bt-input
        v-else
        :model-value="scoreP !== null ? scoreP : ''"
        type="number"
        dense
        outlined
        hide-bottom-space
        no-error-icon
        :readonly="readonly"
        :disable="!canPlay"
        :class="['score-q-input', scoreClassP]"
        placeholder="—"
        input-class="score-inner"
        min="0"
        max="99"
        @update:model-value="onInput('score_p', $event)"
      />
    </div>

    <!-- Separator -->
    <span class="bt-match-vs">×</span>

    <!-- Score Q -->
    <div class="bt-match-score">
      <bt-input
        v-if="!isBye"
        :model-value="scoreQ !== null ? scoreQ : ''"
        type="number"
        dense
        outlined
        hide-bottom-space
        no-error-icon
        :readonly="readonly"
        :disable="!canPlay"
        :class="['score-q-input', scoreClassQ]"
        placeholder="—"
        input-class="score-inner"
        min="0"
        max="99"
        @update:model-value="onInput('score_q', $event)"
      />
    </div>

    <!-- Side Q (right) -->
    <div class="bt-match-team bt-match-team--right">
      <template v-if="playersQ && playersQ.length">
        <PlayerChip
          v-for="(player, i) in playersQ"
          :key="i"
          :name="player.name"
          :partner="player.partner_name || null"
          :color="player.color"
        />
      </template>
      <span v-else-if="isBye">--</span>
      <span v-else class="bt-match-tbd">A definir</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PlayerChip from 'src/components/others/PlayerChip.vue';

const props = defineProps({
  playersP: { type: Array, default: () => [] },
  playersQ: { type: Array, default: () => [] },
  scoreP: { type: Number, default: null },
  scoreQ: { type: Number, default: null },
  isBye: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
});

const emit = defineEmits(['score-input']);

const canPlay = computed(() => props.playersP.length > 0 && props.playersQ.length > 0);

function getWinner() {
  if (props.isBye) return 'p';
  if (props.scoreP === null || props.scoreQ === null) return null;
  if (props.scoreP > props.scoreQ) return 'p';
  if (props.scoreQ > props.scoreP) return 'q';
  return null;
}

const scoreClassP = computed(() => {
  const w = getWinner();
  if (w === 'p') return 'score-win';
  if (w === 'q') return 'score-lose';
  return '';
});

const scoreClassQ = computed(() => {
  const w = getWinner();
  if (w === 'q') return 'score-win';
  if (w === 'p') return 'score-lose';
  return '';
});

function onInput(side, rawValue) {
  const num = rawValue === '' || rawValue === null ? null : parseInt(rawValue);
  emit('score-input', { side, value: isNaN(num) ? null : num });
}
</script>

<style scoped>
.bt-match-row {
  display: grid;
  grid-template-columns: 1fr 52px 16px 52px 1fr;
  gap: 0;
  padding: 8px 16px;
  align-items: center;
  transition: background 0.12s;
}

.bt-match-row--hover:hover {
  background: var(--surface-50);
}

.bt-match-team {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.bt-match-team--right {
  justify-content: flex-end;
}

.bt-match-tbd {
  font-size: 0.72rem;
  color: var(--surface-400);
  font-style: italic;
}

.bt-match-score {
  display: flex;
  justify-content: center;
}

.bt-match-vs {
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--surface-300);
}

/* ── Score q-input ── */
.score-q-input {
  width: 48px;
}

.score-q-input :deep(.q-field__control) {
  height: 30px;
  min-height: 30px;
  border-radius: 6px;
  padding: 0;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.score-q-input :deep(.q-field__control::before) {
  border-color: var(--surface-200);
}

.score-q-input :deep(.q-field__control::after) {
  border-width: 0;
}

.score-q-input :deep(.q-field__native),
.score-q-input :deep(.score-inner) {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1b2e6e;
  padding: 0 4px;
  min-height: unset;
  -moz-appearance: textfield;
}

.score-q-input :deep(input::-webkit-inner-spin-button),
.score-q-input :deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
}

.score-q-input :deep(.q-field__control:focus-within::before) {
  border-color: #1b2e6e;
  box-shadow: 0 0 0 3px rgba(27, 46, 110, 0.1);
}

/* win / lose states */
.score-q-input.score-win :deep(.q-field__control::before) {
  border-color: var(--q-positive);
}
.score-q-input.score-win :deep(.q-field__control) {
  background: rgba(58, 170, 53, 0.05);
}
.score-q-input.score-win :deep(.q-field__native) {
  color: var(--q-positive);
}

.score-q-input.score-lose :deep(.q-field__control::before) {
  border-color: var(--q-negative);
}
.score-q-input.score-lose :deep(.q-field__control) {
  background: rgba(239, 68, 68, 0.04);
}
.score-q-input.score-lose :deep(.q-field__native) {
  color: var(--q-negative);
}

/* disabled state */
.score-q-input.q-field--disabled :deep(.q-field__control::before) {
  border-color: var(--surface-100);
  border-style: solid;
}
.score-q-input.q-field--disabled :deep(.q-field__native) {
  color: var(--surface-300);
  cursor: not-allowed;
}
</style>
