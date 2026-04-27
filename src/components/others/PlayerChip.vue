<template>
  <div class="player-chip" :class="{ 'player-chip--plain': !background }">
    <div class="player-chip-avatar" :style="{ background: color || '#64748b' }">
      {{ initial }}
    </div>
    <span class="player-chip-name">
      {{ name }}
      <template v-if="partner">
        <span class="player-chip-sep"> / </span>{{ partner }}
      </template>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name:       { type: String, required: true },
  partner:    { type: String, default: null },
  color:      { type: String, default: '#64748b' },
  background: { type: Boolean, default: true },
});

const initial = computed(() => {
  if (!props.name) return '?';
  const parts = props.name.trim().split(' ');
  return (parts[parts.length - 1]?.charAt(0) || props.name.charAt(0)).toUpperCase();
});
</script>

<style scoped>
.player-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 99px;
  padding: 3px 10px 3px 4px;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--surface-700);
}

.player-chip--plain {
  background: transparent;
  border: none;
  padding: 0;
}

.player-chip-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
}

.player-chip-name {
  white-space: nowrap;
}
.player-chip-sep {
  color: var(--surface-400);
  font-weight: 400;
}
</style>
