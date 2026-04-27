<template>
  <q-card
    class="league-card border-surface-100 shadow-card cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Body -->
    <q-card-section class="q-pa-lg">
      <!-- Name + chevron -->
      <div class="row items-start justify-between no-wrap q-mb-md">
        <div class="col ellipsis">
          <div class="text-base text-bold text-surface-900 ellipsis">{{ league.nome }}</div>
          <div class="text-xs text-surface-400 q-mt-xs">
            <q-chip
              v-if="league.genero"
              dense
              :color="generoColor(league.genero)"
              text-color="white"
              class="text-xs text-bold q-mr-xs"
              style="height:18px;font-size:0.6rem"
            >
              {{ generoLabel(league.genero) }}
            </q-chip>
            {{ league.total_stages ?? league.numero_etapas ?? 0 }}
            etapa{{ (league.total_stages ?? league.numero_etapas ?? 0) !== 1 ? 's' : '' }}
            <template v-if="league.closed_stages != null">
              · {{ league.closed_stages }} encerrada{{ league.closed_stages !== 1 ? 's' : '' }}
            </template>
          </div>
        </div>
        <q-icon name="chevron_right" color="surface-300" size="20px" />
      </div>

      <!-- Progress bar -->
      <div v-if="totalStages > 0" class="q-mb-md">
        <div class="row items-center justify-between q-mb-xs">
          <span class="text-xs text-surface-400">Progresso</span>
          <span class="text-xs text-bold text-surface-600">
            {{ league.closed_stages ?? 0 }}/{{ totalStages }}
          </span>
        </div>
        <q-linear-progress
          :value="progressValue"
          color="positive"
          track-color="surface-100"
          rounded
          style="height: 6px"
        />
      </div>

      <!-- Active stage -->
      <div v-if="league.active_stage" class="active-stage-box q-pa-md">
        <div class="row items-center justify-between no-wrap q-mb-xs">
          <span class="text-xs text-bold text-surface-700">Etapa em andamento</span>
          <q-chip
            dense
            :color="statusColor(league.active_stage.stage_status).bg"
            :text-color="statusColor(league.active_stage.stage_status).text"
            class="text-xs text-bold"
          >
            {{ statusLabel(league.active_stage.stage_status) }}
          </q-chip>
        </div>
        <div class="text-sm text-bold text-surface-900">
          {{ tipoLabel(league.active_stage.tipo) }} — {{ formatDate(league.active_stage.data_etapa) }}
        </div>
        <div class="text-xs text-surface-400 q-mt-xs">
          {{ league.active_stage.registrations }}
          inscrito{{ league.active_stage.registrations !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Last closed stage -->
      <div v-else-if="league.last_closed_stage" class="text-xs text-surface-400 q-mt-sm">
        <q-icon name="check_circle" color="positive" size="14px" class="q-mr-xs" />
        Última etapa: {{ tipoLabel(league.last_closed_stage.tipo) }} —
        {{ formatDate(league.last_closed_stage.data_etapa) }}
      </div>

      <div v-else class="text-xs text-surface-300 q-mt-sm">Nenhuma etapa cadastrada ainda</div>
    </q-card-section>

    <!-- Actions -->
    <q-separator color="surface-100" />
    <q-card-actions class="q-px-lg q-py-sm">
      <q-btn flat dense no-caps size="sm" icon="grid_view" label="Etapas"
        color="primary" class="text-bold" @click.stop="$emit('stages')" />
      <q-btn
        v-if="league.active_stage || league.closed_stages > 0"
        flat dense no-caps size="sm" icon="bar_chart" label="Ranking"
        color="surface-500" class="text-bold" @click.stop="$emit('ranking')"
      />
      <q-space />
      <template v-if="onEdit || onDelete">
        <q-btn v-if="onEdit" flat round dense size="sm" icon="edit" color="surface-400"
          @click.stop="onEdit()">
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn v-if="onDelete" flat round dense size="sm" icon="delete" color="negative"
          @click.stop="onDelete()">
          <q-tooltip>Remover</q-tooltip>
        </q-btn>
      </template>
      <q-btn
        v-else-if="league.active_stage"
        flat dense no-caps size="sm" icon="arrow_forward" label="Ver etapa"
        color="orange" class="text-bold" @click.stop="$emit('active-stage')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { tipoLabel } from 'src/composables/useStageTypes';

const props = defineProps({
  league:   { type: Object, required: true },
  onEdit:   { type: Function, default: null },
  onDelete: { type: Function, default: null },
});

defineEmits(['click', 'stages', 'ranking', 'edit', 'delete', 'active-stage']);

const totalStages = computed(() => props.league.total_stages ?? props.league.numero_etapas ?? 0);
const progressValue = computed(() => {
  if (!totalStages.value) return 0;
  return (props.league.closed_stages ?? 0) / totalStages.value;
});

const GENERO_MAP = {
  masculino: { label: 'Masculino', color: 'blue' },
  feminino:  { label: 'Feminino',  color: 'pink' },
  misto:     { label: 'Misto',     color: 'purple' },
};
function generoLabel(g) { return GENERO_MAP[g]?.label ?? g; }
function generoColor(g)  { return GENERO_MAP[g]?.color ?? 'grey'; }

const STATUS_MAP = {
  created:            { label: 'Criada',             bg: 'surface-100', text: 'surface-600' },
  registrations_open: { label: 'Inscrições abertas', bg: 'blue-1',      text: 'blue-9'      },
  group_draw:         { label: 'Sorteio grupos',     bg: 'purple-1',    text: 'purple-9'    },
  group_stage:        { label: 'Fase de grupos',     bg: 'orange-1',    text: 'orange-9'    },
  playoffs:           { label: 'Playoffs',           bg: 'green-1',     text: 'green-9'     },
  closed:             { label: 'Encerrada',          bg: 'grey-2',      text: 'grey-8'      },
};

function statusLabel(s) { return STATUS_MAP[s]?.label ?? s; }
function statusColor(s) { return STATUS_MAP[s] ?? { bg: 'surface-100', text: 'surface-600' }; }

function formatDate(d) {
  if (!d) return '—';
  const [datePart, timePart] = d.toString().split(' ');
  const [y, m, day] = datePart.split('-');
  const dateStr = `${day}/${m}/${y}`;
  return timePart && timePart !== '00:00' ? `${dateStr} ${timePart}` : dateStr;
}
</script>

<style scoped>
.league-card {
  transition: box-shadow 0.15s, transform 0.15s;
}
.league-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-stage-box {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
  border-radius: 8px;
}
</style>
